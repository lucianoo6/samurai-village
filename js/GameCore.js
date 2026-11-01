/**
 * GameCore - Core principal do jogo
 * Gerencia o loop do jogo, estados e integração com o cenário
 */

import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { PropsFactory } from './PropsFactory.js';
import { NatureEffects } from './NatureEffects.js';
import { HD2DCamera } from './HD2DCamera.js';
import { Utils } from './Utils.js';

export class GameCore {
    constructor(container = document.body, options = {}) {
        this.container = container;
        this.options = {
            gameTitle: 'Vila Samurai',
            targetFPS: 60,
            enablePhysics: false,
            enableAudio: true,
            debug: false,
            ...options
        };
        
        // Componentes principais
        this.sceneManager = null;
        this.propsFactory = null;
        this.natureEffects = null;
        this.hdCamera = null;
        
        // Estado do jogo
        this.state = {
            currentScene: null,
            scenes: {},
            isPaused: false,
            isLoaded: false,
            deltaTime: 0,
            totalTime: 0,
            fps: 0
        };
        
        // Input
        this.input = {
            keys: {},
            mouse: { x: 0, y: 0, down: false },
            touch: {}
        };
        
        // Eventos
        this.events = {
            onLoad: [],
            onUpdate: [],
            onRender: [],
            onResize: []
        };
        
        this.init();
    }
    
    init() {
        console.log(`Inicializando ${this.options.gameTitle}...`);
        
        // Criar SceneManager
        this.sceneManager = new SceneManager(this.container, {
            backgroundColor: this.options.backgroundColor || 0x87CEEB,
            cameraType: this.options.cameraType || 'perspective'
        });
        
        // Criar componentes
        this.propsFactory = new PropsFactory(this.sceneManager);
        this.natureEffects = new NatureEffects(this.sceneManager);
        
        // Configurar câmera HD 2D
        if (this.options.enableHD2DCamera) {
            this.hdCamera = new HD2DCamera(this.sceneManager);
        }
        
        // Configurar input
        this.setupInput();
        
        // Configurar loop do jogo
        this.setupGameLoop();
        
        // Configurar resize
        this.setupResize();
        
        // Disparar evento de carregamento
        this.triggerEvent('onLoad');
    }
    
