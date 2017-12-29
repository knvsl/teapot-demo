// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF);
document.body.appendChild( renderer.domElement );

function resizeWindow() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeWindow, false);
window.onscroll = function() { window.scrollTo(0, 0); }

var scene = new THREE.Scene();
scene.background = backgroundColor;

// Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(2,2,10);
camera.lookAt( scene.position );

// Controls
var orbitControls = new THREE.OrbitControls(camera);
orbitControls.damping = 0.5;
orbitControls.autoRotate = false;
orbitControls.zoomSpeed = 0.1;

// Axes Helper
var axesHelper = new THREE.AxesHelper( 3 );
scene.add( axesHelper );

// TODO: Make movable, color reflects lightcolor
var lightGeometry = new THREE.SphereGeometry( 0.5, 3, 3 );
var lightMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
var light = new THREE.Mesh( lightGeometry, lightMaterial );
light.position.set( 3, 3, 0 );
scene.add( light );

// SKYBOX
// TODO: skybox picker, simple thumbnail display onclick?
var skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
//scene.add(skybox)

// Load Object
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

    // Rotate teapot
    if(teapot && settings.rotate) {
      teapot.rotation.x += 0.005;
      teapot.rotation.y += 0.005;
    }

    orbitControls.update();
    updateMaterials(currentShader.material);

    window.requestAnimationFrame( render );

    renderer.render( scene, camera );
}

resizeWindow();
render();
