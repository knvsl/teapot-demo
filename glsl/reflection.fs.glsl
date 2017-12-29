uniform samplerCube skybox;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

	// Normalize vectors
	vec3 n = normalize(vNormal);
	vec3 v = normalize(cameraPosition - vPosition);

	// Bounce vector
	vec3 b = -v + 2.0 * dot(v,n) * n;

	vec4 color = textureCube(skybox, b);

	gl_FragColor = color;
}
