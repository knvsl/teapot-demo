/* DAT.GUI Controllers */

// GUI Reset Function
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

    // Need to update color uniforms
    lightColor.value = new THREE.Color( color.light );
    ambientColor.value = new THREE.Color( color.ambient );
    diffuseColor.value = new THREE.Color( color.diffuse );
    specularColor.value = new THREE.Color( color.specular );
  }
};

/////////////////
// Create GUIs //
/////////////////

// PHONG + BLINNPHONG
var phongGUI = new dat.GUI( { width : 500 } );
  phongGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);
  phongGUI.add(settings, 'rotate').name('Rotate');
  phongGUI.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader).listen();
  phongGUI.addColor(color, 'light' ).name('Light Color').onChange(updateLightColor).onFinishChange(enableOrbit);
  phongGUI.add(lightPosition.value, 'x', -10, 10).name('Light X').onChange(disableOrbit).onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = phongGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'ambient' ).name('Ambient Color').onChange(updateAmbientColor).onFinishChange(enableOrbit);
  uniforms.addColor(color, 'diffuse' ).name('Diffuse Color').onChange(updateDiffuseColor).onFinishChange(enableOrbit);
  uniforms.addColor(color, 'specular' ).name('Specular Color').onChange(updateSpecularColor).onFinishChange(enableOrbit);
  uniforms.add(shininess, 'value', 0, 100).name('Shininess').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);


// LAMBERTIAN
var lambertGUI = new dat.GUI( { width : 500 } );
  lambertGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);
  lambertGUI.add(settings, 'rotate').name('Rotate');
  lambertGUI.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader).listen();
  lambertGUI.addColor(color, 'light' ).name('Light Color').onChange(updateLightColor).onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = lambertGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'diffuse' ).name('Diffuse Color').onChange(updateDiffuseColor).onFinishChange(enableOrbit);
  uniforms.add(kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);

// Hide at start
lambertGUI.domElement.style.display = 'none';


// ANISOTROPHIC
var anisoGUI = new dat.GUI( { width : 500 } );
  anisoGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);
  anisoGUI.add(settings, 'rotate').name('Rotate');
  anisoGUI.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader).listen();
  anisoGUI.addColor(color, 'light' ).name('Light Color').onChange(updateLightColor).onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = anisoGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'ambient' ).name('Ambient Color').onChange(updateAmbientColor).onFinishChange(enableOrbit);
  uniforms.addColor(color, 'diffuse' ).name('Diffuse Color').onChange(updateDiffuseColor).onFinishChange(enableOrbit);
  uniforms.addColor(color, 'specular' ).name('Specular Color').onChange(updateSpecularColor).onFinishChange(enableOrbit);
  uniforms.add(kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(alphaX, 'value', 0, 1).name('X Width').onChange(disableOrbit).onFinishChange(enableOrbit);
  uniforms.add(alphaY, 'value', 0, 1).name('Y Width').onChange(disableOrbit).onFinishChange(enableOrbit);

// Hide at start
anisoGUI.domElement.style.display = 'none';


////////////////////
// Update Display //
////////////////////

// Fix to manually refresh display
function refreshDisplay() {
  for (var c in currentShader.gui.__controllers) {
      currentShader.gui.__controllers[c].updateDisplay();
  }
  for (var c in currentShader.gui.__folders) {
      currentShader.gui.__folders[c].updateDisplay();
  }
}

// Fix to update color values
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

////////////////////
// Update Shaders //
////////////////////

var shaders = [];

// Create a shader object
function shader(material, gui) {
    this.material = material;
    this.gui = gui;
}

var phong = new shader(phongMaterial, phongGUI);
var blinnPhong = new shader(blinnPhongMaterial, phongGUI);
var lambertian = new shader(lambertianMaterial, lambertGUI);
var anisotrophic = new shader(anisotrophicMaterial, anisoGUI);

shaders[PHONG] = phong;
shaders[BLINNPHONG] = blinnPhong;
shaders[LAMBERTIAN] = lambertian;
shaders[ANISOTROPHIC] = anisotrophic;

var currentShader = phong;

function updateShader(shader) {

  orbitControls.enabled = false;

  // Hide old gui
  currentShader.gui.domElement.style.display = 'none';

  currentShader = shaders[+shader];
  setMaterial(teapot, currentShader.material);

  // Show new gui
  currentShader.gui.domElement.style.display = '';

  // Refresh the controller
  resetButton.reset();
  refreshDisplay();

  orbitControls.enabled = true;
}

function updateMaterials(material) {
<<<<<<< HEAD

  material.needsUpdate = true;
  skyboxMaterial.needsUpdate = true;
  
=======

  material.needsUpdate = true;

  if(settings.skybox){
    skyboxMaterial.needsUpdate = true;
  }

>>>>>>> movableLight
}

function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}
