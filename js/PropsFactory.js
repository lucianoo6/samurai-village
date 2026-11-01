/**
 * PropsFactory - Fábrica de props para a vila samurai
 * Cria elementos reutilizáveis com detalhes ricos
 */

import * as THREE from 'three';

export class PropsFactory {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.textures = {};
        this.materials = {};
        this.loadTextures();
    }
    
    async loadTextures() {
        // Texturas básicas
        const textureLoader = new THREE.TextureLoader();
        
        // Madeira
        this.textures.wood = textureLoader.load('/workspace/samurai-village/assets/wood.jpg');
        this.textures.wood.wrapS = THREE.RepeatWrapping;
        this.textures.wood.wrapT = THREE.RepeatWrapping;
        
        // Pedra
        this.textures.stone = textureLoader.load('/workspace/samurai-village/assets/stone.jpg');
        this.textures.stone.wrapS = THREE.RepeatWrapping;
        this.textures.stone.wrapT = THREE.RepeatWrapping;
        
        // Telhado
        this.textures.roof = textureLoader.load('/workspace/samurai-village/assets/roof.jpg');
        this.textures.roof.wrapS = THREE.RepeatWrapping;
        this.textures.roof.wrapT = THREE.RepeatWrapping;
        
        // Grama
        this.textures.grass = textureLoader.load('/workspace/samurai-village/assets/grass.jpg');
        this.textures.grass.wrapS = THREE.RepeatWrapping;
        this.textures.grass.wrapT = THREE.RepeatWrapping;
        
        // Água
        this.textures.water = textureLoader.load('/workspace/samurai-village/assets/water.jpg');
        this.textures.water.wrapS = THREE.RepeatWrapping;
        this.textures.water.wrapT = THREE.RepeatWrapping;
        
        // Criar materiais
        this.materials.wood = new THREE.MeshStandardMaterial({
            map: this.textures.wood,
            roughness: 0.7,
            metalness: 0.1
        });
        
        this.materials.stone = new THREE.MeshStandardMaterial({
            map: this.textures.stone,
            roughness: 0.9,
            metalness: 0.05
        });
        
        this.materials.roof = new THREE.MeshStandardMaterial({
            map: this.textures.roof,
            roughness: 0.8,
            metalness: 0.1
        });
        
        this.materials.grass = new THREE.MeshStandardMaterial({
            map: this.textures.grass,
            roughness: 1.0,
            metalness: 0
        });
        
        this.materials.water = new THREE.MeshStandardMaterial({
            map: this.textures.water,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.9,
            color: 0x1E90FF
        });
    }
    
    /**
     * Cria uma casa tradicional japonesa
     */
    createSamuraiHouse(position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'SamuraiHouse';
        
        // Base da casa (plataforma de madeira)
        const baseGeometry = new THREE.BoxGeometry(8, 0.5, 6);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);
        
        // Paredes
        const wallGeometry = new THREE.BoxGeometry(7, 3, 0.3);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5DEB3,
            roughness: 0.6
        });
        
        // Parede frontal
        const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
        frontWall.position.set(0, 2, 2.85);
        frontWall.castShadow = true;
        group.add(frontWall);
        
        // Parede traseira
        const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
        backWall.position.set(0, 2, -2.85);
        backWall.castShadow = true;
        group.add(backWall);
        
        // Parede esquerda
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-3.85, 2, 0);
        leftWall.castShadow = true;
        group.add(leftWall);
        
        // Parede direita
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.rotation.y = Math.PI / 2;
        rightWall.position.set(3.85, 2, 0);
        rightWall.castShadow = true;
        group.add(rightWall);
        
        // Telhado (estilo tradicional)
        const roofGroup = new THREE.Group();
        
        // Parte inferior do telhado
        const roofBottomGeometry = new THREE.BoxGeometry(8.5, 0.3, 6.5);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.5
        });
        const roofBottom = new THREE.Mesh(roofBottomGeometry, roofMaterial);
        roofBottom.position.y = 4.5;
        roofBottom.castShadow = true;
        roofGroup.add(roofBottom);
        
        // Parte superior do telhado (curvada)
        const roofTopGeometry = new THREE.ConeGeometry(5, 2, 4);
        roofTopGeometry.rotateX(Math.PI / 2);
        const roofTop = new THREE.Mesh(roofTopGeometry, roofMaterial);
        roofTop.position.set(0, 5.5, 0);
        roofTop.castShadow = true;
        roofGroup.add(roofTop);
        
        group.add(roofGroup);
        
        // Porta
        const doorGeometry = new THREE.BoxGeometry(1.5, 2, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.4
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.5, 3);
        door.castShadow = true;
        group.add(door);
        
        // Janelas
        const windowGeometry = new THREE.BoxGeometry(1, 1, 0.1);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1
        });
        
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(2.5, 2, 3);
        group.add(window1);
        
        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(-2.5, 2, 3);
        group.add(window2);
        
        // Detalhes decorativos
        this.addWoodenDetails(group);
        
        return group;
    }
    
    /**
     * Adiciona detalhes de madeira à casa
     */
    addWoodenDetails(group) {
        const detailGeometry = new THREE.BoxGeometry(0.2, 0.2, 7);
        const detailMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.5
        });
        
        // Vigias do telhado
        for (let i = 0; i < 4; i++) {
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            detail.rotation.x = Math.PI / 4;
            detail.position.set(
                (i % 2 === 0 ? -3 : 3) + (i === 0 || i === 3 ? 1 : -1),
                4.5,
                i < 2 ? 3 : -3
            );
            group.add(detail);
        }
    }
    
    /**
     * Cria uma árvore de sakura (cerejeira)
     */
    createSakuraTree(position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'SakuraTree';
        
        // Tronco
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.3, 5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2.5;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        group.add(trunk);
        
        // Ramos
        const branchGeometry = new THREE.CylinderGeometry(0.1, 0.05, 2, 6);
        const branchMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.6
        });
        
        // Ramos principais
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 2;
            const branch = new THREE.Mesh(branchGeometry, branchMaterial);
            branch.rotation.x = Math.PI / 4;
            branch.rotation.z = angle;
            branch.position.set(
                Math.cos(angle) * radius,
                3.5 + Math.sin(angle) * 0.5,
                Math.sin(angle) * radius
            );
            branch.castShadow = true;
            group.add(branch);
        }
        
        // Flores de sakura (partículas)
        this.createSakuraFlowers(group);
        
        return group;
    }
    
    /**
     * Cria flores de sakura animadas
     */
    createSakuraFlowers(parent) {
        const flowerGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFB6C1,
            transparent: true,
            opacity: 0.9,
            roughness: 0.3
        });
        
        // Criar 30 flores
        for (let i = 0; i < 30; i++) {
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            const height = 2 + Math.random() * 4;
            
            flower.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            // Animação
            flower.userData = {
                baseY: height,
                amplitude: 0.1 + Math.random() * 0.2,
                speed: 0.5 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            };
            
            parent.add(flower);
        }
        
        // Adicionar animação
        parent.update = (delta) => {
            parent.children.forEach(child => {
                if (child.userData.baseY !== undefined) {
                    child.position.y = child.userData.baseY + 
                        Math.sin(Date.now() * child.userData.speed + child.userData.phase) * 
                        child.userData.amplitude;
                }
            });
        };
    }
    
    /**
     * Cria uma ponte de madeira tradicional
     */
    createWoodenBridge(position = { x: 0, y: 0, z: 0 }, length = 10) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'WoodenBridge';
        
        // Plataforma da ponte
        const platformGeometry = new THREE.BoxGeometry(length, 0.3, 2);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.6
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.castShadow = true;
        platform.receiveShadow = true;
        group.add(platform);
        
        // Corrimões
        const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const railMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.5
        });
        
        // Corrimão esquerdo
        for (let i = 0; i <= 10; i++) {
            const rail = new THREE.Mesh(railGeometry, railMaterial);
            rail.position.set(
                -length / 2 + (i / 10) * length,
                0.6,
                -1
            );
            rail.castShadow = true;
            group.add(rail);
        }
        
        // Corrimão direito
        for (let i = 0; i <= 10; i++) {
            const rail = new THREE.Mesh(railGeometry, railMaterial);
            rail.position.set(
                -length / 2 + (i / 10) * length,
                0.6,
                1
            );
            rail.castShadow = true;
            group.add(rail);
        }
        
        // Suporte das laterais
        const supportGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        for (let i = 0; i <= 5; i++) {
            const supportLeft = new THREE.Mesh(supportGeometry, platformMaterial);
            supportLeft.position.set(
                -length / 2 + (i / 5) * length,
                0.1,
                -1.1
            );
            supportLeft.castShadow = true;
            group.add(supportLeft);
            
            const supportRight = new THREE.Mesh(supportGeometry, platformMaterial);
            supportRight.position.set(
                -length / 2 + (i / 5) * length,
                0.1,
                1.1
            );
            supportRight.castShadow = true;
            group.add(supportRight);
        }
        
        return group;
    }
    
    /**
     * Cria um lago com água animada
     */
    createLake(position = { x: 0, y: 0, z: 0 }, size = { width: 15, height: 15 }) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'Lake';
        
        // Base do lago (fundo)
        const bottomGeometry = new THREE.PlaneGeometry(size.width, size.height, 32, 32);
        const bottomMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E3A8A,
            roughness: 1.0,
            metalness: 0.1
        });
        const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottom.rotation.x = -Math.PI / 2;
        bottom.position.y = -0.1;
        bottom.receiveShadow = true;
        group.add(bottom);
        
        // Superfície da água
        const waterGeometry = new THREE.PlaneGeometry(size.width * 0.9, size.height * 0.9, 64, 64);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.7,
            roughness: 0.05,
            metalness: 0.9,
            envMapIntensity: 0.5
        });
        
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0.01;
        water.receiveShadow = false;
        group.add(water);
        
        // Animação da água
        const originalPositions = [];
        const vertices = waterGeometry.attributes.position;
        
        for (let i = 0; i < vertices.count; i++) {
            originalPositions.push({
                x: vertices.getX(i),
                y: vertices.getY(i),
                z: vertices.getZ(i)
            });
        }
        
        water.userData = {
            originalPositions,
            time: 0,
            waveSpeed: 0.5,
            waveScale: 0.02
        };
        
        group.update = (delta) => {
            water.userData.time += delta * water.userData.waveSpeed;
            const vertices = water.geometry.attributes.position;
            
            for (let i = 0; i < vertices.count; i++) {
                const x = water.userData.originalPositions[i].x;
                const z = water.userData.originalPositions[i].z;
                const distance = Math.sqrt(x * x + z * z);
                
                vertices.setY(i, water.userData.originalPositions[i].y + 
                    Math.sin(x * 0.1 + water.userData.time) * 0.01 +
                    Math.sin(z * 0.1 + water.userData.time * 1.3) * 0.01 +
                    Math.sin(distance * 0.2 + water.userData.time * 0.7) * water.userData.waveScale
                );
            }
            
            vertices.needsUpdate = true;
            water.geometry.computeVertexNormals();
        };
        
        return group;
    }
    
    /**
     * Cria pedras decorativas
     */
    createRocks(position = { x: 0, y: 0, z: 0 }, count = 5) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'Rocks';
        
        const rockGeometry = new THREE.DodecahedronGeometry(0.5, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9,
            metalness: 0.05
        });
        
        for (let i = 0; i < count; i++) {
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 4,
                Math.random() * 0.5,
                (Math.random() - 0.5) * 4
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rock.scale.set(
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5
            );
            rock.castShadow = true;
            rock.receiveShadow = true;
            group.add(rock);
        }
        
        return group;
    }
    
    /**
     * Cria nuvens animadas
     */
    createClouds(count = 3) {
        const group = new THREE.Group();
        group.name = 'Clouds';
        
        const cloudGeometry = new THREE.SphereGeometry(1, 16, 16);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.6,
            roughness: 1.0
        });
        
        for (let i = 0; i < count; i++) {
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 100,
                20 + Math.random() * 10,
                (Math.random() - 0.5) * 100
            );
            cloud.scale.set(
                2 + Math.random() * 3,
                1 + Math.random() * 1,
                2 + Math.random() * 3
            );
            
            cloud.userData = {
                speed: 0.01 + Math.random() * 0.02,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize()
            };
            
            group.add(cloud);
        }
        
        group.update = (delta) => {
            group.children.forEach(cloud => {
                cloud.position.add(
                    cloud.userData.direction.clone().multiplyScalar(
                        delta * cloud.userData.speed * 60
                    )
                );
                
                // Resetar nuvem se sair da área visível
                if (cloud.position.x < -60 || cloud.position.x > 60 ||
                    cloud.position.z < -60 || cloud.position.z > 60) {
                    cloud.position.set(
                        cloud.position.x < -60 ? -60 : (cloud.position.x > 60 ? 60 : cloud.position.x),
                        cloud.position.y,
                        cloud.position.z < -60 ? -60 : (cloud.position.z > 60 ? 60 : cloud.position.z)
                    );
                    cloud.userData.direction.multiplyScalar(-1);
                }
            });
        };
        
        return group;
    }
    
    /**
     * Cria grama animada
     */
    createGrassField(position = { x: 0, y: 0, z: 0 }, size = { width: 50, height: 50 }) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'GrassField';
        
        // Terreno base
        const terrainGeometry = new THREE.PlaneGeometry(size.width, size.height, 64, 64);
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 1.0,
            metalness: 0
        });
        
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        group.add(terrain);
        
        // Grama em tufts (tufos)
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.5, 4);
        grassGeometry.rotateX(Math.PI);
        
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,
            roughness: 0.8,
            metalness: 0
        });
        
        // Criar grama em grade
        const grassCount = 200;
        for (let i = 0; i < grassCount; i++) {
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.set(
                (Math.random() - 0.5) * size.width,
                0.25,
                (Math.random() - 0.5) * size.height
            );
            grass.scale.set(
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4
            );
            
            grass.userData = {
                baseScale: grass.scale.y,
                windFactor: 0.1 + Math.random() * 0.2,
                phase: Math.random() * Math.PI * 2
            };
            
            grass.castShadow = true;
            group.add(grass);
        }
        
        group.update = (delta) => {
            group.children.forEach(child => {
                if (child.userData.baseScale !== undefined) {
                    child.scale.y = child.userData.baseScale + 
                        Math.sin(Date.now() * 0.001 + child.userData.phase) * 
                        child.userData.windFactor * 0.1;
                    child.rotation.z = Math.sin(Date.now() * 0.001 + child.userData.phase) * 0.1;
                }
            });
        };
        
        return group;
    }
    
    /**
     * Cria um lantern tradicional
     */
    createLantern(position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.name = 'Lantern';
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 8);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.castShadow = true;
        group.add(base);
        
        // Corpo
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF4500,
            roughness: 0.5,
            emissive: 0xFF8C00,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);
        
        // Teto
        const roofGeometry = new THREE.ConeGeometry(0.5, 0.3, 8);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.6
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.8;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        // Luz
        const light = new THREE.PointLight(0xFF8C00, 1, 5);
        light.position.y = 1;
        group.add(light);
        
        // Animação de flicker
        group.update = (delta) => {
            light.intensity = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
            body.material.emissiveIntensity = 0.2 + Math.sin(Date.now() * 0.01) * 0.1;
        };
        
        return group;
    }
}
