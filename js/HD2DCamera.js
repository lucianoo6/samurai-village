/**
 * HD2DCamera - Câmera especial para jogos HD 2D com Three.js
 * Permite navegação em 2D com profundidade
 */

import * as THREE from 'three';

export class HD2DCamera {
    constructor(sceneManager, options = {}) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.renderer = sceneManager.getRenderer();
        
        this.options = {
            zoom: options.zoom || 1,
            near: options.near || 0.1,
            far: options.far || 1000,
            viewport: options.viewport || { x: 0, y: 0, width: 1, height: 1 }
        };
        
        this.camera = null;
        this.target = new THREE.Vector3();
        this.position = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        
        this.init();
    }
    
    init() {
        const aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        
        // Criar câmera ortográfica para visualização 2D
        const frustumSize = 50 * this.options.zoom;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            this.options.near,
            this.options.far
        );
        
        // Posicionar câmera
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);
        
        // Configurar offset
        this.offset.set(0, 0, 0);
    }
    
    update(delta) {
        // Suave transição da câmera
        const targetPosition = new THREE.Vector3(
            this.target.x + this.offset.x,
            this.target.y + this.offset.y,
            this.target.z + this.offset.z
        );
        
        this.camera.position.lerp(targetPosition, delta * 5);
        this.camera.lookAt(this.target);
    }
    
    setTarget(x, y, z = 0) {
        this.target.set(x, y, z);
    }
    
    setPosition(x, y, z = 100) {
        this.position.set(x, y, z);
        this.camera.position.copy(this.position);
    }
    
    setOffset(x, y, z = 0) {
        this.offset.set(x, y, z);
    }
    
    setZoom(zoom) {
        this.options.zoom = zoom;
        this.updateProjection();
    }
    
    updateProjection() {
        const aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        const frustumSize = 50 * this.options.zoom;
        
        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        
        this.camera.updateProjectionMatrix();
    }
    
    follow(targetObject, offset = { x: 0, y: 0, z: 0 }) {
        this.target.copy(targetObject.position);
        this.offset.set(offset.x, offset.y, offset.z);
    }
    
    shake(intensity = 0.1, duration = 0.5) {
        const startTime = Date.now();
        const originalPosition = this.camera.position.clone();
        
        const shakeUpdate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress >= 1) {
                this.camera.position.copy(originalPosition);
                this.sceneManager.removeAnimation(shakeUpdate);
                return;
            }
            
            const decay = 1 - progress;
            this.camera.position.set(
                originalPosition.x + (Math.random() - 0.5) * intensity * decay,
                originalPosition.y + (Math.random() - 0.5) * intensity * decay,
                originalPosition.z
            );
        };
        
        this.sceneManager.addAnimation({ update: shakeUpdate });
    }
    
    getCamera() {
        return this.camera;
    }
    
    getPosition() {
        return this.camera.position.clone();
    }
    
    getTarget() {
        return this.target.clone();
    }
}

// Exportar
window.HD2DCamera = HD2DCamera;
