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

/** GUI Settings **/

const PHONG = 0;
const BLINNPHONG = 1;
const LAMBERTIAN = 2;
const ANISOTROPHIC = 3;


// Light Settings
var color = {
  light : 0xFFFFFF,
  ambient : 0x666666,
};

// Object Settings
var settings = {
  rotate : false,
  shader : PHONG,
};

// Material Settings
var shininess = { type: 'f', value: 10.0 };
var kA = { type: 'f', value: 0.4 };
var kD = { type: 'f', value: 0.8 };
var kS = { type: 'f', value: 0.8 };
var alphaX = { type: 'f', value: 0.5 };
var alphaY = { type: 'f', value: 0.1 };

/* Phong Shader */

var phongUniforms = {
  lightColor : { type: 'c', value: new THREE.Color( color.light )},
  ambientColor : { type: 'c', value: new THREE.Color( color.ambient )},
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
  lightColor : { type: 'c', value: new THREE.Color( color.light )},
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
  lightColor : { type: 'c', value: new THREE.Color( color.light )},
  ambientColor : { type: 'c', value: new THREE.Color( color.ambient )},
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

function createPhongGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(changeShader);
    gui.addColor(color, 'light' ).name('Light Color').onChange(disableOrbit).onFinishChange(enableOrbit);
    gui.addColor(color, 'ambient' ).name('Ambient Color').onChange(disableOrbit).onFinishChange(enableOrbit);


  uniformControls = gui.addFolder('Uniforms');
    uniformControls.add(phongUniforms.shininess, 'value', 0, 100).name('Shininess').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(phongUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
}

function createLambertianGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(changeShader);
    gui.addColor(color, 'light' ).name('Light Color').onChange(disableOrbit).onFinishChange(enableOrbit);

  var uniformControls = gui.addFolder('Uniforms');
    uniformControls.add(lambertianUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
}

function createAnisotrophicGui() {

  gui = new dat.GUI( { width : 500 } );
    gui.add(settings, 'rotate').name('Rotate');
    gui.add(settings, 'shader', { Phong : PHONG, BlinnPhong : BLINNPHONG, Lambertian : LAMBERTIAN, Anisotrophic: ANISOTROPHIC } ).name('Shader').onChange(changeShader);
    gui.addColor(color, 'light' ).name('Light Color').onChange(disableOrbit).onFinishChange(enableOrbit);
    gui.addColor(color, 'ambient' ).name('Ambient Color').onChange(disableOrbit).onFinishChange(enableOrbit);

  uniformControls = gui.addFolder('Uniforms');
    uniformControls.add(anisotrophicUniforms.kA, 'value', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.kS, 'value', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.kD, 'value', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.alphaX, 'value', 0, 1).name('X Width').onChange(disableOrbit).onFinishChange(enableOrbit);
    uniformControls.add(anisotrophicUniforms.alphaY, 'value', 0, 1).name('Y Width').onChange(disableOrbit).onFinishChange(enableOrbit);
}

function changeShader(shader) {

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

function disableOrbit() {
  orbitControls.enabled = false;
}

function enableOrbit() {
  orbitControls.enabled = true;
}

function updateUniforms() {

  switch(currentShader) {
    case PHONG: {
      phongUniforms.lightColor.value = new THREE.Color( color.light );
      phongUniforms.ambientColor.value = new THREE.Color( color.ambient );
      phongMaterial.needsUpdate = true;
      break;
    }
    case BLINNPHONG: {
      phongUniforms.lightColor.value = new THREE.Color( color.light );
      phongUniforms.ambientColor.value = new THREE.Color( color.ambient );
      blinnPhongMaterial.needsUpdate = true;
      break;
    }
    case LAMBERTIAN: {
      lambertianUniforms.lightColor.value = new THREE.Color( color.light );
      lambertianMaterial.needsUpdate = true;
      break;
    }
    case ANISOTROPHIC: {
      anisotrophicUniforms.lightColor.value = new THREE.Color( color.light );
      anisotrophicUniforms.ambientColor.value = new THREE.Color( color.ambient );
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
