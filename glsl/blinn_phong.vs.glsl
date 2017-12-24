uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform float shininess;
uniform float kA;
uniform float kD;
uniform float kS;

varying vec3 vLight;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    // Compute light direction
    vec3 worldPosition = vec3(modelMatrix * vec4(position, 1.0));
    vec3 lightDirection = lightPosition - worldPosition;

    vLight = vec3(viewMatrix * vec4(lightDirection, 0.0));
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    vNormal = normalMatrix * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
