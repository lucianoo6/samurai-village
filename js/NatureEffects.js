/**
 * NatureEffects - Efeitos naturais para o cenário
 * Animações de água, vento, folhas, etc.
 */

import * as THREE from 'three';

export class NatureEffects {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.effects = [];
        this.time = 0;
    }
    
    update(delta) {
        this.time += delta;
        this.effects.forEach(effect => {
            if (effect.update) effect.update(delta);
        });
    }
    
    /**
     * Cria partículas de poeira flutuante
     */
    createDustParticles(count = 20, area = { width: 50, height: 10, depth: 50 }) {
        const group = new THREE.Group();
        group.name = 'DustParticles';
        
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.3,
            roughness: 1.0
        });
        
        for (let i = 0; i < count; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * area.width,
                Math.random() * area.height,
                (Math.random() - 0.5) * area.depth
            );
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    Math.random() * 0.01 + 0.005,
                    (Math.random() - 0.5) * 0.01
                ),
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.01,
                    Math.random() * 0.01,
                    Math.random() * 0.01
                ),
                scaleFactor: 0.5 + Math.random() * 0.5
            };
            
            particle.scale.set(
                particle.userData.scaleFactor,
                particle.userData.scaleFactor,
                particle.userData.scaleFactor
            );
            
            group.add(particle);
        }
        
        group.update = (delta) => {
            group.children.forEach(particle => {
                particle.position.add(
                    particle.userData.velocity.clone().multiplyScalar(delta * 60)
                );
                particle.rotation.x += particle.userData.rotationSpeed.x * delta * 60;
                particle.rotation.y += particle.userData.rotationSpeed.y * delta * 60;
                particle.rotation.z += particle.userData.rotationSpeed.z * delta * 60;
                
                // Resetar partícula se sair da área
                if (particle.position.y > area.height) {
                    particle.position.y = 0;
                    particle.position.x = (Math.random() - 0.5) * area.width;
                    particle.position.z = (Math.random() - 0.5) * area.depth;
                }
            });
        };
        
        this.scene.add(group);
        this.effects.push(group);
        return group;
    }
    
    /**
     * Cria folhas caindo
     */
    createFallingLeaves(count = 30, area = { width: 50, height: 30, depth: 50 }) {
        const group = new THREE.Group();
        group.name = 'FallingLeaves';
        
        const leafGeometry = new THREE.BoxGeometry(0.3, 0.01, 0.15);
        const leafMaterials = [
            new THREE.MeshStandardMaterial({ color: 0xFF6347, transparent: true, opacity: 0.9 }),
            new THREE.MeshStandardMaterial({ color: 0xFFA07A, transparent: true, opacity: 0.9 }),
            new THREE.MeshStandardMaterial({ color: 0xFFD700, transparent: true, opacity: 0.9 }),
            new THREE.MeshStandardMaterial({ color: 0xFF8C00, transparent: true, opacity: 0.9 }),
            new THREE.MeshStandardMaterial({ color: 0xFF4500, transparent: true, opacity: 0.9 })
        ];
        
        for (let i = 0; i < count; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterials[Math.floor(Math.random() * leafMaterials.length)]);
            leaf.position.set(
                (Math.random() - 0.5) * area.width,
                Math.random() * area.height + 10,
                (Math.random() - 0.5) * area.depth
            );
            
            leaf.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    -0.01 - Math.random() * 0.01,
                    (Math.random() - 0.5) * 0.02
                ),
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.05,
                    Math.random() * 0.05,
                    Math.random() * 0.05
                ),
                swayFactor: 0.5 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            };
            
            group.add(leaf);
        }
        
        group.update = (delta) => {
            group.children.forEach(leaf => {
                leaf.position.add(
                    leaf.userData.velocity.clone().multiplyScalar(delta * 60)
                );
                leaf.rotation.x += leaf.userData.rotationSpeed.x * delta * 60;
                leaf.rotation.y += leaf.userData.rotationSpeed.y * delta * 60;
                leaf.rotation.z += leaf.userData.rotationSpeed.z * delta * 60;
                
                // Adicionar balanço
                leaf.position.x += Math.sin(this.time * 2 + leaf.userData.phase) * leaf.userData.swayFactor * delta * 0.01;
                leaf.position.z += Math.cos(this.time * 1.5 + leaf.userData.phase) * leaf.userData.swayFactor * delta * 0.01;
                
                // Resetar folha se cair abaixo
                if (leaf.position.y < 0) {
                    leaf.position.y = area.height + 10;
                    leaf.position.x = (Math.random() - 0.5) * area.width;
                    leaf.position.z = (Math.random() - 0.5) * area.depth;
                }
            });
        };
        
        this.scene.add(group);
        this.effects.push(group);
        return group;
    }
    
    /**
     * Cria reflexos na água
     */
    createWaterReflections(waterObject, resolution = 256) {
        // Criar textura de reflexão
        const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
        
        // Camera de reflexão
        const reflectionCamera = new THREE.PerspectiveCamera();
        reflectionCamera.position.copy(this.camera.position);
        
        // Atualizar reflexão
        const updateReflection = () => {
            // Salvar estado atual do renderer
            const currentRenderTarget = this.sceneManager.getRenderer().getRenderTarget();
            const currentAutoClear = this.sceneManager.getRenderer().autoClear;
            
            // Configurar camera de reflexão
            reflectionCamera.position.copy(this.camera.position);
            reflectionCamera.lookAt(this.camera.getWorldDirection(new THREE.Vector3()).negate());
            
            // Renderizar para o alvo de reflexão
            this.sceneManager.getRenderer().autoClear = false;
            this.sceneManager.getRenderer().setRenderTarget(renderTarget);
            this.sceneManager.getRenderer().render(this.scene, reflectionCamera);
            
            // Restaurar estado
            this.sceneManager.getRenderer().setRenderTarget(currentRenderTarget);
            this.sceneManager.getRenderer().autoClear = currentAutoClear;
        };
        
        // Criar material com reflexão
        const reflectionMaterial = new THREE.MeshStandardMaterial({
            map: renderTarget.texture,
            roughness: 0.05,
            metalness: 0.95,
            color: 0x1E90FF
        });
        
        // Atualizar material da água
        waterObject.children.forEach(child => {
            if (child.type === 'Mesh' && child.material) {
                child.material = reflectionMaterial;
            }
        });
        
        // Adicionar atualização ao loop
        this.sceneManager.addAnimation({
            update: updateReflection
        });
        
        return { renderTarget, reflectionCamera };
    }
    
    /**
     * Cria névoa
     */
    createFog(density = 0.001, color = 0x87CEEB) {
        this.scene.fog = new THREE.FogExp2(color, density);
        this.scene.background = new THREE.Color(color);
        
        return {
            setDensity: (newDensity) => {
                this.scene.fog.density = newDensity;
            },
            setColor: (newColor) => {
                this.scene.fog.color.setHex(newColor);
                this.scene.background.setHex(newColor);
            }
        };
    }
    
    /**
     * Cria chuva
     */
    createRain(density = 0.5, area = { width: 100, height: 50, depth: 100 }) {
        const group = new THREE.Group();
        group.name = 'Rain';
        
        const dropGeometry = new THREE.CylinderGeometry(0.02, 0.01, 0.5, 4);
        const dropMaterial = new THREE.MeshStandardMaterial({
            color: 0x40E0D0,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1
        });
        
        const dropCount = Math.floor(density * 500);
        
        for (let i = 0; i < dropCount; i++) {
            const drop = new THREE.Mesh(dropGeometry, dropMaterial);
            drop.position.set(
                (Math.random() - 0.5) * area.width,
                Math.random() * area.height + 20,
                (Math.random() - 0.5) * area.depth
            );
            
            drop.userData = {
                speed: 0.1 + Math.random() * 0.2,
                length: 0.3 + Math.random() * 0.3
            };
            
            drop.scale.y = drop.userData.length / 0.5;
            
            group.add(drop);
        }
        
        group.update = (delta) => {
            group.children.forEach(drop => {
                drop.position.y -= drop.userData.speed * delta * 60;
                
                // Resetar gota
                if (drop.position.y < 0) {
                    drop.position.y = area.height + 20;
                    drop.position.x = (Math.random() - 0.5) * area.width;
                    drop.position.z = (Math.random() - 0.5) * area.depth;
                }
            });
        };
        
        this.scene.add(group);
        this.effects.push(group);
        return group;
    }
    
    /**
     * Cria raios de sol
     */
    createSunRays(intensity = 0.5, count = 8) {
        const group = new THREE.Group();
        group.name = 'SunRays';
        
        const rayGeometry = new THREE.BoxGeometry(0.1, 0.1, 50);
        const rayMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.1 + intensity * 0.2,
            emissive: 0xFFD700,
            emissiveIntensity: intensity
        });
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.rotation.x = Math.PI / 2;
            ray.rotation.z = angle;
            ray.position.set(
                Math.cos(angle) * 20,
                30,
                Math.sin(angle) * 20
            );
            group.add(ray);
        }
        
        // Luz direcional para simular sol
        const sunLight = new THREE.DirectionalLight(0xFFD700, intensity);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        this.scene.add(sunLight);
        
        group.update = (delta) => {
            const time = this.time * 0.1;
            group.children.forEach((ray, i) => {
                const angle = (i / count) * Math.PI * 2;
                ray.position.set(
                    Math.cos(angle + time * 0.1) * 20,
                    30 + Math.sin(time * 0.5) * 2,
                    Math.sin(angle + time * 0.1) * 20
                );
            });
            
            sunLight.intensity = intensity + Math.sin(time) * intensity * 0.1;
        };
        
        this.scene.add(group);
        this.effects.push(group);
        return { group, light: sunLight };
    }
    
    /**
     * Cria fogo (para lanterns ou fogueiras)
     */
    createFire(position = { x: 0, y: 0, z: 0 }, size = 0.5) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'Fire';
        
        // Partículas de fogo
        const particleCount = 20;
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        
        for (let i = 0; i < particleCount; i++) {
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(
                    1,
                    Math.random() * 0.3 + 0.7,
                    Math.random() * 0.1
                ),
                emissive: new THREE.Color(1, 0.5, 0),
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * size,
                Math.random() * size * 1.5,
                (Math.random() - 0.5) * size
            );
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    0.02 + Math.random() * 0.02,
                    (Math.random() - 0.5) * 0.01
                ),
                life: Math.random() * 0.5 + 0.3,
                maxLife: Math.random() * 0.5 + 0.3,
                scale: 0.05 + Math.random() * 0.1
            };
            
            particle.scale.set(
                particle.userData.scale,
                particle.userData.scale,
                particle.userData.scale
            );
            
            group.add(particle);
        }
        
        // Luz do fogo
        const fireLight = new THREE.PointLight(0xFF4500, 2, 5);
        group.add(fireLight);
        
        group.update = (delta) => {
            group.children.forEach(particle => {
                if (particle.userData.velocity) {
                    particle.position.add(
                        particle.userData.velocity.clone().multiplyScalar(delta * 60)
                    );
                    
                    particle.userData.life -= delta;
                    
                    if (particle.userData.life <= 0) {
                        particle.position.set(
                            (Math.random() - 0.5) * size,
                            0,
                            (Math.random() - 0.5) * size
                        );
                        particle.userData.life = particle.userData.maxLife;
                        particle.userData.velocity = new THREE.Vector3(
                            (Math.random() - 0.5) * 0.01,
                            0.02 + Math.random() * 0.02,
                            (Math.random() - 0.5) * 0.01
                        );
                    }
                    
                    // Animação de cor e opacidade
                    const lifeRatio = particle.userData.life / particle.userData.maxLife;
                    particle.material.color.setRGB(
                        1,
                        lifeRatio * 0.3 + 0.7,
                        lifeRatio * 0.1
                    );
                    particle.material.emissiveIntensity = lifeRatio * 0.5;
                    particle.scale.setScalar(particle.userData.scale * lifeRatio);
                }
            });
            
            // Flicker da luz
            fireLight.intensity = 1.5 + Math.sin(this.time * 10) * 0.5;
        };
        
        this.scene.add(group);
        this.effects.push(group);
        return group;
    }
    
    /**
     * Remove todos os efeitos
     */
    clearAll() {
        this.effects.forEach(effect => {
            if (effect.parent) {
                effect.parent.remove(effect);
            }
        });
        this.effects = [];
    }
}
