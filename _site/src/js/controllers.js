/* Dat.GUI Controllers */

/////////////////
// Create GUIs //
/////////////////

// PHONG + BLINNPHONG
var phongGUI = new dat.GUI( { width : 400 } );
  phongGUI.add(resetButton, 'reset')
  .name('RESET')
  .onFinishChange(refreshDisplay);

  phongGUI.add(settings, 'rotate')
  .name('Rotate');

  phongGUI.add(settings, 'shader', shaderMenu )
  .name('Shader')
  .onChange(updateShader)
  .listen();

  phongGUI.addColor(color, 'light' )
  .name('Light Color')
  .onChange(updateLightColor)
  .onFinishChange(enableOrbit);

  phongGUI.add(lightPosition.value, 'x', -15, 15)
  .name('Light X')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  phongGUI.add(lightPosition.value, 'y', -15, 15)
  .name('Light Y')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  phongGUI.add(lightPosition.value, 'z', -15, 15)
  .name('Light Z')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = phongGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'ambient' )
  .name('Ambient Color')
  .onChange(updateAmbientColor)
  .onFinishChange(enableOrbit);

  uniforms.addColor(color, 'diffuse' )
  .name('Diffuse Color')
  .onChange(updateDiffuseColor)
  .onFinishChange(enableOrbit);

  uniforms.addColor(color, 'specular' )
  .name('Specular Color')
  .onChange(updateSpecularColor)
  .onFinishChange(enableOrbit);

  uniforms.add(shininess, 'value', 0, 100)
  .name('Shininess')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(kA, 'value', 0, 1)
  .name('Ambient Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(kS, 'value', 0, 1)
  .name('Specular Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(kD, 'value', 0, 1)
  .name('Diffuse Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);


// LAMBERTIAN
var lambertGUI = new dat.GUI( { width : 400 } );
  lambertGUI.add(resetButton, 'reset')
  .name('RESET')
  .onFinishChange(refreshDisplay);

  lambertGUI.add(settings, 'rotate')
  .name('Rotate');

  lambertGUI.add(settings, 'shader', shaderMenu )
    .name('Shader')
    .onChange(updateShader)
    .listen();

  lambertGUI.addColor(color, 'light' )
  .name('Light Color')
  .onChange(updateLightColor)
  .onFinishChange(enableOrbit);

  lambertGUI.add(lightPosition.value, 'x', -15, 15)
  .name('Light X')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  lambertGUI.add(lightPosition.value, 'y', -15, 15)
  .name('Light Y')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  lambertGUI.add(lightPosition.value, 'z', -15, 15)
  .name('Light Z')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = lambertGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'diffuse' )
  .name('Diffuse Color')
  .onChange(updateDiffuseColor)
  .onFinishChange(enableOrbit);

  uniforms.add(kD, 'value', 0, 1)
  .name('Diffuse Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

// Hide at start
lambertGUI.domElement.style.display = 'none';


// ANISOTROPHIC
var anisoGUI = new dat.GUI( { width : 400 } );
  anisoGUI.add(resetButton, 'reset')
  .name('RESET')
  .onFinishChange(refreshDisplay);

  anisoGUI.add(settings, 'rotate')
  .name('Rotate');

  anisoGUI.add(settings, 'shader', shaderMenu )
    .name('Shader')
    .onChange(updateShader)
    .listen();

  anisoGUI.addColor(color, 'light' )
  .name('Light Color')
  .onChange(updateLightColor)
  .onFinishChange(enableOrbit);

  anisoGUI.add(lightPosition.value, 'x', -15, 15)
  .name('Light X')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  anisoGUI.add(lightPosition.value, 'y', -15, 15)
  .name('Light Y')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  anisoGUI.add(lightPosition.value, 'z', -15, 15)
  .name('Light Z')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

// Uniforms Folder
var uniforms = anisoGUI.addFolder('Uniforms');
  uniforms.addColor(color, 'ambient' )
  .name('Ambient Color')
  .onChange(updateAmbientColor)
  .onFinishChange(enableOrbit);

  uniforms.addColor(color, 'diffuse' )
  .name('Diffuse Color')
  .onChange(updateDiffuseColor)
  .onFinishChange(enableOrbit);

  uniforms.addColor(color, 'specular' )
  .name('Specular Color')
  .onChange(updateSpecularColor)
  .onFinishChange(enableOrbit);

  uniforms.add(kA, 'value', 0, 1)
  .name('Ambient Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(kS, 'value', 0, 1)
  .name('Specular Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(kD, 'value', 0, 1)
  .name('Diffuse Intensity')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(alphaX, 'value', 0, 1)
  .name('X Width')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

  uniforms.add(alphaY, 'value', 0, 1)
  .name('Y Width')
  .onChange(disableOrbit)
  .onFinishChange(enableOrbit);

// Hide at start
anisoGUI.domElement.style.display = 'none';

// REFLECTION
var reflectGUI =  new dat.GUI( { width : 400 } );
  reflectGUI.add(resetButton, 'reset')
  .name('RESET')
  .onFinishChange(refreshDisplay);

  reflectGUI.add(settings, 'rotate')
  .name('Rotate');

  reflectGUI.add(settings, 'shader', shaderMenu )
    .name('Shader')
    .onChange(updateShader)
    .listen();

// Hide at start
reflectGUI.domElement.style.display = 'none';

// REFRACTION
var refractGUI =  new dat.GUI( { width : 400 } );
  refractGUI.add(resetButton, 'reset')
  .name('RESET')
  .onFinishChange(refreshDisplay);

  refractGUI.add(settings, 'rotate')
  .name('Rotate');

  refractGUI.add(settings, 'shader', shaderMenu )
    .name('Shader')
    .onChange(updateShader)
    .listen();

  // Uniforms Folder
  var uniforms = refractGUI.addFolder('Uniforms');
    uniforms.add(index, 'value', 0, 2)
    .name('Refractive Index')
    .onChange(disableOrbit)
    .onFinishChange(enableOrbit);

// Hide at start
refractGUI.domElement.style.display = 'none';

//////////////////
// Init Shaders //
//////////////////

var shaders = [];

var phong = new shader(phongMaterial, phongGUI);
var blinnPhong = new shader(blinnPhongMaterial, phongGUI);
var lambertian = new shader(lambertianMaterial, lambertGUI);
var anisotropic = new shader(anisotropicMaterial, anisoGUI);
var reflection = new shader(reflectionMaterial, reflectGUI);
var refraction = new shader(refractionMaterial, refractGUI);

shaders[PHONG] = phong;
shaders[BLINNPHONG] = blinnPhong;
shaders[LAMBERTIAN] = lambertian;
shaders[ANISOTROPIC] = anisotropic;
shaders[REFLECTION] = reflection;
shaders[REFRACTION] = refraction;

var currentShader = phong;
