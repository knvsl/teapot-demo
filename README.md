# teapot-demo
A simple graphics demo using Three.js and dat.GUI for learning about lighting and shading.

All skyboxes sourced from: http://www.custommapmakers.org/skyboxes.php

To add a new skybox the images must be placed in a folder with name "your-name" and named individually with the convention below:

"your-name_ft.png"
"your-name_bk.png"
"your-name_up.png"
"your-name_dn.png"
"your-name_rt.png"
"your-name_lf.png"

Add the skybox by placing the folder inside the "img" folder and adding a thumbnail inside the html where the id is the same as "your-name"

Example:

    <img id="your-name" onclick="updateSkybox(this.id)" src="img/your-name/your-name_lf.png" alt=""/>
