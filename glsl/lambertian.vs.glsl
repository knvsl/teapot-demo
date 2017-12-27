uniform vec3 lightColor;
uniform vec3 diffuseColor;
uniform vec3 lightPosition;
uniform float kD;

varying vec3 vLight;
varying vec3 vNormal;

void main() {

   // Compute light direction
   vec3 worldPosition = vec3(modelMatrix * vec4(position, 1.0));
   vec3 lightDirection = lightPosition - worldPosition;

   // Set varying variables in eye coordinates
   vLight = vec3(viewMatrix * vec4(lightDirection, 0.0));
   vNormal = normalMatrix * normal;

   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
