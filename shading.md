<a name="top"></a>
## Shading Models

Each of the sections below include a brief overview of the following shading models, including the code implementation.

**Jump to Section**:  

[Lambertian](#lambertian)  
[Phong](#phong)  
[Blinn-Phong](#bphong)  
[Anisotrophic](#aniso)  

[Back to main](./)
<br>
<br>

__________

<a name="lambertian"></a>
### Lambertian Shading

Also known as diffuse shading, [Lambertian](https://en.wikipedia.org/wiki/Lambertian_reflectance) surfaces are 'matte' surfaces. These are surfaces that reflect light equally in all directions.

The name Lambertian refers to Lambert's Cosine Law which is used to calculate the color of a diffuse surface. Lambert's Cosine Law says that the amount of light on a surface is equal to the cosine of the angle between the light direction and the surface normal. It is independent of where the viewer is.

So to calculate Lambertian shading we need the surface normal as well as the direction of light.

#### Vertex Shader

In our code we set the following uniforms:

```glsl
uniform vec3 lightColor;
uniform vec3 diffuseColor;
uniform vec3 lightPosition;
uniform float kD;
```

We pass in the lights position to calculate the light direction. We also define some additional uniforms. `kD` is the diffuse intensity, `diffuseColor` is the color of the surface under the light, and `lightColor` represents the color of the light itself.

We also define two varying variables, `vLight` will hold our light direction vector and `vNormal` will hold our normal.

```glsl
varying vec3 vLight;
varying vec3 vNormal;
```

First we compute the light direction vector. The `position` attribute is built-in to three.js as well as `normalMatrix` which is our inverse transpose modelViewMatrix.

```glsl
   vec3 worldPosition = vec3(modelMatrix * vec4(position, 1.0));
   vec3 lightDirection = lightPosition - worldPosition;
```

Then we transform both vectors to eye coordinates and set our varying variables.

```glsl
vLight = vec3(viewMatrix * vec4(lightDirection, 0.0));
vNormal = normalMatrix * normal;
```

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/lambertian.vs.glsl)

#### Fragment Shader

After making sure the vectors are normalized we can calculate the diffuse term using Lambert's Law of Cosines. We clamp it to prevent points at negative angles from being lit.

```glsl
float diffuse = max(0.0, dot(l,n));
```

Finally to compute our diffuse light we multiply the diffuse intensity, diffuse color, diffuse term, and light color.

```glsl
vec3 diffuseLight = kD * diffuseColor * diffuse * lightColor;
```

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/lambertian.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)

______

<a name="phong"></a>
### Phong

The [Phong reflection model](https://en.wikipedia.org/wiki/Phong_reflection_model) computes light as a sum of ambient, diffuse, and specular terms. Phong shading emphasizes how shiny surfaces have intense highlights while rough or dull surfaces tend to have more diffused highlights.

Ambient lighting represents light throughout the scene, coming from all directions. It gives a certain level of uniform brightness.

Diffuse light is the same as in Lambertian shading, it is direct light hitting a surface and reflected uniformly in all directions.

Specular light is the bright highlight seen on shiny surfaces. Specular highlights are the concentrated reflection of light in a specific area.

#### Vertex Shader

To calculate our Phong reflection model we need the ambient, diffuse and specular terms. We'll pass in the same uniforms as before since we are still calcuating a diffuse term. Additionally we define the following uniforms:

```glsl
uniform vec3 ambientColor;
uniform vec3 specularColor;
uniform float shininess;
uniform float kA;
uniform float kS;
```

`kA` is the ambient intensity, `kS` the specular intensity and `shininess` is our shininess exponent which we will see in our specular calculation.

The vertex shader is nearly the same as before. The difference is that our specular term relies on the direction of view so we need to compute this as well.

```glsl
vPosition = vec3(viewMatrix * vec4(worldPosition, 1.0));
```

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/phong.vs.glsl)

### Fragment Shader

Specular highlights are reflections of intense light on the surface.

To see the reflection of a point on a mirror the view direction needs to be the same as the reflection direction.

So the Phong specular term is calculated as the dot product between the bounce vector (or reflection vector) and the view vector, which is our direction of view. We then raise this dot product to the power of the shininess exponent to further control the intensity of the specular highlight.

In our code the diffuse term is calculated the same.

The ambient term is computed simply by multiplying the ambient intensity by the ambient light color.

```glsl
vec3 ambientLight = kA * ambientColor;
```
To calculate the specular term we first need to compute the bounce vector

```glsl
vec3 b = -l + 2.0 * dot(l,n) * n;
```

We clamp the dot product of the bounce vector and view vector, and raise this to the power of the shininess exponent.

```glsl
float specular = pow(max(0.0, dot(b,v)), shininess);
```

To compute the total specular light we multiply the specular term we just calculated with the specular intensity, specular color, and the light color.

```glsl
vec3 specularLight = kS * specularColor * specular * lightColor;
```

After calculating the ambient, diffuse, and specular terms we sum them together for our final result.

```glsl
vec3 totalLight = ambientLight + diffuseLight + specularLight;
```

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/phong.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)

_______

<a name="bphong"></a>
### Blinn-Phong

[Blinn-Phong shading](https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_shading_model) builds off of the Phong model, with the difference being in the specular term.

In Blinn-Phong shading we use the halfway vector, which represents the vector halfway between the light direction and the view direction.

If we think about microfacets in a surface, then the halfway vector is the surface normal of the microfacet that reflects light directly at the viewer.

#### Vertex Shader

Our vertex shader is the same as our phong vertex shader.

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/blinn_phong.vs.glsl)
<br><br>

#### Fragment Shader

For the fragment shader we now need to compute the halfway vector instead of the bounce vector.

```glsl
vec3 h = normalize(l + v);
```

All of our calculations remain the same as in Phong except our specular term which will use H instead of B.

```glsl
float specular = pow(max(0.0, dot(h,n)), shininess);
```

As before we sum our ambient, diffuse, and newly calculated specular terms to get the final result.

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/blinn_phong.fs.glsl)
<br>
<br>
<br>
[Back to top](#top)

_____

<a name="aniso"></a>
### Anisotropic

This shader is used to simulate metallic surfaces. An anisotropic surface has directional dependencies, like the reflections on a metal surface.

Here anisotropic shading is implemented using [Ward's Model of Anisotropic Reflection](https://en.wikipedia.org/wiki/Specular_highlight#Ward_anisotropic_distribution)

Again it is the specular term that varies, where we now have parameters `alphaX` and `alphaY` that control the width and height of the specular reflection.

We also use some new vectors, the tangent vector which will represents the brush direction on the surface and the binomial vector which is orthogonal to both the tangent and the surface.

#### Vertex Shader

Our vertex shader is the same as our Phong and Blinn-Phong shader.

The full vertex shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/anisotropic.vs.glsl)
<br><br>

### Fragment Shader

The fragment shader use the tangent and binomial vectors and computes the equation given by Ward's model. The result is a specular reflection that bends as you look at it and whose shape can be controlled to simulate metal.

We normalize all our vectors as usual. The tangent vector is then computed as the cross product between the normal vector and the up vector, which is defined here as (0, 1, 0). The up vector defines what direction is "up".

```glsl
vec3 up = vec3(0.0, 1.0, 0.0);
vec3 t = cross(n,up);
```

The binomial vector is orthogonal to both the surface and the tangent so we can calculate it as the cross product of these two vectors.

```glsl
	vec3 b = cross(n,t);
```

Next we compute the dot products needed and substitute them into our Ward equation to compute the specular term.

```glsl
float ln = max(dot(l,n), 0.0);
float vn = max(dot(v,n), 0.0);
float ht = dot(h,t);
float hb = dot(h,b);
float hn = dot(h,n);

float specular = sqrt(max(ln/vn, 0.0))
                           * exp(-2.0 * (pow(ht/alphaX, 2.0) + pow(hb/alphaY, 2.0)) / (1.0 + hn));
```

As usual we use this new specular term to compute our specular light. Finally we sum the ambient, diffuse and specular light to get our final result.

The full fragment shader is [here](https://github.com/k1mby/teapot-demo/raw/master/shaders/anisotropic.vs.glsl)
<br>
<br>
<br>
[Back to top](#top)
