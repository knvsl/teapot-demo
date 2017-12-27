// Light Uniforms
var lightColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };
var ambientColor = { type: 'c', value: new THREE.Color( 0x555555 ) };
var diffuseColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };
var specularColor = { type: 'c', value: new THREE.Color( 0xFFFFFF ) };

// Material Uniforms
var shininess = { type: 'f', value: 10.0 };
var kA = { type: 'f', value: 0.4 };
var kD = { type: 'f', value: 0.8 };
var kS = { type: 'f', value: 0.8 };
var alphaX = { type: 'f', value: 0.5 };
var alphaY = { type: 'f', value: 0.1 };

/* PHONG */

var phongUniforms = {
  lightColor : lightColor,
  ambientColor : ambientColor,
  diffuseColor : diffuseColor,
  specularColor : specularColor,
  lightPosition : lightPosition,
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

/* BLINN-PHONG */

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

/* LAMBERTIAN */

var lambertianUniforms = {
  lightColor : lightColor,
  diffuseColor : diffuseColor,
  lightPosition : lightPosition,
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

/* ANISOTROPHIC */

var anisotrophicUniforms = {
  lightColor : lightColor,
  ambientColor : ambientColor,
  diffuseColor : diffuseColor,
  specularColor : specularColor,
  lightPosition : lightPosition,
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
