uniform samplerCube skybox;
varying vec3 vPosition;

void main() {

	vPosition = vec3(modelMatrix * vec4(position, 1.0));

	// Move position with camera
	gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
}
