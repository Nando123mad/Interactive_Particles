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
	gl_FragColor = colorB;
}