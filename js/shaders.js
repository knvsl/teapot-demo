/* Shaders */

// Light Uniforms
var lightColor = { type: 'c', value: new THREE.Color( color.light ) };
var ambientColor = { type: 'c', value: new THREE.Color( color.ambient ) };
var diffuseColor = { type: 'c', value: new THREE.Color( color.diffuse ) };
var specularColor = { type: 'c', value: new THREE.Color( color.specular ) };

// Material Uniforms
var shininess = { type: 'f', value: defaults.shininess };
var kA = { type: 'f', value: defaults.kA };
var kD = { type: 'f', value: defaults.kD };
var kS = { type: 'f', value: defaults.kS };
var alphaX = { type: 'f', value: defaults.alphaX };
var alphaY = { type: 'f', value: defaults.alphaY };

// Cubemap Uniforms
var cubemap = new THREE.CubeTextureLoader()
  .setPath( 'img/deception_pass/' )
  .load( [
    'deception_pass_ft.png', 'deception_pass_bk.png',
    'deception_pass_up.png', 'deception_pass_dn.png',
    'deception_pass_rt.png', 'deception_pass_lf.png'
  ] );

////////////
// SKYBOX //
////////////

var skyboxMaterial = new THREE.ShaderMaterial({
	uniforms: {
		skybox: { type: "t", value: cubemap },
	},
  side: THREE.DoubleSide
})

var loader = new THREE.FileLoader();
   loader.load('glsl/skybox.vs.glsl', function(shader) {
     skyboxMaterial.vertexShader = shader
   });
   loader.load('glsl/skybox.fs.glsl', function(shader) {
     skyboxMaterial.fragmentShader = shader
   });

///////////
// PHONG //
///////////

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

var loader = new THREE.FileLoader();
   loader.load('glsl/phong.vs.glsl', function(shader) {
     phongMaterial.vertexShader = shader
   });
   loader.load('glsl/phong.fs.glsl', function(shader) {
     phongMaterial.fragmentShader = shader
   });

/////////////////
// BLINN-PHONG //
/////////////////

var blinnPhongUniforms = {
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

var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms : blinnPhongUniforms,
});

var loader = new THREE.FileLoader();
   loader.load('glsl/blinn_phong.vs.glsl', function(shader) {
     blinnPhongMaterial.vertexShader = shader
   });
   loader.load('glsl/blinn_phong.fs.glsl', function(shader) {
     blinnPhongMaterial.fragmentShader = shader
   });

////////////////
// LAMBERTIAN //
////////////////

var lambertUniforms = {
  lightColor : lightColor,
  diffuseColor : diffuseColor,
  lightPosition : lightPosition,
  kD : kD,
};

var lambertianMaterial = new THREE.ShaderMaterial({
  uniforms : lambertUniforms,
});

var loader = new THREE.FileLoader();
   loader.load('glsl/lambertian.vs.glsl', function(shader) {
     lambertianMaterial.vertexShader = shader
   });
   loader.load('glsl/lambertian.fs.glsl', function(shader) {
     lambertianMaterial.fragmentShader = shader
   });

//////////////////
// ANISOTROPHIC //
//////////////////

var anisoUniforms = {
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
  uniforms : anisoUniforms,
});

var loader = new THREE.FileLoader();
   loader.load('glsl/anisotrophic.vs.glsl', function(shader) {
     anisotrophicMaterial.vertexShader = shader
   });
   loader.load('glsl/anisotrophic.fs.glsl', function(shader) {
     anisotrophicMaterial.fragmentShader = shader
   });
