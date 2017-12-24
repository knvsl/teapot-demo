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
controls = new THREE.OrbitControls(camera);
controls.damping = 0.5;
controls.autoRotate = false;
controls.zoomSpeed = 0.1;

// Axes Helper
var axesHelper = new THREE.AxesHelper( 3 );
scene.add( axesHelper );

// Light
var lightColor = new THREE.Color( 1, 1, 1 );
var light = new THREE.PointLight( lightColor );
light.position.set( 3, 3, 0 );
scene.add( light );

// Light Helper
var helperColor = new THREE.Color( 1, 0.8, 0 );
var helperSize = 0.5;
var lightHelper = new THREE.PointLightHelper( light, helperSize, helperColor);
scene.add( lightHelper );

// Object Properties
/*
  Phong : 0
  BlinnPhong : 1
*/
var obj = {
  rotate : false,
  shader : 0,
};

// Material Properties
var material = {
  ambientColor : new THREE.Color( 0.4, 0.4, 0.4 ),
  kA : 0.4,
  kS : 0.8,
  kD : 0.8,
  shininess : 10.0,
  aX : 0.7,
  aY : 0.1,
};

/* PHONG */

var phongUniforms = {
  lightColor : {type: "c", value: lightColor},
  ambientColor : {type: "c", value: material.ambientColor},
  lightPosition : {type: "v3", value: light.position},
  kA : {type: "f", value: material.kA},
  kD : {type: "f", value: material.kD},
  kS : {type: "f", value: material.kS},
  shininess : {type: "f", value: material.shininess}
};

var phongMaterial = new THREE.ShaderMaterial({
  uniforms: phongUniforms,
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

/* Blinn-Phong */

var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: phongUniforms,
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


// Objects
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

// DAT.GUI controls
var gui = new dat.GUI( { width : 500 } );

var teapotControls = gui.addFolder('Uniforms');
teapotControls.add(material, 'kA', 0, 1).name('Ambient Intensity');
teapotControls.add(material, 'kS', 0, 1).name('Specular Intensity');
teapotControls.add(material, 'kD', 0, 1).name('Diffuse Intensity');
teapotControls.add(material, 'shininess', 0, 100).name('Shininess');
teapotControls.open();

gui.add(obj, 'rotate').name('Rotate');
var shaderControl = gui.add(obj, 'shader', { Phong : 0, BlinnPhong : 1 } ).name('Shader');

// Update Shader
shaderControl.onChange(function(shader) {

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

});

// Update uniform values
function updatePhongUniforms() {

  phongUniforms.kA.value = material.kA;
  phongUniforms.kD.value = material.kD;
  phongUniforms.kS.value = material.kS;
  phongUniforms.shininess.value = material.shininess;

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

    controls.update();
    updatePhongUniforms();

    // Rotate teapot
    if(teapot && obj.rotate) {
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    renderer.render( scene, camera );
}

resizeWindow();
render();
