/* Helper Functions */

//////////////////
// Controllers //
/////////////////

// Reset to defaults
var resetButton = {
  reset: function(){

    color.light = defaults.lightColor;
    color.ambient = defaults.ambientColor;
    color.diffuse = defaults.diffuseColor;
    color.specular = defaults.specularColor;

    shininess.value = defaults.shininess;
    kA.value = defaults.kA;
    kD.value = defaults.kD;
    kS.value = defaults.kS;
    alphaX.value = defaults.alphaX;
    alphaY.value = defaults.alphaY;

    lightPosition.value.x = defaults.x;
    lightPosition.value.y = defaults.y;
    lightPosition.value.z = defaults.z;

    // Manually set colors
    lightColor.value = new THREE.Color( color.light );
    ambientColor.value = new THREE.Color( color.ambient );
    diffuseColor.value = new THREE.Color( color.diffuse );
    specularColor.value = new THREE.Color( color.specular );
  }
};

// Manually refresh display
function refreshDisplay() {
  for (var c in currentShader.gui.__controllers) {
      currentShader.gui.__controllers[c].updateDisplay();
  }
  for (var c in currentShader.gui.__folders) {
      currentShader.gui.__folders[c].updateDisplay();
  }
}

// Manually update color uniforms
function updateLightColor(color) {
  orbitControls.enabled = false;
  lightColor.value = new THREE.Color ( color );
}

function updateAmbientColor(color){
  orbitControls.enabled = false;
  ambientColor.value = new THREE.Color ( color );
}

function updateDiffuseColor(color) {
  orbitControls.enabled = false;
  diffuseColor.value = new THREE.Color ( color );
}

function updateSpecularColor(color){
  orbitControls.enabled = false;
  specularColor.value = new THREE.Color ( color );
}

// Disable/Enable Orbit controls
function disableOrbit() {
  orbitControls.enabled = false;
}

function enableOrbit() {
  orbitControls.enabled = true;
}

//////////////
// Shaders //
/////////////

// Create a shader object
function shader(material, gui) {
    this.material = material;
    this.gui = gui;
}

// Change the shader
function updateShader(shader) {

  orbitControls.enabled = false;

  // Hide old gui
  currentShader.gui.domElement.style.display = 'none';

  // Switch to new gui
  currentShader = shaders[+shader];
  setMaterial(teapot, currentShader.material);
  currentShader.gui.domElement.style.display = '';

  // Refresh the display
  refreshDisplay();

  orbitControls.enabled = true;
}

// Update a material
function updateMaterials(material) {
  material.needsUpdate = true;
  skyboxMaterial.needsUpdate = true;
}

// Set an objects material
function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}

// Change the skybox
function updateSkybox(skybox) {

  var dir = 'img/' + skybox + '/';

  cubemap = new THREE.CubeTextureLoader()
    .setPath( dir )
    .load([
      skybox + '_ft.png', skybox + '_bk.png',
      skybox + '_up.png', skybox + '_dn.png ',
      skybox + '_rt.png', skybox + '_lf.png'
    ]);

  skyboxMaterial.uniforms.skybox.value = cubemap;
  reflectionMaterial.uniforms.skybox.value = cubemap;
  refractionMaterial.uniforms.skybox.value = cubemap;
}
