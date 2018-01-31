uniform vec3 lightColor;
uniform vec3 diffuseColor;
uniform vec3 lightPosition;
uniform float kD;

varying vec3 vLight;
varying vec3 vNormal;

void main() {

	// Normalize vectors
	vec3 l = normalize(vLight);
	vec3 n = normalize(vNormal);

	// Diffuse
	float diffuse = max(0.0, dot(l,n));
	vec3 diffuseLight = kD * diffuseColor * diffuse * lightColor;

	// Total Light
	vec3 totalLight = diffuseLight;
	gl_FragColor = vec4(totalLight, 0.0);

}
