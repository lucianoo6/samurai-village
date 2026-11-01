/**
 * Vila Samurai - Main Script
 * Core reutilizável para jogos HD 2D
 * Usa THREE global (carregado via CDN no HTML)
 */

// Usar THREE global
const THREE = window.THREE;

// Variáveis globais
let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let props = [];
let cameraType = 'perspective';

// Inicialização
function init() {
    // Criar container
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    document.body.insertBefore(container, document.body.firstChild);

    // Criar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Criar cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Criar câmera
    createCamera();

    // Criar controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 10;
    controls.maxDistance = 50;

    // Configurar luzes
    setupLights();

    // Criar cenário
    createScene();

    // Configurar resize
    window.addEventListener('resize', onResize);

    // Configurar botão de câmera
    document.getElementById('camera-btn').addEventListener('click', toggleCamera);

    // Esconder loading
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);

    // Iniciar animação
    animate();
}

function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    
    if (cameraType === 'perspective') {
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    } else {
        const frustumSize = 30 * 2;
        camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
    }
    
    camera.position.set(0, 25, 30);
    camera.lookAt(0, 0, 0);
}

function setupLights() {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

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
    scene.add(directionalLight);

    // Luz de hemisfério
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3d5c3d, 0.3);
    hemisphereLight.position.set(0, 100, 0);
    scene.add(hemisphereLight);
}

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    
    if (cameraType === 'orthographic') {
        const aspect = width / height;
        const frustumSize = 30 * 2;
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
    } else {
        camera.aspect = width / height;
    }
    
    camera.updateProjectionMatrix();
}

function toggleCamera() {
    cameraType = cameraType === 'perspective' ? 'orthographic' : 'perspective';
    createCamera();
    onResize();
    camera.position.set(0, 25, 30);
    camera.lookAt(0, 0, 0);
    controls.object = camera;
    
    const btn = document.getElementById('camera-btn');
    btn.textContent = cameraType === 'perspective' ? 'Câmera 2D' : 'Câmera 3D';
}

// ============================================
// FÁBRICA DE PROPS
// ============================================

function createMaterial(color, roughness = 0.5, metalness = 0) {
    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: metalness
    });
}

function createSamuraiHouse(position = { x: 0, y: 0, z: 0 }) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'SamuraiHouse';

    // Base da casa
    const baseGeometry = new THREE.BoxGeometry(8, 0.5, 6);
    const base = new THREE.Mesh(baseGeometry, createMaterial(0x8B4513, 0.7));
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Paredes
    const wallGeometry = new THREE.BoxGeometry(7, 3, 0.3);
    const wallMaterial = createMaterial(0xF5DEB3, 0.6);

    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 2, 2.85);
    frontWall.castShadow = true;
    group.add(frontWall);

    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 2, -2.85);
    backWall.castShadow = true;
    group.add(backWall);

    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.85, 2, 0);
    leftWall.castShadow = true;
    group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.set(3.85, 2, 0);
    rightWall.castShadow = true;
    group.add(rightWall);

    // Telhado
    const roofGroup = new THREE.Group();
    const roofBottomGeometry = new THREE.BoxGeometry(8.5, 0.3, 6.5);
    const roofMaterial = createMaterial(0x333333, 0.5);
    const roofBottom = new THREE.Mesh(roofBottomGeometry, roofMaterial);
    roofBottom.position.y = 4.5;
    roofBottom.castShadow = true;
    roofGroup.add(roofBottom);

    const roofTopGeometry = new THREE.ConeGeometry(5, 2, 4);
    roofTopGeometry.rotateX(Math.PI / 2);
    const roofTop = new THREE.Mesh(roofTopGeometry, roofMaterial);
    roofTop.position.set(0, 5.5, 0);
    roofTop.castShadow = true;
    roofGroup.add(roofTop);
    group.add(roofGroup);

    // Porta
    const doorGeometry = new THREE.BoxGeometry(1.5, 2, 0.2);
    const door = new THREE.Mesh(doorGeometry, createMaterial(0x654321, 0.4));
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

    scene.add(group);
    props.push(group);
    return group;
}

