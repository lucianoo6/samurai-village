/**
 * SceneManager - Core reutilizável para gerenciamento de cenas Three.js
 * Projetado para jogos HD 2D com suporte a props, animações e efeitos naturais
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor(container = document.body, options = {}) {
        this.container = container;
        this.options = {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x87CEEB, // Céu claro
            cameraType: 'orthographic', // Para estilo HD 2D
            cameraZoom: 20,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.props = [];
        this.animations = [];
        this.clock = new THREE.Clock();
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.createRenderer();
        this.createScene();
        this.createCamera();
        this.createControls();
        this.setupLights();
        this.setupResize();
        this.animate();
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(this.options.width, this.options.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }
    
    createCamera() {
        const aspect = this.options.width / this.options.height;
        
        if (this.options.cameraType === 'orthographic') {
            const frustumSize = this.options.cameraZoom * 2;
            this.camera = new THREE.OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                0.1,
                1000
            );
        } else {
            this.camera = new THREE.PerspectiveCamera(
                75,
                aspect,
                0.1,
                1000
            );
        }
        
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
    }
    
    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
    }
    
    setupLights() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Luz direcional (sol)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -60;
        directionalLight.shadow.camera.right = 60;
        directionalLight.shadow.camera.top = 60;
        directionalLight.shadow.camera.bottom = -60;
        this.scene.add(directionalLight);
        
        // Luz de hemisfério (céu/terra)
        const hemisphereLight = new THREE.HemisphereLight(
            0x87CEEB, // céu
            0x3d5c3d, // terra
            0.3
        );
        hemisphereLight.position.set(0, 100, 0);
        this.scene.add(hemisphereLight);
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }
    
    onResize() {
        this.options.width = window.innerWidth;
        this.options.height = window.innerHeight;
        
        this.renderer.setSize(this.options.width, this.options.height);
        
        if (this.options.cameraType === 'orthographic') {
            const aspect = this.options.width / this.options.height;
            const frustumSize = this.options.cameraZoom * 2;
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
        } else {
            this.camera.aspect = this.options.width / this.options.height;
        }
        
        this.camera.updateProjectionMatrix();
    }
    
    addProp(prop) {
        this.props.push(prop);
        this.scene.add(prop);
    }
    
    removeProp(prop) {
        const index = this.props.indexOf(prop);
        if (index > -1) {
            this.props.splice(index, 1);
            this.scene.remove(prop);
        }
    }
    
    addAnimation(animation) {
        this.animations.push(animation);
    }
    
    removeAnimation(animation) {
        const index = this.animations.indexOf(animation);
        if (index > -1) {
            this.animations.splice(index, 1);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isPaused) return;
        
        const delta = this.clock.getDelta();
        
        // Atualizar controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Atualizar animações
        this.animations.forEach(anim => {
            if (anim.update) anim.update(delta);
        });
        
        // Atualizar props
        this.props.forEach(prop => {
            if (prop.update) prop.update(delta);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.animate();
    }
    
    dispose() {
        this.pause();
        
        // Remover todos os props
        this.props.forEach(prop => {
            if (prop.geometry) prop.geometry.dispose();
            if (prop.material) {
                if (Array.isArray(prop.material)) {
                    prop.material.forEach(m => m.dispose());
                } else {
                    prop.material.dispose();
                }
            }
            this.scene.remove(prop);
        });
        this.props = [];
        
        // Remover renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        // Limpar cena
        this.scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        
        window.removeEventListener('resize', this.onResize);
    }
    
    getScene() { return this.scene; }
    getCamera() { return this.camera; }
    getRenderer() { return this.renderer; }
    getProps() { return this.props; }
}
