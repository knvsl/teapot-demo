// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xFFFFFF);

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
var light = new THREE.DirectionalLight( lightColor );
light.position.set( 5, 5, 0 );
light.castShadow = true;
scene.add( light );

// Light Helper
var helperColor = new THREE.Color( 1, 0.8, 0 );
var helperSize = 0.5;
var lightHelper = new THREE.PointLightHelper( light, helperSize, helperColor);
scene.add( lightHelper );

// Material properties
var ambientColor = new THREE.Color( 0.4, 0.4, 0.4 );
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.5;
var shininess = 5.0;
var alphaX = 0.7;
var alphaY = 0.1;

// Uniforms
var phongUniforms = {
  lightColor : {type: "c", value: lightColor},
  ambientColor : {type: "c", value: ambientColor},
  lightPosition : {type: "v3", value: light.position},
  kAmbient : {type: "f", value: kAmbient},
  kDiffuse : {type: "f", value: kDiffuse},
  kSpecular : {type: "f", value: kSpecular},
  shininess : {type: "f", value: shininess}
};

// Materials
var phongMaterial = new THREE.ShaderMaterial({
  uniforms: phongUniforms,
});

// Shaders
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

// Build Scene

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

/*
// Floor
var planeGeometry = new THREE.PlaneBufferGeometry( 5, 5 );
var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xD3D3D3, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -0.5 * Math.PI;
scene.add( plane );
*/

// TODO: Options to change shader and then edit values 
var gui = new dat.GUI();

var teapotControl = gui.addFolder('Teapot');
teapotControl.open();


// Render Scene
function render() {
    window.requestAnimationFrame( render );

    // Rotate the teapot
    if(teapot){
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    controls.update();

    renderer.render( scene, camera );
}

render();
