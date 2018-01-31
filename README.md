# teapot-demo
A simple graphics demo built with Three.js and dat.GUI

View the project on Github Pages [HERE](https://k1mby.github.io/teapot-demo/)

All skyboxes sourced from: http://www.custommapmakers.org/skyboxes.php

## Code Organization

### SHADERS
This folder contains all the shaders.

### JS

`demo.js` This is the main demo where the scene is created and rendered.

`settings.js` Contains all the settings & default values for the demo. This is the only place you would need to change any values directly. Default settings are inside the `defaults` object.

`controllers.js` Contains all the code that sets up the dat.GUI controllers. 

`helpers.js` Helper functions that the dat.GUI controllers use are here

`shaders.js` Contains all the code that sets up and loads the shaders. Uniforms that are shared by the various shaders are declared at the top.

### IMG
This folder contains a separate folder for each set of skybox images. 