function createSakuraTree(position = { x: 0, y: 0, z: 0 }) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'SakuraTree';

    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.3, 5, 8);
    const trunk = new THREE.Mesh(trunkGeometry, createMaterial(0x8B4513, 0.7));
    trunk.position.y = 2.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Ramos
    const branchGeometry = new THREE.CylinderGeometry(0.1, 0.05, 2, 6);
    const branchMaterial = createMaterial(0x654321, 0.6);
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

    // Flores de sakura
    const flowerGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const flowerMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFB6C1,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3
    });
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
        flower.userData = {
            baseY: height,
            amplitude: 0.1 + Math.random() * 0.2,
            speed: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        };
        group.add(flower);
    }

    scene.add(group);
    props.push(group);
    return group;
}

function createWoodenBridge(position = { x: 0, y: 0, z: 0 }, length = 10) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'WoodenBridge';

    const platformGeometry = new THREE.BoxGeometry(length, 0.3, 2);
    const platform = new THREE.Mesh(platformGeometry, createMaterial(0x8B4513, 0.6));
    platform.castShadow = true;
    platform.receiveShadow = true;
    group.add(platform);

    const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const railMaterial = createMaterial(0x654321, 0.5);
    for (let i = 0; i <= 10; i++) {
        const railLeft = new THREE.Mesh(railGeometry, railMaterial);
        railLeft.position.set(
            -length / 2 + (i / 10) * length,
            0.6,
            -1
        );
        group.add(railLeft);
        const railRight = new THREE.Mesh(railGeometry, railMaterial);
        railRight.position.set(
            -length / 2 + (i / 10) * length,
            0.6,
            1
        );
        group.add(railRight);
    }

    const supportGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    for (let i = 0; i <= 5; i++) {
        const supportLeft = new THREE.Mesh(supportGeometry, createMaterial(0x8B4513, 0.6));
        supportLeft.position.set(
            -length / 2 + (i / 5) * length,
            0.1,
            -1.1
        );
        group.add(supportLeft);
        const supportRight = new THREE.Mesh(supportGeometry, createMaterial(0x8B4513, 0.6));
        supportRight.position.set(
            -length / 2 + (i / 5) * length,
            0.1,
            1.1
        );
        group.add(supportRight);
    }

    scene.add(group);
    props.push(group);
    return group;
}

function createLake(position = { x: 0, y: 0, z: 0 }, size = { width: 15, height: 15 }) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'Lake';

    const bottomGeometry = new THREE.PlaneGeometry(size.width, size.height, 32, 32);
    const bottom = new THREE.Mesh(bottomGeometry, createMaterial(0x1E3A8A, 1.0, 0.1));
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.1;
    bottom.receiveShadow = true;
    group.add(bottom);

    const waterGeometry = new THREE.PlaneGeometry(size.width * 0.9, size.height * 0.9, 64, 64);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x1E90FF,
        transparent: true,
        opacity: 0.7,
        roughness: 0.05,
        metalness: 0.9
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.01;
    group.add(water);

    const originalPositions = [];
    const vertices = waterGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
        originalPositions.push({
            x: vertices.getX(i),
            y: vertices.getY(i),
            z: vertices.getZ(i)
        });
    }
    water.userData = { originalPositions, time: 0 };

    scene.add(group);
    props.push(group);
    return group;
}

function createRocks(position = { x: 0, y: 0, z: 0 }, count = 5) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'Rocks';

    const rockGeometry = new THREE.DodecahedronGeometry(0.5, 0);
    const rockMaterial = createMaterial(0x808080, 0.9, 0.05);

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

    scene.add(group);
    props.push(group);
    return group;
}

function createLantern(position = { x: 0, y: 0, z: 0 }) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'Lantern';

    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 8);
    const base = new THREE.Mesh(baseGeometry, createMaterial(0x333333, 0.7));
    base.castShadow = true;
    group.add(base);

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

    const roofGeometry = new THREE.ConeGeometry(0.5, 0.3, 8);
    const roof = new THREE.Mesh(roofGeometry, createMaterial(0x333333, 0.6));
    roof.position.y = 1.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    const light = new THREE.PointLight(0xFF8C00, 1, 5);
    light.position.y = 1;
    group.add(light);

    group.userData = { light };

    scene.add(group);
    props.push(group);
    return group;
}

function createClouds(count = 3) {
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

    scene.add(group);
    props.push(group);
    return group;
}

