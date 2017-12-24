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

	// Normalize vectors
	vec3 l = normalize(vLight);
	vec3 v = normalize(-vPosition);
	vec3 n = normalize(vNormal);

  // Bounce vector
	vec3 b = -l + 2.0 * dot(l,n) * n;

	// Ambient
	vec3 ambientLight = kA * ambientColor;

	// Diffuse
	float diffuse = max(0.0, dot(l,n));
	vec3 diffuseLight = kD * lightColor * diffuse;

	// Specular
	float specular = pow(max(0.0, dot(b,v)), shininess);
	vec3 specularLight = kS * lightColor * specular;

	// Total Light
	vec3 totalLight = ambientLight + diffuseLight + specularLight;
	gl_FragColor = vec4(totalLight, 0.0);

}
