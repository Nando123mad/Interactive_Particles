// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uTime;


vec4 colorB = vec4(1.000,0.833,0.224,1.0);

void main() {
	vec4 color = vec4(1.0);
	vec4 color2 = vec4(1.0);
	vec2 uv = vUv;
	vec2 puv = vPUv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);

	// greyscale
	float average = (colA.r + colA.g + colA.b) / 3.0;
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

	vec4 colB = vec4(uColor.r/255.0, uColor.g/255.0, uColor.b/255.0, 1.0); // too flat
	vec4 colB2a = vec4(uColor2.r/255.0, uColor2.g/255.0, uColor2.b/255.0, 1.0); // too flat

	//  vec4 colB2 = vec4(grey,grey,grey, 1.0); // all white

	// vec4 colB2 = colB; // FlatColor
	// vec4 colB2b = colB2a; // FlatColor

	// vec4 colB2 = vec4( colB.x + (1.0 - colB.x) * grey, colB.y + (1.0 - colB.y) * grey, colB.z + (1.0 - colB.z) * grey, 1.0); // tint
	// vec4 colB2 = vec4( colB.x + (1.0 - grey), colB.y + (1.0 - grey), colB.z + (1.0 - grey), 1.0); // shade
	// vec4 colB2 = vec4( colB.x + (0.21 - colB.x) * grey, colB.y + (0.71 - colB.y) * grey, colB.z + (0.07 - colB.z) * grey, 1.0); // other
	
	  vec4 colB2 = vec4( colB.x + (grey - colB.x) * 0.21, colB.y + (grey - colB.y) * 0.71, colB.z + (grey - colB.z) * 0.07, 1.0); // other2
	  vec4 colB2b = vec4( colB2a.x + (grey - colB2a.x) * 0.21, colB2a.y + (grey - colB2a.y) * 0.71, colB2a.z + (grey - colB2a.z) * 0.07, 1.0); // other2
	 
	// vec4 colB2 = vec4( colB.x + (grey - colB.x) * average, colB.y + (grey - colB.y) * average, colB.z + (grey - colB.z) * average, 1.0); // other3

	// circle
	float border = 0.5;
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
	float t = smoothstep(0.0, border, dist);

	// final color
	color = colB2;
	color.a = t;

	
	color2 = colB2b;
	color2.a = t;

	float pct = abs(sin(uTime));
	color = mix(color, color2, pct); 

	gl_FragColor = color;
}