/* DAT.GUI Controllers */

// Reset Function
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

/* Create GUIs */

// PHONG/BLINN
var phongGUI = new dat.GUI( { width : 500 } );
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
// Reset Button
phongGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);


// LAMBERTIAN
var lambertGUI = new dat.GUI( { width : 500 } );
  lambertGUI.add(settings, 'rotate').name('Rotate');
  lambertGUI.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader).listen();
  lambertGUI.addColor(color, 'light' ).name('Light Color').onChange(updateLightColor).onFinishChange(enableOrbit);
// Uniforms Folder
var uniforms = lambertGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'diffuse' ).name('Diffuse Color').onChange(updateDiffuseColor).onFinishChange(enableOrbit);
  uniforms.add(kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
// Reset Button
lambertGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);
// Hide lambertGUI at start
lambertGUI.domElement.style.display = 'none';


// ANISOTROPHIC
var anisoGUI = new dat.GUI( { width : 500 } );
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
// Reset Button
anisoGUI.add(resetButton, 'reset').name('RESET').onFinishChange(refreshDisplay);
// Hide anisoGUI at start
anisoGUI.domElement.style.display = 'none';

/* Default Shader */

var currentGUI = phongGUI;
var currentMaterial = phongMaterial;


/* Update Shaders */

// Fix to update display
function refreshDisplay() {

  for (var c in currentGUI.__controllers) {
      currentGUI.__controllers[c].updateDisplay();
  }

  for (var c in currentGUI.__folders) {
      currentGUI.__folders[c].updateDisplay();
  }
}

// Fixes to update color values
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

// Disable/enable orbit controls when using GUI
function disableOrbit() {
  orbitControls.enabled = false;
}
function enableOrbit() {
  orbitControls.enabled = true;
}

// Update shader selection
function updateShader(shader) {

  orbitControls.enabled = false;

  switch (+shader) {
    case PHONG: {
      setMaterial(teapot, phongMaterial);
      currentMaterial = phongMaterial;
      currentGUI.domElement.style.display = 'none';
      phongGUI.domElement.style.display = '';
      resetButton.reset();
      refreshDisplay();
      currentGUI = phongGUI;
      break;
    }
    case BLINNPHONG: {
      setMaterial(teapot, blinnPhongMaterial);
      currentMaterial = blinnPhongMaterial;
      currentGUI.domElement.style.display = 'none';
      phongGUI.domElement.style.display = '';
      resetButton.reset();
      refreshDisplay();
      currentGUI = phongGUI;
      break;
    }
    case LAMBERTIAN: {
      setMaterial(teapot, lambertianMaterial);
      currentMaterial = lambertianMaterial;
      currentGUI.domElement.style.display = 'none';
      lambertGUI.domElement.style.display = '';
      resetButton.reset();
      refreshDisplay();
      currentGUI = lambertGUI;
      break;
    }
    case ANISOTROPHIC: {
      setMaterial(teapot, anisotrophicMaterial);
      currentMaterial = anisotrophicMaterial;
      currentGUI.domElement.style.display = 'none';
      anisoGUI.domElement.style.display = '';
      resetButton.reset();
      refreshDisplay();
      currentGUI = anisoGUI;
      break;
    }
  }

  orbitControls.enabled = true;

};

// Update Materials
function updateMaterials(currentMaterial) {
  skyboxMaterial.needsUpdate = true;
  currentMaterial.needsUpdate = true;
}

// Set object's material
function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}
