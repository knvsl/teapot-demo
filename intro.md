<a name="intro"></a>
## Getting Started

This project is a demo of some common shading and reflection models in graphics.  

While Three.js provides implementations of many of the materials used, all of the shaders are implemented individually and are accompanied by brief explanations in the sections [Shading Models](shading.html) and [Environment Mapping](enviromap.html).


**Jump to Section**:  

[Setup](#setup)  
[Organization](#organization)  
[Adding Skyboxes](#skybox)  
[Adding Shaders](#shader)  

[Back to main](./)
<br>
<br>

__________

<a name="setup"></a>
### Prerequisites

To run the demo locally you can use node.js `http-server` or something alike.

Your browser must support WebGL. Firefox and Chrome are recommended.

>Note: Firefox or Chrome are recommended. Not tested on IE.
>
There is a known warning in Safari and some older versions of Chrome and Firefox, see [here](https://github.com/mrdoob/three.js/issues/9716) if you encounter this:<br>
`WARNING: 0:1: extension 'GL_ARB_gpu_shader5' is not supported`<br>


### Installing

1. Download the source from Github

2. Install http-server if it isn't already with the following command:
```
npm install http-server -g
```
3. Navigate to the root directory of the project

4. Start the server from the command line where `-p` is an optional flag to specify the port, 8000 in this case (default 8080):
```
http-server -p 8000
```
5. Using the browser open the demo.html file to view the demo.  

>Note: Firefox or Chrome is recommended (not tested in IE)

<br>
<br>  

____

<a name="organization"></a>
### Organization

#### glsl
This folder contains all the custom shaders.

#### img
This folder contains a separate folder for each set of skybox images.

#### js
<span style="background-color:#E5E7E9">&nbsp;`demo.js` </span>  
This is the main demo file where the scene is created and rendered.

<span style="background-color:#E5E7E9">&nbsp;`settings.js` </span>  
Contains all the settings & default values for the demo. This is the only place you would need to change any values directly. Default settings are inside the `defaults` object.

<span style="background-color:#E5E7E9">&nbsp;`controllers.js` </span>  
Contains all the code that sets up the dat.GUI controllers.

<span style="background-color:#E5E7E9">&nbsp;`helpers.js` </span>  
Helper functions that the dat.GUI controllers call like the reset button, switching the shaders etc. are all located here.

<span style="background-color:#E5E7E9">&nbsp;`shaders.js` </span>  
Contains all the code that sets up and loads the custom shaders. Uniforms that are shared by the various shaders are declared at the top.

#### obj
This contains the models used in the demo.

<br>
<br>  

____

<a name="skybox"></a>
### Adding a new Skybox

1. To add a new skybox the 6 images must be placed in a folder with name `mySkyboxName` and named individually with the convention below, such that the *folder name matches the starting of the image names*:

   `mySkyboxName_ft.png`     
   `mySkyboxName_bk.png`  
   `mySkyboxName_up.png`    
   `mySkyboxName_dn.png`    
   `mySkyboxName_rt.png`    
   `mySkyboxName_lf.png`

2. The 6 images should correspond to the front, back, up, down, right, and left sides of the skybox.

3. Place the folder of images inside the `img` folder of the project.

4. Add a thumbnail inside demo.html where the id is the same as `mySkyBoxName`.

`demo.html:`
```html
    <img id="mySkyboxName" onclick="updateSkybox(this.id)" src="img/mySkyboxName/mySkyboxName_lf.png" alt=""/>
```
<br>
<br>
[Back to top](#intro)

________

<a name="shader"></a>
### Adding a new shader

The follow naming convention is being used for shader files:

Vertex Shaders - `myShaderName.vs.glsl`  
Fragment Shaders - `myShaderName.fs.glsl`

Overview of Steps
* Create any new uniforms required for the shader, this may include creating new default values or variables for dat.GUI access
* In `shaders.js` create the material and load the shader files
* In `settings.js` define a new `const` that is used as a label to switch shaders
* Optionally create a dat.GUI controller for the new shader
* For the controller add the new shader to the array of shaders in `controllers.js`
* Ensure there is a menu option for the new shader in `settings.js`

________

#### In detail:
1. To add a new shader place the file inside the `glsl` folder.

2. Inside `settings.js` define a new `const` for the shader. The shader constants are used to index into an array of shaders for switching between them.<br><br>
`settings.js:`<br>
```javascript
const REFRACTION = 5;
const MYSHADER = 6;
```

3.  Additionally, if you are creating a dat.GUI controller, add a menu option to the `shaderMenu` object in order to select the new shader in the controllers.<br><br>
The property is what is displayed in the menu and the value should be the corresponding `const`.
<br><br>
`settings.js:`
   ```javascript
       var shaderMenu = {
               ...
        MyShaderMenuName : MYSHADER
        }
   ```
4. In `shaders.js` follow the format of the code for other shaders to create the material and then load the glsl files. If you need to create any new uniforms declare them in `shaders.js` but all hardcoded values should be in `settings.js`.

5. In `controllers.js` build a [dat.GUI controller](https://github.com/dataarts/dat.gui) for the new shader and add the shader to the array of shaders so that it can be switched to by the controllers. <br><br>
`controllers.js`
   ```javascript
       var myShader = new shader(myShaderMaterial, myShaderGUI);  
       shaders[MYSHADER] = myShader;
   ```

   > Note: The initial shader and GUI displayed is Phong. The other GUIs are hidden until they are switched to.

<br>
[Back to top](#intro)
