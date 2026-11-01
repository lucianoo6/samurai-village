/**
 * Utils - Funções utilitárias para o cenário
 */

import * as THREE from 'three';

export class Utils {
    /**
     * Carregar textura com fallback procedural
     */
    static async loadTexture(path, fallbackTexture = null) {
        const textureLoader = new THREE.TextureLoader();
        
        try {
            return await textureLoader.loadAsync(path);
        } catch (error) {
            console.warn(`Não foi possível carregar textura: ${path}`, error);
            if (fallbackTexture) {
                return fallbackTexture;
            }
            // Retornar textura branca
            return new THREE.Texture();
        }
    }
    
    /**
     * Criar material com textura ou cor sólida
     */
    static createMaterial(options = {}) {
        const defaultOptions = {
            color: 0xFFFFFF,
            texture: null,
            roughness: 0.5,
            metalness: 0,
            transparent: false,
            opacity: 1
        };
        
        const opts = { ...defaultOptions, ...options };
        
        const materialOptions = {
            color: opts.color,
            roughness: opts.roughness,
            metalness: opts.metalness,
            transparent: opts.transparent,
            opacity: opts.opacity
        };
        
        if (opts.texture) {
            materialOptions.map = opts.texture;
        }
        
        return new THREE.MeshStandardMaterial(materialOptions);
    }
    
    /**
     * Clonar objeto com todos os filhos
     */
    static cloneObject(obj) {
        const clone = obj.clone();
        
        // Clonar filhos
        obj.children.forEach(child => {
            const childClone = this.cloneObject(child);
            clone.add(childClone);
        });
        
        return clone;
    }
    
    /**
     * Calcular centro de um grupo
     */
    static calculateCenter(group) {
        const box = new THREE.Box3();
        box.setFromObject(group);
        const center = new THREE.Vector3();
        box.getCenter(center);
        return center;
    }
    
    /**
     * Ajustar objeto para caber na câmera
     */
    static fitToCamera(object, camera, padding = 1.1) {
        const box = new THREE.Box3();
        box.setFromObject(object);
        
        const size = new THREE.Vector3();
        box.getSize(size);
        
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        let distance;
        
        if (camera.isPerspectiveCamera) {
            const fov = camera.fov * (Math.PI / 180);
            const height = size.y;
            distance = height / (2 * Math.tan(fov / 2)) * padding;
        } else if (camera.isOrthographicCamera) {
            const height = size.y;
            distance = height / 2 * padding;
        }
        
        const direction = camera.position.clone().sub(center).normalize();
        camera.position.copy(center).add(direction.multiplyScalar(distance));
        camera.lookAt(center);
    }
    
    /**
     * Gerar nome único
     */
    static generateId(prefix = 'obj') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Verificar se objeto está visível na câmera
     */
    static isVisibleInCamera(object, camera) {
        const box = new THREE.Box3();
        box.setFromObject(object);
        
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(projScreenMatrix);
        
        return frustum.intersectsBox(box);
    }
    
    /**
     * Adicionar sombras a um objeto
     */
    static enableShadows(object, cast = true, receive = true) {
        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = cast;
                child.receiveShadow = receive;
            }
        });
    }
    
    /**
     * Desabilitar sombras de um objeto
     */
    static disableShadows(object) {
        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });
    }
    
    /**
     * Otimizar objeto (reduzir polígonos, remover geometrias desnecessárias)
     */
    static optimizeObject(object) {
        object.traverse(child => {
            if (child.isMesh && child.geometry) {
                // Remover atributos desnecessários
                child.geometry.deleteAttribute('normal');
                child.geometry.deleteAttribute('uv');
                child.geometry.deleteAttribute('tangent');
                
                // Computar normais se necessário
                child.geometry.computeVertexNormals();
            }
        });
    }
    
    /**
     * Criar geometria simplificada
     */
    static createSimplifiedGeometry(geometry, detail = 0.5) {
        // Implementação simplificada
        // Em produção, use THREE.SimplifyGeometry ou similar
        return geometry;
    }
    
    /**
     * Animar propriedade numérica
     */
    static animateProperty(obj, property, targetValue, duration = 1, easing = 'linear', onComplete = null) {
        const startValue = obj[property];
        const startTime = Date.now();
        
        const update = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            let easedProgress = progress;
            
            // Funções de easing
            if (easing === 'easeInQuad') {
                easedProgress = progress * progress;
            } else if (easing === 'easeOutQuad') {
                easedProgress = progress * (2 - progress);
            } else if (easing === 'easeInOutQuad') {
                easedProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            } else if (easing === 'easeInElastic') {
                const c4 = (2 * Math.PI) / 3;
                easedProgress = progress === 0 ? 0 : progress === 1 ? 1 : -Math.pow(2, 10 * progress - 10) * Math.sin((progress * 10 - 10.75) * c4);
            }
            
            obj[property] = startValue + (targetValue - startValue) * easedProgress;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        update();
    }
    
    /**
     * Converter coordenadas 2D para 3D
     */
    static screenToWorld(screenX, screenY, camera, scene) {
        // Criar vetor normalizado
        const mouse = new THREE.Vector2(
            (screenX / window.innerWidth) * 2 - 1,
            -(screenY / window.innerHeight) * 2 + 1
        );
        
        // Raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Verificar interseção com objetos
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        
        // Retornar ponto no plano XY
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersect);
        
        return intersect;
    }
    
    /**
     * Formatar número para string
     */
    static formatNumber(num, decimals = 2) {
        return num.toFixed(decimals);
    }
    
    /**
     * Gerar cor aleatória
     */
    static randomColor() {
        return Math.floor(Math.random() * 16777215);
    }
    
    /**
     * Gerar cor em formato hex
     */
    static randomHexColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }
}

// Exportar
window.Utils = Utils;
