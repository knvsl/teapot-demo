uniform samplerCube skybox;

varying vec3 vPosition;

void main() {

	// Using skybox position in world space as coordinates
	vec4 color = textureCube(skybox, vPosition);

	gl_FragColor = color;
}
