/** Setup **/

// Renderer
var renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xFFFFFF);

window.addEventListener('resize', resizeWindow, false);

var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(2,2,10);
camera.lookAt( scene.position );

// Controls
orbitControls = new THREE.OrbitControls(camera);
orbitControls.damping = 0.5;
orbitControls.autoRotate = false;
orbitControls.zoomSpeed = 0.1;

// Axes Helper
var axesHelper = new THREE.AxesHelper( 3 );
scene.add( axesHelper );

// Light
var light = new THREE.PointLight( 1, 1, 1 );
light.position.set( 3, 3, 0 );
scene.add( light );

// Light Helper
var helperColor = new THREE.Color( 0, 0, 0 );
var helperSize = 0.5;
var lightHelper = new THREE.PointLightHelper( light, helperSize, helperColor);
scene.add( lightHelper );

function resizeWindow() {

  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

/** Shared Settings **/

const PHONG = 0;
const BLINNPHONG = 1;
const LAMBERTIAN = 2;
const ANISOTROPHIC = 3;

// Object Settings
var settings = {
  rotate : false,
  shader : PHONG,
};

// Light Settings
var lightColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };
var ambientColor = { type: 'c', value: new THREE.Color( 0x555555 ) };
var diffuseColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };
var specularColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };

// Material Settings
var shininess = { type: 'f', value: 10.0 };
var kA = { type: 'f', value: 0.4 };
var kD = { type: 'f', value: 0.8 };
var kS = { type: 'f', value: 0.8 };
var alphaX = { type: 'f', value: 0.5 };
var alphaY = { type: 'f', value: 0.1 };

/* Phong Shader */

var phongUniforms = {
  lightColor : lightColor,
  ambientColor : ambientColor,
  diffuseColor : diffuseColor,
  specularColor : specularColor,
  lightPosition : { type: 'v3', value: light.position },
  shininess : shininess,
  kA : kA,
  kD : kD,
  kS : kS,
};

var phongMaterial = new THREE.ShaderMaterial({
  uniforms : phongUniforms,
});

var shaderFiles = [
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
];

var loader = new THREE.FileLoader();
   loader.load('glsl/phong.vs.glsl', function(shader) {
     phongMaterial.vertexShader = shader
   });
   loader.load('glsl/phong.fs.glsl', function(shader) {
     phongMaterial.fragmentShader = shader
   });

/* Blinn-Phong Shader */

var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms : phongUniforms,
});

var shaderFiles = [
  'glsl/blinn_phong.vs.glsl',
  'glsl/blinn_phong.fs.glsl',
];

var loader = new THREE.FileLoader();
   loader.load('glsl/blinn_phong.vs.glsl', function(shader) {
     blinnPhongMaterial.vertexShader = shader
   });
   loader.load('glsl/blinn_phong.fs.glsl', function(shader) {
     blinnPhongMaterial.fragmentShader = shader
   });

/* Lambertian Shader */

var lambertianUniforms = {
  lightColor : lightColor,
  diffuseColor : diffuseColor,
  lightPosition : { type: 'v3', value: light.position },
  kD : kD,
};

var lambertianMaterial = new THREE.ShaderMaterial({
  uniforms : lambertianUniforms,
});

var shaderFiles = [
  'glsl/lambertian.vs.glsl',
  'glsl/lambertian.fs.glsl',
];

var loader = new THREE.FileLoader();
   loader.load('glsl/lambertian.vs.glsl', function(shader) {
     lambertianMaterial.vertexShader = shader
   });
   loader.load('glsl/lambertian.fs.glsl', function(shader) {
     lambertianMaterial.fragmentShader = shader
   });

/* Anisotrophic Shader */

var anisotrophicUniforms = {
  lightColor : lightColor,
  ambientColor : ambientColor,
  diffuseColor : diffuseColor,
  specularColor : specularColor,
  lightPosition : { type: 'v3', value: light.position },
  shininess : shininess,
  kA : kA,
  kD : kD,
  kS : kS,
  alphaX : alphaX,
  alphaY : alphaY,
};

var anisotrophicMaterial = new THREE.ShaderMaterial({
  uniforms : anisotrophicUniforms,
});

var shaderFiles = [
  'glsl/anisotrophic.vs.glsl',
  'glsl/anisotrophic.fs.glsl',
];

var loader = new THREE.FileLoader();
   loader.load('glsl/anisotrophic.vs.glsl', function(shader) {
     anisotrophicMaterial.vertexShader = shader
   });
   loader.load('glsl/anisotrophic.fs.glsl', function(shader) {
     anisotrophicMaterial.fragmentShader = shader
   });

