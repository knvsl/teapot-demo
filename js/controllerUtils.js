/* DAT.GUI Setup */

var gui;
var currentShader = PHONG;

// Create PHONG/BLINN-PHONG GUI
function createPhongGUI() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(phongUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  var uniforms = gui.addFolder('Uniforms');
    uniforms.addColor(phongUniforms.ambientColor.value, 'r' ).name('Ambient Color').onChange(updateAmbientColor);
    uniforms.addColor(phongUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniforms.addColor(phongUniforms.specularColor.value, 'r' ).name('Specular Color').onChange(updateSpecularColor);
    uniforms.add(phongUniforms.shininess, 'value', 0, 100).name('Shininess').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(phongUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(phongUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(phongUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

// Create LAMBERTIAN GUI
function createLambertianGUI() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(lambertianUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  var uniforms = gui.addFolder('Uniforms');
    uniforms.addColor(lambertianUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniforms.add(lambertianUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

// Create ANISOTROPHIC GUI
function createAnisotrophicGUI() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(anisotrophicUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  var uniformControls = gui.addFolder('Uniforms');
    uniforms.addColor(anisotrophicUniforms.ambientColor.value, 'r' ).name('Ambient Color').onChange(updateAmbientColor);
    uniforms.addColor(anisotrophicUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniforms.addColor(anisotrophicUniforms.specularColor.value, 'r' ).name('Specular Color').onChange(updateSpecularColor);
    uniforms.add(anisotrophicUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(anisotrophicUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(anisotrophicUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(anisotrophicUniforms.alphaX, 'value', 0, 1).name('X Width').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniforms.add(anisotrophicUniforms.alphaY, 'value', 0, 1).name('Y Width').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

// Hacky fix to update display
function refreshDisplay() {
  gui.destroy();
  switch(currentShader){
    case PHONG:
      createPhongGUI();
      break;
    case BLINNPHONG:
      createPhongGUI();
      break;
    case LAMBERTIAN:
      createLambertianGUI();
      break;
    case ANISOTROPHIC:
      createAnisotrophicGUI();
      break;
  }
}

// Update Color Values (workound for THREE.Color type)
function updateLightColor(color) {
  orbitControls.enabled = false;
  lightColor.value = new THREE.Color ( color );
  orbitControls.enabled = true;
}

function updateAmbientColor(color){
  orbitControls.enabled = false;
  ambientColor.value = new THREE.Color ( color );
  orbitControls.enabled = true;
}

function updateDiffuseColor(color) {
  orbitControls.enabled = false;
  diffuseColor.value = new THREE.Color ( color );
  orbitControls.enabled = true;
}

function updateSpecularColor(color){
  orbitControls.enabled = false;
  specularColor.value = new THREE.Color ( color );
  orbitControls.enabled = true;
}

// Enable/Disable Orbit controls when using GUI
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
      currentShader = PHONG;
      setMaterial(teapot, phongMaterial);
      gui.destroy();
      createPhongGUI();
      break;
    }
    case BLINNPHONG: {
      currentShader = BLINNPHONG;
      setMaterial(teapot, blinnPhongMaterial);
      gui.destroy();
      createPhongGUI();
      break;
    }
    case LAMBERTIAN: {
      currentShader = LAMBERTIAN;
      setMaterial(teapot, lambertianMaterial);
      gui.destroy();
      createLambertianGUI();
      break;
    }
    case ANISOTROPHIC: {
      currentShader = ANISOTROPHIC;
      setMaterial(teapot, anisotrophicMaterial);
      gui.destroy();
      createAnisotrophicGUI();
      break;
    }
  }

  orbitControls.enabled = true;

};

// Update Materials
function updateMaterials() {

  switch(currentShader) {
    case PHONG: {
      phongMaterial.needsUpdate = true;
      break;
    }
    case BLINNPHONG: {
      blinnPhongMaterial.needsUpdate = true;
      break;
    }
    case LAMBERTIAN: {
      lambertianMaterial.needsUpdate = true;
      break;
    }
    case ANISOTROPHIC: {
      anisotrophicMaterial.needsUpdate = true;
      break;
    }
  }
}

// Set object's material
function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}
