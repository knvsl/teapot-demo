# teapot-demo
A simple graphics demo using Three.js and dat.GUI for learning about lighting and shading. Tutorial to come...

All skyboxes sourced from: http://www.custommapmakers.org/skyboxes.php

## Customize
### Skyboxes
To add a new skybox the 6 images must be placed in a folder with name "your-name" and named individually with the convention below:

"your-name_ft.png"  
"your-name_bk.png"  
"your-name_up.png"  
"your-name_dn.png"  
"your-name_rt.png"  
"your-name_lf.png" 

Add the skybox by placing the folder inside the "img" folder and add a thumbnail inside the html where the id is the same as "your-name"

Example (demo.html):
```html
    <img id="your-name" onclick="updateSkybox(this.id)" src="img/your-name/your-name_lf.png" alt=""/>
```
### Organization
#### GLSL
This folder contains all the custom shaders. Many of the vertex/fragment shaders are very similar but are kept individual for learning purposes
#### JS

`settings.js` Contains all the settings & default values for the demo. This is the only place you would need to change any values directly. Default settings are inside the `defaults` object.

`controllers.js` Contains all the code that sets up the dat.GUI controllers. The default initial shader and GUI displayed is Phong.

`helpers.js` Helper functions that the dat.GUI controllers call like the reset button, switching the shaders etc. are all located here.

`shaders.js` Contains all the code that sets up and loads the custom shaders. Uniforms that are shared by the various shaders are declared at the top. 

#### Add a new shader
1. Place the file inside the `glsl` folder. 

2. Inside `settings.js` add a new constant for the shader that will be used for switching shaders and add a menu option to the `shaderMenu` object in order to select the new shader in the controllers.

   Example: 
   ```javascript
       const MYSHADER = 6; 
       
       var shaderMenu = {
       
               ...
               
        MyShaderMenuName : MYSHADER
        }
   ```
3. In `shaders.js` follow the format of the other shaders to create the material and load the glsl files. 

4. In `controllers.js` build a GUI for the new shader and add the shader to the array of shaders.  
   
   Example:
   ```javascript
       var myshader = new shader(myshaderMaterial, myshaderGUI);  
       shaders[MYSHADER] = myshader;
   ```
