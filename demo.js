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
  shininess : 10.0,
  kAmbient : 0.4,
  kSpecular : 0.8,
  kDiffuse : 0.8,
  ambientColor : new THREE.Color( 0.4, 0.4, 0.4 ),
  alphaX : 0.7,
  alphaY : 0.1,
};

/* PHONG */

var phongUniforms = {
  lightColor : {type: "c", value: lightColor},
  ambientColor : {type: "c", value: material.ambientColor},
  lightPosition : {type: "v3", value: light.position},
  kAmbient : {type: "f", value: material.kAmbient},
  kDiffuse : {type: "f", value: material.kDiffuse},
  kSpecular : {type: "f", value: material.kSpecular},
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
  'glsl/blinnphong.vs.glsl',
  'glsl/blinnphong.fs.glsl',
];

var loader = new THREE.FileLoader();
   loader.load('glsl/blinnphong.vs.glsl', function(shader) {
     blinnPhongMaterial.vertexShader = shader
   });
   loader.load('glsl/blinnphong.fs.glsl', function(shader) {
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

var teapotControls = gui.addFolder('Phong Shader');
teapotControls.add(material, 'shininess', 0, 100);
teapotControls.add(material, 'kAmbient', 0, 1);
teapotControls.add(material, 'kSpecular', 0, 1);
teapotControls.add(material, 'kDiffuse', 0, 1);
teapotControls.open();

gui.add(obj, 'rotate');
var shaderControl = gui.add(obj, 'shader', { Phong : 0, BlinnPhong : 1 } );

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

  phongUniforms.shininess.value = material.shininess;
  phongUniforms.kAmbient.value = material.kAmbient;
  phongUniforms.kDiffuse.value = material.kDiffuse;
  phongUniforms.kSpecular.value = material.kSpecular;

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
