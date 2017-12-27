uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform float kA;
uniform float kD;
uniform float kS;
uniform float alphaX;
uniform float alphaY;

varying vec3 vLight;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

	// Normalize vectors
	vec3 n = normalize(vNormal);
	vec3 l = normalize(vLight);
	vec3 v = normalize(-vPosition);

	// Tangent vector
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 t = cross(n,up);

	// Halfway vector
	vec3 h = normalize(l + v);

	// Binomial vector
	vec3 b = cross(n,t);

	// Ambient
	vec3 ambientLight = kA * ambientColor;

	// Diffuse
	float diffuse = max(0.0, dot(l,n));
	vec3 diffuseLight = kD * lightColor * diffuse;


	// dot products
	float ln = max(dot(l,n), 0.0);
	float vn = max(dot(v,n), 0.0);
	float ht = dot(h,t);
	float hb = dot(h,b);
	float hn = dot(h,n);

	// Specular (Ward's Model)
	float specular = sqrt(max(ln/vn, 0.0))
									 * exp(-2.0 * (pow(ht/alphaX, 2.0) + pow(hb/alphaY, 2.0)) / (1.0 + hn));
	vec3 specularLight = kS * lightColor * specular;

	// Total Light
	vec3 totalLight = ambientLight + diffuseLight + specularLight;
	gl_FragColor = vec4(totalLight, 0.0);

}