function createGrassField(position = { x: 0, y: 0, z: 0 }, size = { width: 50, height: 50 }) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'GrassField';

    const terrainGeometry = new THREE.PlaneGeometry(size.width, size.height, 64, 64);
    const terrain = new THREE.Mesh(terrainGeometry, createMaterial(0x228B22, 1.0, 0));
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    group.add(terrain);

    const grassGeometry = new THREE.ConeGeometry(0.1, 0.5, 4);
    grassGeometry.rotateX(Math.PI);
    const grassMaterial = createMaterial(0x2E8B57, 0.8, 0);

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

    scene.add(group);
    props.push(group);
    return group;
}

function createDustParticles(count = 20) {
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
            (Math.random() - 0.5) * 100,
            Math.random() * 20,
            (Math.random() - 0.5) * 100
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

    scene.add(group);
    props.push(group);
    return group;
}

function createFallingLeaves(count = 30) {
    const group = new THREE.Group();
    group.name = 'FallingLeaves';

    const leafGeometry = new THREE.BoxGeometry(0.3, 0.01, 0.15);
    const leafColors = [0xFF6347, 0xFFA07A, 0xFFD700, 0xFF8C00, 0xFF4500];

    for (let i = 0; i < count; i++) {
        const leaf = new THREE.Mesh(leafGeometry, new THREE.MeshStandardMaterial({
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            transparent: true,
            opacity: 0.9
        }));
        leaf.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 40 + 10,
            (Math.random() - 0.5) * 100
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

    scene.add(group);
    props.push(group);
    return group;
}

function createFire(position = { x: 0, y: 0, z: 0 }, size = 0.5) {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.name = 'Fire';
    group.userData = { size: size };

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

    const fireLight = new THREE.PointLight(0xFF4500, 2, 5);
    group.add(fireLight);
    group.userData.fireLight = fireLight;

    scene.add(group);
    props.push(group);
    return group;
}

// ============================================
// CRIAÇÃO DO CENÁRIO
// ============================================

function createScene() {
    createGrassField({ x: 0, y: -0.1, z: 0 }, { width: 100, height: 100 });
    createLake({ x: 0, y: -0.1, z: -10 }, { width: 20, height: 20 });
    createSamuraiHouse({ x: -8, y: 0, z: -5 });
    createWoodenBridge({ x: 0, y: 0, z: -15 }, 12);
    createSakuraTree({ x: 5, y: 0, z: -8 });
    createSakuraTree({ x: -5, y: 0, z: 5 });
    createSakuraTree({ x: 8, y: 0, z: -15 });
    createRocks({ x: 10, y: 0, z: 0 }, 8);
    createRocks({ x: -10, y: 0, z: 10 }, 5);
    createLantern({ x: -6, y: 0, z: -8 });
    createLantern({ x: 6, y: 0, z: -8 });
    createClouds(5);
    createDustParticles(30);
    createFallingLeaves(50);
    createFire({ x: -6, y: 1, z: -8 }, 0.3);
    createFire({ x: 6, y: 1, z: -8 }, 0.3);
}

// ============================================
// ANIMAÇÃO
// ============================================

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    controls.update();

    // Animar água
    scene.children.forEach(obj => {
        if (obj.name === 'Lake') {
            obj.children.forEach(child => {
                if (child.type === 'Mesh' && child.userData.originalPositions) {
                    child.userData.time += delta * 0.5;
                    const vertices = child.geometry.attributes.position;
                    for (let i = 0; i < vertices.count; i++) {
                        const x = child.userData.originalPositions[i].x;
                        const z = child.userData.originalPositions[i].z;
                        const distance = Math.sqrt(x * x + z * z);
                        vertices.setY(i, child.userData.originalPositions[i].y +
                            Math.sin(x * 0.1 + child.userData.time) * 0.01 +
                            Math.sin(z * 0.1 + child.userData.time * 1.3) * 0.01 +
                            Math.sin(distance * 0.2 + child.userData.time * 0.7) * 0.02
                        );
                    }
                    vertices.needsUpdate = true;
                    child.geometry.computeVertexNormals();
                }
            });
        }
    });

    // Animar flores de sakura
    scene.children.forEach(obj => {
        if (obj.name === 'SakuraTree') {
            obj.children.forEach(child => {
                if (child.userData.baseY !== undefined) {
                    child.position.y = child.userData.baseY +
                        Math.sin(Date.now() * child.userData.speed + child.userData.phase) *
                        child.userData.amplitude;
                }
            });
        }
    });

    // Animar grama
    scene.children.forEach(obj => {
        if (obj.name === 'GrassField') {
            obj.children.forEach(child => {
                if (child.userData.baseScale !== undefined) {
                    child.scale.y = child.userData.baseScale +
                        Math.sin(Date.now() * 0.001 + child.userData.phase) *
                        child.userData.windFactor * 0.1;
                    child.rotation.z = Math.sin(Date.now() * 0.001 + child.userData.phase) * 0.1;
                }
            });
        }
    });

    // Animar nuvens
    scene.children.forEach(obj => {
        if (obj.name === 'Clouds') {
            obj.children.forEach(cloud => {
                cloud.position.add(
                    cloud.userData.direction.clone().multiplyScalar(delta * 60 * cloud.userData.speed)
                );
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
        }
    });

    // Animar poeira
    scene.children.forEach(obj => {
        if (obj.name === 'DustParticles') {
            obj.children.forEach(particle => {
                particle.position.add(
                    particle.userData.velocity.clone().multiplyScalar(delta * 60)
                );
                particle.rotation.x += particle.userData.rotationSpeed.x * delta * 60;
                particle.rotation.y += particle.userData.rotationSpeed.y * delta * 60;
                particle.rotation.z += particle.userData.rotationSpeed.z * delta * 60;
                if (particle.position.y > 20) {
                    particle.position.y = 0;
                    particle.position.x = (Math.random() - 0.5) * 100;
                    particle.position.z = (Math.random() - 0.5) * 100;
                }
            });
        }
    });

    // Animar folhas caindo
    scene.children.forEach(obj => {
        if (obj.name === 'FallingLeaves') {
            obj.children.forEach(leaf => {
                leaf.position.add(
                    leaf.userData.velocity.clone().multiplyScalar(delta * 60)
                );
                leaf.rotation.x += leaf.userData.rotationSpeed.x * delta * 60;
                leaf.rotation.y += leaf.userData.rotationSpeed.y * delta * 60;
                leaf.rotation.z += leaf.userData.rotationSpeed.z * delta * 60;
                leaf.position.x += Math.sin(Date.now() * 0.002 + leaf.userData.phase) * leaf.userData.swayFactor * delta * 0.1;
                leaf.position.z += Math.cos(Date.now() * 0.0015 + leaf.userData.phase) * leaf.userData.swayFactor * delta * 0.1;
                if (leaf.position.y < 0) {
                    leaf.position.y = 40 + Math.random() * 10;
                    leaf.position.x = (Math.random() - 0.5) * 100;
                    leaf.position.z = (Math.random() - 0.5) * 100;
                }
            });
        }
    });

    // Animar fogo
    scene.children.forEach(obj => {
        if (obj.name === 'Fire') {
            obj.children.forEach(particle => {
                if (particle.userData.velocity) {
                    particle.position.add(
                        particle.userData.velocity.clone().multiplyScalar(delta * 60)
                    );
                    particle.userData.life -= delta;
                    if (particle.userData.life <= 0) {
                        particle.position.set(
                            (Math.random() - 0.5) * obj.userData.size,
                            0,
                            (Math.random() - 0.5) * obj.userData.size
                        );
                        particle.userData.life = particle.userData.maxLife;
                        particle.userData.velocity = new THREE.Vector3(
                            (Math.random() - 0.5) * 0.01,
                            0.02 + Math.random() * 0.02,
                            (Math.random() - 0.5) * 0.01
                        );
                    }
                    const lifeRatio = particle.userData.life / particle.userData.maxLife;
                    particle.material.color.setRGB(1, lifeRatio * 0.3 + 0.7, lifeRatio * 0.1);
                    particle.material.emissiveIntensity = lifeRatio * 0.5;
                    particle.scale.setScalar(particle.userData.scale * lifeRatio);
                }
            });
            if (obj.userData.fireLight) {
                obj.userData.fireLight.intensity = 1.5 + Math.sin(Date.now() * 0.01) * 0.5;
            }
        }
    });

    updateFPS();
    renderer.render(scene, camera);
}

function updateFPS() {
    const now = performance.now();
    const delta = now - (window.lastTime || now);
    window.lastTime = now;
    const fps = Math.round(1000 / delta);
    const propsCount = props.length;
    document.getElementById('fps').textContent = `${fps} FPS`;
    document.getElementById('props').textContent = `${propsCount} Props`;
}

// Iniciar quando a página carregar
window.addEventListener('load', init);