/* Object (teapot) */

var teapot;

var loader = new THREE.OBJLoader();
loader.load('obj/teapot.obj', function(object) {

  object.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.material = phongMaterial;
    }
  });

  object.scale.x = 2;
  object.scale.y = 2;
  object.scale.z = 2;
  object.name = 'teapot';

  scene.add( object );

  teapot = scene.getObjectByName('teapot');
 });

// Set object's material
function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}

/* DAT.GUI Controller */

var gui;
var uniformControls;
var currentShader = PHONG;

var defaults = {
  reset: function() {
    lightColor.value = new THREE.Color( 0xFFFFFF );
    ambientColor.value = new THREE.Color( 0x555555 );
    diffuseColor.value = new THREE.Color( 0xFFFFFF );
    specularColor.value = new THREE.Color( 0xFFFFFF );
    shininess.value = 10.0;
    kA.value = 0.4;
    kD.value = 0.8;
    kS.value = 0.8;
    alphaX.value = 0.5;
    alphaY.value = 0.1;
  }
};

// Functions to create the different GUIs
function createPhongGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(phongUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  uniformControls = gui.addFolder('Uniforms');
    uniformControls.addColor(phongUniforms.ambientColor.value, 'r' ).name('Ambient Color').onChange(updateAmbientColor);
    uniformControls.addColor(phongUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniformControls.addColor(phongUniforms.specularColor.value, 'r' ).name('Specular Color').onChange(updateSpecularColor);
    uniformControls.add(phongUniforms.shininess, 'value', 0, 100).name('Shininess').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

function createLambertianGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(lambertianUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  var uniformControls = gui.addFolder('Uniforms');
    uniformControls.addColor(lambertianUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniformControls.add(lambertianUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

function createAnisotrophicGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(updateShader);
    gui.addColor(anisotrophicUniforms.lightColor.value, 'r' ).name('Light Color').onChange(updateLightColor);

  uniformControls = gui.addFolder('Uniforms');
    uniformControls.addColor(anisotrophicUniforms.ambientColor.value, 'r' ).name('Ambient Color').onChange(updateAmbientColor);
    uniformControls.addColor(anisotrophicUniforms.diffuseColor.value, 'r' ).name('Diffuse Color').onChange(updateDiffuseColor);
    uniformControls.addColor(anisotrophicUniforms.specularColor.value, 'r' ).name('Specular Color').onChange(updateSpecularColor);
    uniformControls.add(anisotrophicUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.alphaX, 'value', 0, 1).name('X Width').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.alphaY, 'value', 0, 1).name('Y Width').onChange(disableOrbit).onFinishChange(enableOrbit);

    gui.add(defaults, 'reset').name('RESET').onChange(refreshDisplay);
}

// Hacky fix to update display
function refreshDisplay() {

  gui.destroy();

  switch(currentShader){
    case PHONG:
      createPhongGui();
      break;
    case BLINNPHONG:
      createPhongGui();
      break;
    case LAMBERTIAN:
      createLambertianGui();
      break;
    case ANISOTROPHIC:
      createAnisotrophicGui();
      break;
  }

}

// Functions to update colors
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

// Update shader
function updateShader(shader) {

  orbitControls.enabled = false;

  switch (+shader) {
    case PHONG: {
      currentShader = PHONG;
      setMaterial(teapot, phongMaterial);
      gui.destroy();
      createPhongGui();
      break;
    }
    case BLINNPHONG: {
      currentShader = BLINNPHONG;
      setMaterial(teapot, blinnPhongMaterial);
      gui.destroy();
      createPhongGui();
      break;
    }
    case LAMBERTIAN: {
      currentShader = LAMBERTIAN;
      setMaterial(teapot, lambertianMaterial);
      gui.destroy();
      createLambertianGui();
      break;
    }
    case ANISOTROPHIC: {
      currentShader = ANISOTROPHIC;
      setMaterial(teapot, anisotrophicMaterial);
      gui.destroy();
      createAnisotrophicGui();
      break;
    }
  }

  orbitControls.enabled = true;

};

// Update material
function updateUniforms() {

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

// Render Scene
function render() {
    window.requestAnimationFrame( render );

    orbitControls.update();

    updateUniforms();

    // Rotate teapot
    if(teapot && settings.rotate) {
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    renderer.render( scene, camera );
}

resizeWindow();
createPhongGui();
render();