    setupInput() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.input.keys[e.code] = true;
            if (this.options.debug) {
                console.log(`Tecla pressionada: ${e.code}`);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.input.keys[e.code] = false;
        });
        
        // Mouse
        this.container.addEventListener('mousemove', (e) => {
            this.input.mouse.x = e.clientX;
            this.input.mouse.y = e.clientY;
        });
        
        this.container.addEventListener('mousedown', (e) => {
            this.input.mouse.down = true;
        });
        
        this.container.addEventListener('mouseup', (e) => {
            this.input.mouse.down = false;
        });
        
        // Touch
        this.container.addEventListener('touchstart', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                this.input.touch[touch.identifier] = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
        });
        
        this.container.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (this.input.touch[touch.identifier]) {
                    this.input.touch[touch.identifier].x = touch.clientX;
                    this.input.touch[touch.identifier].y = touch.clientY;
                }
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                delete this.input.touch[touch.identifier];
            }
        });
    }
    
    setupGameLoop() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fpsUpdateTime = lastTime;
        
        const gameLoop = (currentTime) => {
            // Calcular delta time
            this.state.deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            // Atualizar FPS
            frameCount++;
            if (currentTime - fpsUpdateTime >= 1000) {
                this.state.fps = frameCount;
                frameCount = 0;
                fpsUpdateTime = currentTime;
            }
            
            // Atualizar tempo total
            this.state.totalTime += this.state.deltaTime;
            
            // Atualizar game core
            this.update(this.state.deltaTime);
            
            // Renderizar
            this.render();
            
            // Continuar loop
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            this.onResize();
            this.triggerEvent('onResize');
        });
    }
    
    onResize() {
        if (this.sceneManager) {
            this.sceneManager.onResize();
        }
        
        if (this.hdCamera) {
            this.hdCamera.updateProjection();
        }
    }
    
    update(delta) {
        if (this.state.isPaused) return;
        
        // Atualizar SceneManager
        if (this.sceneManager) {
            this.sceneManager.controls.update();
        }
        
        // Atualizar câmera HD 2D
        if (this.hdCamera) {
            this.hdCamera.update(delta);
        }
        
        // Atualizar efeitos naturais
        if (this.natureEffects) {
            this.natureEffects.update(delta);
        }
        
        // Disparar eventos de atualização
        this.triggerEvent('onUpdate', delta);
        
        // Atualizar cena atual
        if (this.state.currentScene && this.state.currentScene.update) {
            this.state.currentScene.update(delta);
        }
    }
    
    render() {
        // Renderizar cena
        if (this.sceneManager) {
            this.sceneManager.renderer.render(
                this.sceneManager.getScene(),
                this.hdCamera ? this.hdCamera.getCamera() : this.sceneManager.getCamera()
            );
        }
        
        // Disparar eventos de render
        this.triggerEvent('onRender');
    }
    
    // Gerenciamento de cenas
    addScene(name, scene) {
        this.state.scenes[name] = scene;
        scene.gameCore = this;
    }
    
    loadScene(name) {
        if (!this.state.scenes[name]) {
            console.error(`Cena "${name}" não encontrada`);
            return false;
        }
        
        // Descarregar cena atual
        if (this.state.currentScene && this.state.currentScene.unload) {
            this.state.currentScene.unload();
        }
        
        // Carregar nova cena
        this.state.currentScene = this.state.scenes[name];
        
        if (this.state.currentScene.load) {
            this.state.currentScene.load();
        }
        
        console.log(`Cena "${name}" carregada`);
        return true;
    }
    
    getCurrentScene() {
        return this.state.currentScene;
    }
    
    // Gerenciamento de objetos
    addProp(prop, sceneName = null) {
        if (sceneName) {
            const scene = this.state.scenes[sceneName];
            if (scene && scene.addProp) {
                scene.addProp(prop);
            }
        } else if (this.state.currentScene && this.state.currentScene.addProp) {
            this.state.currentScene.addProp(prop);
        } else {
            this.sceneManager.getScene().add(prop);
        }
        
        return prop;
    }
    
    removeProp(prop, sceneName = null) {
        if (sceneName) {
            const scene = this.state.scenes[sceneName];
            if (scene && scene.removeProp) {
                scene.removeProp(prop);
            }
        } else if (this.state.currentScene && this.state.currentScene.removeProp) {
            this.state.currentScene.removeProp(prop);
        } else {
            this.sceneManager.getScene().remove(prop);
        }
    }
    
    // Controle do jogo
    pause() {
        this.state.isPaused = true;
        console.log('Jogo pausado');
    }
    
    resume() {
        this.state.isPaused = false;
        console.log('Jogo retomado');
    }
    
    togglePause() {
        this.state.isPaused = !this.state.isPaused;
        console.log(this.state.isPaused ? 'Jogo pausado' : 'Jogo retomado');
    }
    
    // Eventos
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    off(eventName, callback) {
        if (this.events[eventName]) {
            const index = this.events[eventName].indexOf(callback);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    }
    
    triggerEvent(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback(...args);
            });
        }
    }
    
    // Utilitários
    getSceneManager() {
        return this.sceneManager;
    }
    
    getPropsFactory() {
        return this.propsFactory;
    }
    
    getNatureEffects() {
        return this.natureEffects;
    }
    
    getHDCamera() {
        return this.hdCamera;
    }
    
    getInput() {
        return this.input;
    }
    
    getState() {
        return this.state;
    }
    
    // Limpeza
    dispose() {
        console.log('Limpando GameCore...');
        
        // Remover event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('resize', this.handleResize);
        
        // Disparar cena atual
        if (this.state.currentScene && this.state.currentScene.unload) {
            this.state.currentScene.unload();
        }
        
        // Limpar SceneManager
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        
        // Limpar componentes
        this.sceneManager = null;
        this.propsFactory = null;
        this.natureEffects = null;
        this.hdCamera = null;
        
        console.log('GameCore limpo');
    }
}

// Exportar
window.GameCore = GameCore;
