# Vila Samurai - Cenário Three.js para Jogos HD 2D

## 🎮 Visão Geral

Cenário rico em detalhes de uma vila samurai criado com Three.js, projetado para ser usado em jogos HD 2D. Possui um **core reutilizável** que pode ser facilmente integrado em seus projetos.

## 📁 Estrutura do Projeto

```
samurai-village/
├── index.html          # Página principal
├── package.json        # Dependências
├── .gitignore          # Arquivos ignorados
├── README.md           # Documentação
└── js/
    └── main.js         # Código principal
```

## 🚀 Como Usar

### 1. Opção mais simples (sem servidor)
Simplesmente abra o `index.html` em um navegador. O Three.js será carregado via CDN.

### 2. Com servidor local (recomendado)
```bash
# Instale dependências
npm install

# Execute o servidor
npm run dev
# ou
npm start
```

Acesse `http://localhost:8080` no seu navegador.

### 3. Com Python
```bash
python -m http.server 8000
```
Acesse `http://localhost:8000`

## 🎨 O que está incluso

- **Casa Samurai** - Casa tradicional japonesa completa
- **3 Árvores de Sakura** - Cerejeiras com flores animadas
- **Ponte de Madeira** - Ponte tradicional com corrimões
- **Lago com Água Animada** - Ondulações realistas
- **Campo de Grama Animada** - Tufos balançando com o vento
- **Pedras Decorativas**
- **2 Lanterns com Fogo Animado**
- **Nuvens Flutuantes**
- **Poeira no Ar**
- **Folhas Caindo**
- **Botão para Trocar Câmera** (3D ↔ 2D)
- **Contador de FPS e Props**

## 🎯 Controles

- **Mouse**: Rotacionar câmera
- **Scroll**: Zoom
- **Botão "Trocar Câmera"**: Alternar entre câmera 3D e 2D

## 📦 Dependências

- **Three.js** (v0.128.0) - Carregado via CDN

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
