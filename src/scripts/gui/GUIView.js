import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class GUIView {

	constructor(app) {
		this.app = app;

		this.particlesHitArea = false;
		this.particlesRandom = 2;
		this.particlesPositionZ = 4;
		this.particlesSize = 1.5;
		this.particlesSizeIntensity = 0.5;
		this.particlesPositionIntensity = 0.2;
		this.particlesPositionX = 2;
		this.particlesPositionY = 2;
		this.particlesPositionZ = 2;
		this.particleTestNum0 = 0.1;
		this.particleTestNum1 = 0.1;
		this.particleTestNum2 = 0.1;
		this.particlesColor= [129,42,245];
		this.particlesColor2= [64,0,148];


		this.touchRadius = 0.15;

		this.range = [0, 1];
		this.rangeRandom = [1, 50];
		this.rangeSize = [0, 3];
		this.rangeRadius = [0, 0.5];
		this.rangeSizeIntensity = [0, 10];

		this.rangePositionIntensity = [0, 10];
		this.rangePositionX = [0, 10];
		this.rangePositionY = [0, 10];
		this.rangePositionZ = [0, 10];

		this.testNum0 = [0.0, 1.2];
		this.testNum1 = [0.0, 1.2];
		this.testNum2 = [0.0, 1.2];

		this.initControlKit();
		// this.initStats();

		// this.disable();
	}

	initControlKit() {
		
		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 350, enable: false})

		.addGroup({label: 'Touch', enable: true })
		.addCanvas({ label: 'trail', height: 64 })
		.addSlider(this, 'touchRadius', 'rangeRadius', { label: 'radius', onChange: this.onTouchChange.bind(this) })
		
		.addGroup({label: 'Particles', enable: true })
		// .addCheckbox(this, 'particlesHitArea', { label: 'hit area', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesRandom', 'rangeRandom', { label: 'random position', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesSize', 'rangeSize', { label: 'size', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesSizeIntensity', 'rangeSizeIntensity', { label: 'size intensity', onChange: this.onParticlesChange.bind(this) })
		.addColor(this, 'particlesColor',{ label: 'primary color', onChange: this.onParticlesChange.bind(this), colorMode:'rgb'})
		.addColor(this, 'particlesColor2',{ label: 'second color', onChange: this.onParticlesChange.bind(this), colorMode:'rgb'})
		
		.addGroup({label: 'Particles Position', enable: true })
		.addSlider(this, 'particlesPositionIntensity', 'rangePositionIntensity', { label: 'movement intensity ', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesPositionX', 'rangePositionX', { label: 'X movement radius', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesPositionY', 'rangePositionY', { label: 'Y movement radius', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particlesPositionZ', 'rangePositionZ', { label: 'Z movement radius', onChange: this.onParticlesChange.bind(this) })

		
		.addGroup({label: 'Debug', enable: true })
		.addSlider(this, 'particleTestNum0', 'testNum0', { label: 'number0', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particleTestNum1', 'testNum1', { label: 'number1', onChange: this.onParticlesChange.bind(this) })
		.addSlider(this, 'particleTestNum2', 'testNum2', { label: 'number2', onChange: this.onParticlesChange.bind(this) })

		// store reference to canvas
		const component = this.controlKit.getComponentBy({ label: 'trail' });
		if (!component) return;

		this.touchCanvas = component._canvas;
		this.touchCtx = this.touchCanvas.getContext('2d');
	}

	initStats() {
		this.stats = new Stats();

		document.body.appendChild(this.stats.dom);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		// draw touch texture
		if (this.touchCanvas) {
			if (!this.app.webgl) return;
			if (!this.app.webgl.particles) return;
			if (!this.app.webgl.particles.touch) return;
			if (!this.app.webgl.sphereParticles) return;

			const source = this.app.webgl.sphereParticles.touch.canvas;
			const x = Math.floor((this.touchCanvas.width - source.width) * 0.5);
			this.touchCtx.fillRect(0, 0, this.touchCanvas.width, this.touchCanvas.height);
			this.touchCtx.drawImage(source, x, 0);
		}
	}

	enable() {
		this.controlKit.enable();
		if (this.stats) this.stats.dom.style.display = '';
	}

	disable() {
		this.controlKit.disable();
		if (this.stats) this.stats.dom.style.display = 'none';
	}

	toggle() {
		if (this.controlKit._enabled) this.disable();
		else this.enable();
	}

	onTouchChange() {
		if (!this.app.webgl) return;
		if (!this.app.webgl.particles) return;
		if (!this.app.webgl.sphereParticles) return;

		this.app.webgl.particles.touch.radius = this.touchRadius;
		this.app.webgl.sphereParticles.touch.radius = this.touchRadius;
	}
	
	onParticlesChange() {
		if (!this.app.webgl) return;
		if (!this.app.webgl.particles) return;
		if (!this.app.webgl.sphereParticles) return;

		this.app.webgl.particles.object3D.material.uniforms.uRandom.value = this.particlesRandom;
		this.app.webgl.particles.object3D.material.uniforms.uSize.value = this.particlesSize;
		this.app.webgl.particles.object3D.material.uniforms.uColor.value = this.particlesColor;
		this.app.webgl.particles.object3D.material.uniforms.uSizeIntensity.value = this.particlesSizeIntensity;

		this.app.webgl.particles.object3D.material.uniforms.uPositionIntensity.value = this.particlesPositionIntensity;
		this.app.webgl.particles.object3D.material.uniforms.uPositionX.value = this.particlesPositionX;
		this.app.webgl.particles.object3D.material.uniforms.uPositionY.value = this.particlesPositionY;
		this.app.webgl.particles.object3D.material.uniforms.uPositionZ.value = this.particlesPositionZ;

		this.app.webgl.particles.hitArea.material.visible = this.particlesHitArea;


		this.app.webgl.sphereParticles.object3D.material.uniforms.uRandom.value = this.particlesRandom;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uSize.value = this.particlesSize;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uColor.value = this.particlesColor;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uSizeIntensity.value = this.particlesSizeIntensity;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uPositionIntensity.value = this.particlesPositionIntensity;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uPositionX.value = this.particlesPositionX;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uPositionY.value = this.particlesPositionY;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uPositionZ.value = this.particlesPositionZ;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uTestNum0.value = this.particleTestNum0;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uTestNum1.value = this.particleTestNum1;
		this.app.webgl.sphereParticles.object3D.material.uniforms.uTestNum2.value = this.particleTestNum2;
		this.app.webgl.sphereParticles.hitArea.material.visible = this.particlesHitArea;
	}

	onPostProcessingChange() {
		if (!this.app.webgl.composer) return;
		this.app.webgl.composer.enabled = this.postProcessing;
	}
}
