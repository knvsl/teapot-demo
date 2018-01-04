# teapot-demo
A simple graphics demo using Three.js and dat.GUI for learning about lighting and shading. Tutorial to come...

All skyboxes sourced from: http://www.custommapmakers.org/skyboxes.php

## Code Organization

### GLSL
This folder contains all the custom shaders. Many of the vertex/fragment shaders are very similar but are kept individual for learning purposes
### JS

`demo.js` This is the main demo where the scene is created and rendered. 

`settings.js` Contains all the settings & default values for the demo. This is the only place you would need to change any values directly. Default settings are inside the `defaults` object.

`controllers.js` Contains all the code that sets up the dat.GUI controllers. Note: The initial shader and GUI displayed is Phong.

`helpers.js` Helper functions that the dat.GUI controllers call like the reset button, switching the shaders etc. are all located here.

`shaders.js` Contains all the code that sets up and loads the custom shaders. Uniforms that are shared by the various shaders are declared at the top. 

### IMG
This folder contains a separate folder for each set of skybox images. Must follow naming conventions when adding new skyboxes. 
