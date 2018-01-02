/* Demo Settings */

// Shader Settings
const PHONG = 0;
const BLINNPHONG = 1;
const LAMBERTIAN = 2;
const ANISOTROPHIC = 3;
const REFLECTION = 4;
const REFRACTION = 5;

// Object Settings
var settings = {
  rotate : false,
  shader : PHONG,
};

// Default Uniform Values
var defaults = {
    lightColor : 0xFFFFFF,
    ambientColor : 0x555555,
    diffuseColor : 0xFFFFFF,
    specularColor : 0xFFFFFF,
    shininess : 10.0,
    kA : 0.6,
    kD : 0.8,
    kS : 0.8,
    alphaX : 0.5,
    alphaY : 0.05,
};

// Light Settings
var lightPosition = { type: 'v3', value: new THREE.Vector3( 3, 3, 0 ) }

var color = {
  light : defaults.lightColor,
  ambient : defaults.ambientColor,
  diffuse : defaults.diffuseColor,
  specular : defaults.specularColor,
}

// Cubemap Settings

/*
ft  bk
up  dn
rt  lf
*/
var cubemap = new THREE.CubeTextureLoader()
  .setPath( 'img/default/' )
  .load([
    'default_ft.png', 'default_bk.png',
    'default_up.png', 'default_dn.png',
    'default_rt.png', 'default_lf.png'
  ]);
