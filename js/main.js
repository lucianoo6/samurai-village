/**
 * Vila Samurai - Cenário Three.js
 * Core reutilizável para jogos HD 2D
 */

import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { PropsFactory } from './PropsFactory.js';
import { NatureEffects } from './NatureEffects.js';

// Estado do jogo
const gameState = {
    loaded: false,
    sceneManager: null,
    propsFactory: null,
    natureEffects: null,
    props: [],
    effects: []
};

// Inicialização
async function init() {
    console.log('Inicializando Vila Samurai...');
    
    // Criar container
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100vh';
    document.body.appendChild(container);
    
    // Criar SceneManager (core reutilizável)
    gameState.sceneManager = new SceneManager(container, {
        backgroundColor: 0x87CEEB,
        cameraType: 'perspective', // Usar perspective para melhor visualização
        cameraZoom: 30
    });
    
    // Criar PropsFactory
    gameState.propsFactory = new PropsFactory(gameState.sceneManager);
    
    // Criar NatureEffects
    gameState.natureEffects = new NatureEffects(gameState.sceneManager);
    
    // Criar cenário
    await createScene();
    
    // Configurar câmera para estilo HD 2D
    setupHDCamera();
    
    // Atualizar UI
    updateUI();
    
    // Esconder loading
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        gameState.loaded = true;
    }, 1000);
    
    console.log('Vila Samurai carregada com sucesso!');
}

// Criar cenário completo
async function createScene() {
    console.log('Criando cenário...');
    
    const scene = gameState.sceneManager.getScene();
    
    // 1. Criar terreno com grama
    const grassField = gameState.propsFactory.createGrassField(
        { x: 0, y: -0.1, z: 0 },
        { width: 100, height: 100 }
    );
    scene.add(grassField);
    gameState.props.push(grassField);
    
    // 2. Criar lago com água animada
    const lake = gameState.propsFactory.createLake(
        { x: 0, y: -0.1, z: -10 },
        { width: 20, height: 20 }
    );
    scene.add(lake);
    gameState.props.push(lake);
    
    // 3. Criar casa samurai
    const house = gameState.propsFactory.createSamuraiHouse(
        { x: -8, y: 0, z: -5 }
    );
    scene.add(house);
    gameState.props.push(house);
    
    // 4. Criar ponte de madeira
    const bridge = gameState.propsFactory.createWoodenBridge(
        { x: 0, y: 0, z: -15 },
        12
    );
    scene.add(bridge);
    gameState.props.push(bridge);
    
    // 5. Criar árvores de sakura
    const tree1 = gameState.propsFactory.createSakuraTree(
        { x: 5, y: 0, z: -8 }
    );
    scene.add(tree1);
    gameState.props.push(tree1);
    
    const tree2 = gameState.propsFactory.createSakuraTree(
        { x: -5, y: 0, z: 5 }
    );
    scene.add(tree2);
    gameState.props.push(tree2);
    
    const tree3 = gameState.propsFactory.createSakuraTree(
        { x: 8, y: 0, z: -15 }
    );
    scene.add(tree3);
    gameState.props.push(tree3);
    
    // 6. Criar pedras decorativas
    const rocks1 = gameState.propsFactory.createRocks(
        { x: 10, y: 0, z: 0 },
        8
    );
    scene.add(rocks1);
    gameState.props.push(rocks1);
    
    const rocks2 = gameState.propsFactory.createRocks(
        { x: -10, y: 0, z: 10 },
        5
    );
    scene.add(rocks2);
    gameState.props.push(rocks2);
    
    // 7. Criar lanterns
    const lantern1 = gameState.propsFactory.createLantern(
        { x: -6, y: 0, z: -8 }
    );
    scene.add(lantern1);
    gameState.props.push(lantern1);
    
    const lantern2 = gameState.propsFactory.createLantern(
        { x: 6, y: 0, z: -8 }
    );
    scene.add(lantern2);
    gameState.props.push(lantern2);
    
    // 8. Criar nuvens
    const clouds = gameState.propsFactory.createClouds(5);
    scene.add(clouds);
    gameState.props.push(clouds);
    
    // 9. Adicionar efeitos naturais
    
    // Poeira flutuante
    const dust = gameState.natureEffects.createDustParticles(30, {
        width: 100,
        height: 20,
        depth: 100
    });
    gameState.effects.push(dust);
    
    // Folhas caindo
    const leaves = gameState.natureEffects.createFallingLeaves(50, {
        width: 100,
        height: 40,
        depth: 100
    });
    gameState.effects.push(leaves);
    
    // Névoa
    gameState.natureEffects.createFog(0.0005, 0x87CEEB);
    
    // Raios de sol
    const sunRays = gameState.natureEffects.createSunRays(0.3, 12);
    gameState.effects.push(sunRays);
    
    // Fogo nas lanterns
    const fire1 = gameState.natureEffects.createFire(
        { x: -6, y: 1, z: -8 },
        0.3
    );
    gameState.effects.push(fire1);
    
    const fire2 = gameState.natureEffects.createFire(
        { x: 6, y: 1, z: -8 },
        0.3
    );
    gameState.effects.push(fire2);
    
    console.log('Cenário criado com', gameState.props.length, 'props e', gameState.effects.length, 'efeitos');
}

