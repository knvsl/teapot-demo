/* Demo Settings */

// Shader Options
const PHONG = 0;
const BLINNPHONG = 1;
const LAMBERTIAN = 2;
const ANISOTROPHIC = 3;

// Object Settings
var settings = {
  rotate : false,
  shader : PHONG
};

// Light Position
var lightPosition = { type: 'v3', value: new THREE.Vector3( 3, 3, 0 ) }

// Default Controller Values
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
