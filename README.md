# Vila Samurai - Cenário Three.js para Jogos HD 2D

## 🎮 Visão Geral

Cenário rico em detalhes de uma vila samurai criado com Three.js, projetado para ser usado em jogos HD 2D. Possui um **core reutilizável** que pode ser facilmente integrado em seus projetos.

## 📁 Estrutura do Projeto

```
samurai-village/
├── index.html          # Página principal
├── js/
│   ├── main.js         # Ponto de entrada
│   ├── SceneManager.js  # Gerenciador de cena reutilizável
│   ├── PropsFactory.js # Fábrica de props (casa, árvores, ponte)
│   ├── NatureEffects.js # Efeitos naturais (água, folhas, nuvens)
│   └── HD2DCamera.js   # Câmera especial para HD 2D
├── assets/
│   └── textures.js     # Texturas proceduralmente geradas
├── package.json
└── README.md
```

## 🚀 Como Usar

### 1. Instalação

```bash
# Navegar até o diretório
cd samurai-village

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
npm start
```

Acesse `http://localhost:8080` no seu navegador.

### 2. Integração em Seu Jogo

#### Opção A: Usar como módulo ES6

```javascript
import { SceneManager } from './js/SceneManager.js';
import { PropsFactory } from './js/PropsFactory.js';
import { NatureEffects } from './js/NatureEffects.js';

// Criar gerenciador de cena
const sceneManager = new SceneManager(document.body, {
    cameraType: 'orthographic',
    cameraZoom: 20
});

// Criar fábrica de props
const propsFactory = new PropsFactory(sceneManager);

// Adicionar uma casa samurai
const house = propsFactory.createSamuraiHouse({ x: 0, y: 0, z: 0 });
sceneManager.getScene().add(house);

// Adicionar árvore de sakura
const tree = propsFactory.createSakuraTree({ x: 5, y: 0, z: 5 });
sceneManager.getScene().add(tree);

// Adicionar lago
const lake = propsFactory.createLake({ x: 0, y: 0, z: -10 }, { width: 20, height: 20 });
sceneManager.getScene().add(lake);
```

#### Opção B: Incluir via script tag

```html
<script type="module" src="js/main.js"></script>
```

## 🎨 Props Disponíveis

### Props da Vila
- **SamuraiHouse** - Casa tradicional japonesa
- **SakuraTree** - Cerejeira com flores animadas
- **WoodenBridge** - Ponte de madeira tradicional
- **Lantern** - Lantern com luz e fogo animado
- **Rocks** - Pedras decorativas

### Efeitos Naturais
- **GrassField** - Campo de grama animada
- **Lake** - Lago com água animada
- **Clouds** - Nuvens flutuantes
- **DustParticles** - Poeira flutuante
- **FallingLeaves** - Folhas caindo
- **SunRays** - Raios de sol
- **Fire** - Fogo animado
- **Rain** - Chuva
- **Fog** - Névoa

## 🎬 Câmera HD 2D

```javascript
import { HD2DCamera } from './js/HD2DCamera.js';

const hdCamera = new HD2DCamera(sceneManager, {
    zoom: 1.5,
    near: 0.1,
    far: 1000
});

// Seguir um objeto
hdCamera.follow(playerObject, { x: 0, y: 5, z: 0 });

// Efeito de shake
hdCamera.shake(0.2, 0.5);

// Atualizar câmera no loop principal
hdCamera.update(delta);
```

## 🎛️ Controles

- **Mouse**: Rotacionar câmera
- **Scroll**: Zoom
- **WASD**: Mover câmera (se habilitado)
- **Botão "Trocar Câmera"**: Alternar entre câmera 3D e 2D

## 🛠️ Personalização

### Configurações da Cena

```javascript
const sceneManager = new SceneManager(container, {
    width: 800,
    height: 600,
    backgroundColor: 0x87CEEB, // Céu claro
    cameraType: 'perspective', // ou 'orthographic'
    cameraZoom: 20
});
```

### Cores e Materiais

Todos os props aceitam personalização de cores:

```javascript
// Criar casa com cores personalizadas
const house = propsFactory.createSamuraiHouse({ x: 0, y: 0, z: 0 });
// Modificar materiais
house.children.forEach(child => {
    if (child.material) {
        child.material.color.setHex(0xFF0000);
    }
});
```

## 📦 Dependências

- **Three.js** (v0.160.0 ou superior)

## 🎯 Recursos

- ✅ **Core Reutilizável**: SceneManager pode ser usado em qualquer projeto
- ✅ **Props Detalhados**: Casa, árvores, ponte, lanterns, pedras
- ✅ **Efeitos Naturais**: Água animada, folhas, nuvens, poeira, fogo
- ✅ **Câmera HD 2D**: Suporte especial para jogos 2D com profundidade
- ✅ **Texturas Procedurais**: Funciona sem arquivos de imagem externos
- ✅ **Fácil Integração**: Design modular

## 📝 Notas

### Desempenho

Para melhor desempenho:
- Limite o número de props visíveis
- Use LOD (Level of Detail) para objetos distantes
- Reduza a resolução das sombras se necessário

### Texturas

O sistema usa texturas proceduralmente geradas por padrão. Para usar texturas reais:
1. Adicione imagens na pasta `assets/`
2. Modifique `PropsFactory.js` para carregar suas texturas

### Compatibilidade

Testado em navegadores modernos (Chrome, Firefox, Edge, Safari).

## 🤝 Contribuindo

Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novos props
- Melhorar os efeitos

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos!

---

**Criado com Three.js e muito carinho!** 🎌