// Configurar câmera para estilo HD 2D
function setupHDCamera() {
    const camera = gameState.sceneManager.getCamera();
    const controls = gameState.sceneManager.controls;
    
    // Posicionar câmera para visualização HD 2D
    camera.position.set(0, 25, 30);
    camera.lookAt(0, 0, 0);
    
    // Configurar controls para melhor navegação
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minDistance = 15;
    controls.maxDistance = 60;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Adicionar botão para trocar entre câmeras
    addCameraToggle();
}

// Adicionar botão para trocar câmera
function addCameraToggle() {
    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.padding = '10px 20px';
    btn.style.background = 'rgba(0,0,0,0.7)';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '100';
    btn.textContent = 'Trocar Câmera';
    
    btn.addEventListener('click', () => {
        const sceneManager = gameState.sceneManager;
        const camera = sceneManager.getCamera();
        const options = sceneManager.options;
        
        if (options.cameraType === 'perspective') {
            options.cameraType = 'orthographic';
            btn.textContent = 'Câmera 3D';
        } else {
            options.cameraType = 'perspective';
            btn.textContent = 'Câmera 2D';
        }
        
        // Recriar câmera
        sceneManager.createCamera();
        sceneManager.onResize();
        
        // Posicionar câmera
        camera.position.set(0, 25, 30);
        camera.lookAt(0, 0, 0);
    });
    
    document.body.appendChild(btn);
}

// Atualizar UI
function updateUI() {
    setInterval(() => {
        if (!gameState.loaded) return;
        
        const fpsElement = document.getElementById('fps');
        const propsElement = document.getElementById('props');
        
        // Calcular FPS (simplificado)
        const now = performance.now();
        const delta = now - (window.lastTime || now);
        window.lastTime = now;
        
        if (fpsElement) {
            fpsElement.textContent = `${Math.round(1000 / delta)} FPS`;
        }
        
        if (propsElement) {
            propsElement.textContent = `${gameState.props.length + gameState.effects.length} Props`;
        }
    }, 1000);
}

// Tratamento de erros
window.addEventListener('error', (event) => {
    console.error('Erro:', event.error);
    document.getElementById('loading').innerHTML = `
        <div style="color: red;">
            <h2>Erro ao carregar</h2>
            <p>${event.error.message}</p>
            <p>Verifique o console para mais detalhes</p>
        </div>
    `;
});

// Iniciar quando a página carregar
window.addEventListener('load', init);

// Exportar para uso em outros módulos
window.SamuraiVillage = {
    gameState,
    SceneManager,
    PropsFactory,
    NatureEffects,
    init,
    createScene
};
