// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform vec3 uColor;
uniform float uSize;
uniform float uSizeIntensity;

uniform float uPositionIntensity;
uniform float uPositionX;
uniform float uPositionY;
uniform float uPositionZ;
uniform vec2 uTextureSize;

uniform sampler2D uTexture;
uniform sampler2D uTouch;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
#pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)

float random(float n) {
	float randomMultiplier = 4500.5453123;// 43758.5453123 original number
	return fract(sin(n) * randomMultiplier);
}

void main() {
	vUv = uv;

	// particle uv
	vec2 puv = offset.xy / uTextureSize;
	vPUv = puv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

	// displacement
	vec3 displaced = offset;
	// randomise
	displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
	float rndz = (random(pindex) + snoise2(vec2(pindex * 0.1, uTime * uPositionIntensity)));
	



	// center
	displaced.xy -= uTextureSize * 0.5;
	
	//displaced.x += sin(rndz * (random(pindex) * 2.0 )) * uPositionX;
	displaced.x += sin(rndz * (random(pindex) * 2.0 )) * uPositionX;

	//displaced.y += cos(rndz * (random(pindex) * 2.0 )) * uPositionY;
	displaced.y += cos(rndz * (random(pindex) * 2.0 )) * uPositionY;

    // displaced.z += rndz * ( random(pindex) * 2.0 );
	displaced.z += (rndz * (random(pindex) * 2.0)) *uPositionZ;





	// touch
	float t = texture2D(uTouch, puv).r;
	displaced.z += t * 20.0 * rndz;
	displaced.x += cos(angle) * t * 20.0 * rndz;
	displaced.y += sin(angle) * t * 20.0 * rndz;

	// particle size
	float psize = (cnoise2(vec2(uTime, pindex) * uSizeIntensity) + 2.0);
	psize *= max(grey, 0.2);
	psize *= uSize;

	// final position
	vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
	mvPosition.xyz += position * psize ;
	vec4 finalPosition = projectionMatrix * mvPosition;

	gl_Position = finalPosition;
}
