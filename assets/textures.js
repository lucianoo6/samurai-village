/**
 * Texturas alternativas para o cenário
 * Gera texturas proceduralmente caso não tenhamos arquivos de imagem
 */

import * as THREE from 'three';

export class ProceduralTextures {
    static createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fundo marrom
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, 0, 256, 256);
        
        // Veios de madeira
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 12 + Math.sin(i) * 5);
            ctx.bezierCurveTo(
                64, i * 12 + Math.sin(i) * 5 + Math.sin(i * 0.5) * 10,
                128, i * 12 + Math.sin(i) * 5 + Math.sin(i * 0.3) * 15,
                256, i * 12 + Math.sin(i) * 5
            );
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    static createStoneTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fundo cinza
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        
        // Manchas de pedra
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = 10 + Math.random() * 30;
            const color = `rgb(${50 + Math.random() * 50}, ${50 + Math.random() * 50}, ${50 + Math.random() * 50})`;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    static createRoofTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fundo preto
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 256, 256);
        
        // Linhas diagonais (telhas)
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 256; i += 10) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(256, i + 50);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    static createGrassTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fundo verde
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 0, 256, 256);
        
        // Fios de grama
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const height = 5 + Math.random() * 10;
            const width = 0.5 + Math.random() * 2;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.sin(i) * width, y - height);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    static createWaterTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Gradiente de azul
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#1E90FF');
        gradient.addColorStop(1, '#0066CC');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Ondulações
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 12);
            ctx.bezierCurveTo(
                64, i * 12 + Math.sin(i) * 5,
                128, i * 12 + Math.sin(i * 0.5) * 10,
                256, i * 12
            );
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
}

// Exportar texturas
window.ProceduralTextures = ProceduralTextures;
