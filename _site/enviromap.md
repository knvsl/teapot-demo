<a name="top"></a>
## Environment Mapping

Environment mapping or [reflection mapping](https://en.wikipedia.org/wiki/Reflection_mapping) uses texture mapping to create the appearance of reflections on surfaces. In this demo we first set up a skybox for our background. We can then implement reflection and refraction by sampling the cubemap texture, this is known as cubemapping.


**Jump to Section**:  

[Skybox](#skybox)  
[Reflection](#reflection)  
[Refraction](#refraction)  

[Back to main](./)
<br>
<br>

__________


<a name="skybox"></a>
### Skybox

A skybox is essentially a cube that surrounds the scene. The six inner walls of the cube then act as a distant background. Setting up the skybox requires a bit more than just creating uniforms so included below is some of the Javascript in addition to the shader code.

To set up the skybox we need the images that will be used for the cubemap. All of the skyboxes in the demo are from [Custom Map Makers](http://www.custommapmakers.org/skyboxes.php). We need six images to represent the six sides of the skybox.

The last two characters in the image name identify which side of the cube that particular image corresponds to, for example the image below is the front face of the whirlpool cubemap.

 `whirlpool_ft.png`    

We use ft, bk, up, down, rt, lf to represent front, back, up, down, right, and left respectively.

We need to be sure to load the images in the right order so the cube is assembled properly. We will do this using Three.js `CubeTextureLoader()`. The order the images should be loaded in is specified as follows:

  `px.png`  
		`nx.png`  
		`py.png`  
		`ny.png`  
		`pz.png`  
		`nz.png`

Where px corresponds to positive x, nx corresponds to negative x and so on. To clarify:

`positive x = front`  
`negative x = back`  
`positive y = up`  
`negative y = down`  
`positive z = right`  
`negative z = left`

We load the cubemap as below and then pass this to the shader as a uniform.

```javascript
var cubemap = new THREE.CubeTextureLoader()
  .setPath( 'img/whirlpool/' )
  .load([
    'whirlpool_ft.png', 'whirlpool_bk.png',
    'whirlpool_up.png', 'whirlpool_dn.png',
    'whirlpool_rt.png', 'whirlpool_lf.png'
  ]);
```

The other thing we need to do in our Javascript is create the actual cube geometry. We can do this using the Three.js `BoxGeometry()`. One thing to note is that the size of the box won't change how it looks, it just needs to be large enough to account for where things in the scene are positioned.

### Vertex Shader

Our skybox shader has one uniform which is the cubemap we loaded. The `glsl` type `samplerCube` is for holding cubemap textures. We also define a varying variable `vPosition` which is our position vector.

```glsl
uniform samplerCube skybox;
varying vec3 vPosition;
```

We set `vPosition` as our position in world coordinates. We can use these world coordinates of our cube as our texture coordinates to color the faces of the box.

```glsl
vPosition = vec3(modelMatrix * vec4(position, 1.0));
```

The last thing we need to do is ensure that we always remain inside the skybox. We don't want to be able to zoom past it or go outside our background. A simple way to do this is to move with the camera, so we always remain inside the skybox. To do this we can alter our output of `gl_Position`

```glsl
gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
```

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/skybox.vs.glsl)

### Fragment Shader

Our fragment shader is quite simple as well. `glsl` provides the `textureCube()` function that samples a cubemap texture for us. `textureCube()` takes in a cubemap and a `vec3` coordinate. It returns a texel, or the color at the given coordinate. We will use our world coordinates as the texture coordinates in this case which means that we're coloring our box geometry according to the six faces of our cubemap.

```glsl
vec4 color = textureCube(skybox, vPosition);
```

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/skybox.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)

______

<a name="reflection"></a>
### Reflection

The general idea behind the reflection shader is that we can calculate the bounce vector or reflection vector and then use this to sample our cubemap. The bounce vector points towards the area that you would see in a mirror, the result is a surface that looks like it is reflecting the skybox.

The bounce vector can be imagined as bouncing off our surface and pointing in the direction of some area of the cubemap. Where the bounce vector points then determines the color of the surface.

#### Vertex Shader

To calculate our bounce or reflected vector, we need a view vector and our surface normal, we can use the negative of our position as our view vector. We also define the skybox as a uniform.

```glsl
uniform samplerCube skybox;
varying vec3 vNormal;
varying vec3 vPosition;
```

As usual we set our varying variables to pass to the fragment shader.

```glsl
vNormal = vec3(modelMatrix * vec4(normal, 0.0));
vPosition = vec3(modelMatrix * vec4(position, 1.0));
```

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/reflection.vs.glsl)

#### Fragment Shader

In the fragment shader we need to calculate the bounce vector and then use this to sample our cubemap. OpenGL provides a `reflect()` function that returns the bounce vector given a normal and and incident vector (our view vector). Below is how to calculate the bounce vector by hand.

```glsl
	vec3 b = -v + 2.0 * dot(v,n) * n;
```

Lastly we simply sample the cubemap using the bounce vector.

```glsl
vec4 color = textureCube(skybox, b);
```

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/reflection.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)

______

### Refraction

We'll use [Snell's Law](https://en.wikipedia.org/wiki/Snell%27s_law) for our [refraction](https://en.wikipedia.org/wiki/Refraction) shader. Snell's law describes how to calculate the change in vector direction as it goes through a material. For example, the way light bends as it travels though water or a glass.

#### Vertex Shader

Our vertex shader is the same as reflection. We just need to pass the surface normal and our position to the fragment shader. In addition to defining the skybox as a uniform, we will also define a uniform to control the [refractive index](https://en.wikipedia.org/wiki/Refractive_index). Transparent materials have a refractive index between 1 and 2, you can see the effect of this by running the demo.

```glsl
uniform float index;
```

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/refraction.vs.glsl)

#### Fragment Shader

As with reflection, OpenGL also provides a `refract()` function that, given the incidence vector (our view vector), surface normal, and refractive index, returns the refraction direction. Below we show how to calculate this by hand.

After normalizing our vectors we first calculate the angle of refraction, which describes how much the light bends.

```glsl
float angle = 1.0 - pow(index, 2.0) * (1.0 - pow(dot(n, v), 2.0));
```

Then we calculate our refracted vector using Snell's Law.

```glsl
if (angle < 0.0)
     r = vec3(0.0, 0.0, 0.0);
 else
     r = index * v - (index * dot(n, v) + sqrt(angle)) * n;
```
The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/refraction.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)
