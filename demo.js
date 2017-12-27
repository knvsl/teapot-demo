// Renderer
var renderer = new THREE.WebGLRenderer();
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xFFFFFF);

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
light.position.set( lightPosition );
scene.add( light );

// Light Helper
var helperColor = new THREE.Color( 0, 0, 0 );
var helperSize = 0.5;
var lightHelper = new THREE.PointLightHelper( light, helperSize, helperColor);
scene.add( lightHelper );

// Load Object (teapot)

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

// Render Scene
function render() {
    window.requestAnimationFrame( render );

    orbitControls.update();

    updateMaterials();

    // Rotate teapot
    if(teapot && settings.rotate) {
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    renderer.render( scene, camera );
}

resizeWindow();
createPhongGUI();
render();
