uniform samplerCube skybox;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vNormal = vec3(modelMatrix * vec4(normal, 0.0));
    vPosition = vec3(modelMatrix * vec4(position, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
