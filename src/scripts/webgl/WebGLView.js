import 'three';
import { TweenLite } from 'gsap/TweenMax';

import InteractiveControls from './controls/InteractiveControls';
import Particles from './particles/Particles';
import SphereParticles from './particles/SphereParticles';

const glslify = require('glslify');

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.samples = [
			'images/sample-01a.png',
			// 'images/sample-02.png',
			// 'images/sample-03.png',
			// 'images/sample-04.png',
			// 'images/sample-05.png',
		];

		this.initThree();
		this.initSphere();
		this.initParticles();
		this.initControls();

		const rnd = ~~(Math.random() * this.samples.length);
		this.goto(rnd);
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		// renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        // clock
		this.clock = new THREE.Clock(true);

	}

	initSphere(){
		// this.sphereParticles = new SphereParticles(this);
		// console.log(this);
		// this.material = new THREE.ShaderMaterial( {
		// 	vertexShader: glslify(require('../../shaders/particle_circle.vert')),
		// 	fragmentShader: glslify(require('../../shaders/particle_circle.frag')),
		// 	// wireframe: true
		//   } );
		// this.mesh = new THREE.Mesh(
		// 	new THREE.IcosahedronGeometry( 20, 4 ),
		// 	this.material
		//   );
		// this.scene.add( this.mesh );

		this.sphereParticles = new SphereParticles(this);
		this.scene.add(this.sphereParticles.container);

	}
	
	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles() {
		this.particles = new Particles(this);
		// this.scene.add(this.particles.container);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		const delta = this.clock.getDelta();

		if (this.sphereParticles) this.sphereParticles.update(delta);
		if (this.particles) this.particles.update(delta);
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}


	goto(index) {
		// init next
		if (this.currSample == null) this.particles.init(this.samples[index]);
		// hide curr then init next
		else {
			this.particles.hide(true).then(() => {
				this.particles.init(this.samples[index]);
			});
		}
		// init next
		if (this.currSample == null) this.sphereParticles.init(this.samples[index]);
		// hide curr then init next
		else {
			this.sphereParticles.hide(true).then(() => {
				this.sphereParticles.init(this.samples[index]);
			});
		}

		this.currSample = index;
	}

	next() {
		if (this.currSample < this.samples.length - 1) this.goto(this.currSample + 1);
		else this.goto(0);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.interactive) this.interactive.resize();
		if (this.particles) this.particles.resize();
		if (this.sphereParticles) this.sphereParticles.resize();
	}
}
