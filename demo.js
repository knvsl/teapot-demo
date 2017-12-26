/** Setup **/

// Renderer
var renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xFFFFFF);

// Resize window
function resizeWindow() {

  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

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
var helperColor = new THREE.Color( 1, 0.8, 0 );
var helperSize = 0.5;
var lightHelper = new THREE.PointLightHelper( light, helperSize, helperColor);
scene.add( lightHelper );

/** GUI Settings **/

// Light Settings
var lightColor = {
  light : 0xFFFFFF,
  ambient : 0x666666,
};

// Material Settings
var material = {
  shininess : 10.0,
  kA : 0.4,
  kD : 0.8,
  kS : 0.8,
  alphaX : 0.7,
  alphaY : 0.1,
};

// Object Settings
var settings = {
  rotate : false,
  shader : 0,
};

/* PHONG Shader */
var phongUniforms = {
  lightColor : { type: "c", value: new THREE.Color( lightColor.light ) },
  ambientColor : { type: "c", value: new THREE.Color( lightColor.ambient ) },
  lightPosition : { type: "v3", value: light.position },
  shininess : { type: "f", value: material.shininess },
  kA : { type: "f", value: material.kA },
  kD : { type: "f", value: material.kD },
  kS : { type: "f", value: material.kS },
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

/* Blinn-Phong Shader*/
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


// Teapot Object
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

// DAT.GUI Controller
var gui = new dat.GUI( { width : 500 } );

// Object Controls
gui.add(settings, 'shader', { Phong : 0, BlinnPhong : 1 } ).name('Shader').onChange(changeShader);
gui.addColor(lightColor, 'light' ).name('Light Color').onChange(disableOrbit).onFinishChange(enableOrbit);
gui.addColor(lightColor, 'ambient' ).name('Ambient Color').onChange(disableOrbit).onFinishChange(enableOrbit);
gui.add(settings, 'rotate').name('Rotate');

// Phong/Blinn-Phong Controls
var phongControls = gui.addFolder('Uniforms');
  phongControls.add(material, 'shininess', 0, 100).name('Shininess').onChange(disableOrbit).onFinishChange(enableOrbit);
  phongControls.add(material, 'kA', 0, 1).name('Ambient Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  phongControls.add(material, 'kS', 0, 1).name('Specular Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);
  phongControls.add(material, 'kD', 0, 1).name('Diffuse Intensity').onChange(disableOrbit).onFinishChange(enableOrbit);


// Change shader
function changeShader(shader) {

  orbitControls.enabled = false;

  switch (+shader) {
    case 0:
      setMaterial(teapot, phongMaterial);
      break;
    case 1:
      setMaterial(teapot, blinnPhongMaterial);
      break;
    default:
      setMaterial(teapot, phongMaterial);
  }

  orbitControls.enabled = true;

};

// Disable and enable orbit controls when using GUI
function disableOrbit() {
  orbitControls.enabled = false;
}

function enableOrbit() {
  orbitControls.enabled = true;
}

// Update Phong/Blinn-Phong uniforms
function updatePhongUniforms() {

  phongUniforms.kA.value = material.kA;
  phongUniforms.kD.value = material.kD;
  phongUniforms.kS.value = material.kS;
  phongUniforms.shininess.value = material.shininess;
  phongUniforms.lightColor.value = new THREE.Color( lightColor.light );
  phongUniforms.ambientColor.value = new THREE.Color( lightColor.ambient );

  phongMaterial.needsUpdate = true;
  blinnPhongMaterial.needsUpdate = true;
}

// Set object material
function setMaterial (object, material) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh){
      child.material = material;
    }
  });
}

// Render Scene
function render() {
    window.requestAnimationFrame( render );

    orbitControls.update();
    updatePhongUniforms();

    // Rotate teapot
    if(teapot && settings.rotate) {
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    renderer.render( scene, camera );
}

resizeWindow();
render();
