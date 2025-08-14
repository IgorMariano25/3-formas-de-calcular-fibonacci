# 📊 Análise e Complexidade de Algoritmos - Fibonacci

Uma aplicação web interativa em tempo real para comparar a performance de diferentes algoritmos de cálculo da sequência de Fibonacci, desenvolvida com TypeScript, Node.js, WebSocket e Chart.js.

![Fibonacci Analysis](https://img.shields.io/badge/Fibonacci-Analysis-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=white)

## 🎯 Visão Geral

Este projeto implementa e compara três diferentes algoritmos para calcular números de Fibonacci:

1. **Recursão Simples** - Abordagem intuitiva mas ineficiente
2. **Memoização** - Programação dinâmica com cache
3. **Matriz** - Exponenciação rápida de matrizes

A aplicação mostra em tempo real como cada algoritmo se comporta conforme o valor de `n` aumenta, permitindo visualizar claramente as diferenças de complexidade temporal entre eles.

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/IgorMariano25/3-formas-de-calcular-fibonacci
   cd Analise-e-complexidade-de-algoritmos
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   Abra seu navegador e vá para `http://localhost:3000`

### Scripts Disponíveis

- `npm run dev` - Compila TypeScript e inicia o servidor
- `npm run build` - Compila o projeto TypeScript
- `npm start` - Executa diretamente com ts-node

## 📈 Algoritmos Implementados

### 1. 🔴 Recursão Simples

```typescript
function fibonacciRecursive(n: number): bigint {
    if (n <= 1) {
        return BigInt(n);
    }
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
```

**Complexidade:** O(2^n) - Exponencial

**Explicação:**
- Implementação direta da definição matemática
- Cada chamada gera duas novas chamadas recursivas
- Recalcula os mesmos valores múltiplas vezes
- **Problema:** Cresce exponencialmente, tornando-se impraticável para n > 40

**Por que é ineficiente?**
Para calcular `fib(5)`, o algoritmo faz:
```
fib(5) = fib(4) + fib(3)
fib(4) = fib(3) + fib(2)  |  fib(3) = fib(2) + fib(1)
...
```
Note que `fib(3)` é calculado múltiplas vezes!

### 2. 🔵 Memoização (Programação Dinâmica)

```typescript
function fibonacciMemoization(n: number): bigint {
    const memo = new Map<number, bigint>();
    function fib(num: number): bigint {
        if (memo.has(num)) {
            return memo.get(num)!;
        }
        if (num <= 1) {
            return BigInt(num);
        }
        const result = fib(num - 1) + fib(num - 2);
        memo.set(num, result);
        return result;
    }
    return fib(n);
}
```

**Complexidade:** O(n) - Linear

**Explicação:**
- Usa um cache (Map) para armazenar resultados já calculados
- Cada valor é calculado apenas uma vez
- Evita recálculos desnecessários da recursão simples
- **Vantagem:** Mantém a legibilidade da recursão com performance linear

**Como funciona o cache?**
1. Antes de calcular, verifica se o valor já está no cache
2. Se estiver, retorna imediatamente
3. Se não estiver, calcula, armazena no cache e retorna

### 3. 🟢 Exponenciação de Matriz

```typescript
function fibonacciMatrix(n: number): bigint {
    // Usa a propriedade matemática:
    // [F(n+1)]   [1 1]^n   [1]
    // [F(n)  ] = [1 0]   * [0]
    
    // Implementa exponenciação rápida da matriz
    // usando algoritmo de exponenciação binária
}
```

**Complexidade:** O(log n) - Logarítmica

**Explicação:**
- Baseado na propriedade matemática de que Fibonacci pode ser expresso como potência de matriz
- Usa exponenciação rápida (exponenciação binária)
- **Mais eficiente** para valores muito grandes de n
- Complexidade logarítmica é a melhor possível para este problema

**Fundamento matemático:**
```
[F(n+1)]   [1 1]^n   [1]
[F(n)  ] = [1 0]   * [0]
```

A exponenciação rápida calcula `M^n` em O(log n) operações dividindo o expoente pela metade a cada iteração.

## 📊 Análise de Performance

### Comparação de Complexidades

| Algoritmo | Complexidade | n=10 | n=20 | n=30 | n=40 | n=50+ |
|-----------|--------------|------|------|------|------|-------|
| Recursivo | O(2^n) | ~0.01ms | ~1ms | ~100ms | ~10s | ❌ Impraticável |
| Memoização | O(n) | ~0.001ms | ~0.002ms | ~0.003ms | ~0.004ms | ✅ Rápido |
| Matriz | O(log n) | ~0.001ms | ~0.001ms | ~0.001ms | ~0.001ms | ✅ Muito Rápido |

### Observações Práticas

- **n ≤ 30**: Todos os algoritmos são utilizáveis
- **30 < n ≤ 40**: Recursão começa a ficar lenta
- **n > 40**: Apenas memoização e matriz são práticos
- **n > 100**: Matriz se torna notavelmente superior

## 🎨 Interface

### Funcionalidades da UI

- **📈 Gráfico em Tempo Real**: Visualização da performance conforme os cálculos são executados
- **🌙☀️ Modo Escuro/Claro**: Toggle entre temas para melhor experiência
- **📱 Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **📊 Estatísticas Live**: 
  - Valor atual de N sendo calculado
  - Método mais rápido para cada N
  - Status da conexão WebSocket

### Tecnologias da Interface

- **Chart.js**: Gráficos interativos e responsivos
- **CSS3**: Gradientes, glassmorphism, animações suaves
- **WebSocket**: Comunicação em tempo real
- **LocalStorage**: Persistência de preferências do usuário

## 🏗️ Arquitetura

```
├── fibonacci.ts      # Implementações dos algoritmos
├── server.ts         # Servidor Express + WebSocket
├── index.ts          # Ponto de entrada
├── public/
│   ├── index.html    # Interface web
│   ├── styles.css    # Estilos e temas
│   └── client.js     # Lógica frontend + Chart.js
└── package.json      # Dependências e scripts
```

### Fluxo de Dados

1. **Servidor** executa os algoritmos sequencialmente
2. **WebSocket** envia resultados em tempo real
3. **Frontend** recebe dados e atualiza o gráfico
4. **Chart.js** renderiza as comparações visualmente

## 🔧 Tecnologias Utilizadas

### Backend
- **TypeScript**: Tipagem estática e melhor DX
- **Node.js**: Runtime JavaScript
- **Express**: Servidor web minimalista
- **WebSocket (ws)**: Comunicação bidirecional em tempo real

### Frontend
- **Chart.js**: Biblioteca de gráficos responsivos
- **HTML5/CSS3**: Interface moderna com glassmorphism
- **Vanilla JavaScript**: Lógica do cliente sem frameworks

### Desenvolvimento
- **TypeScript Compiler**: Transpilação para JavaScript
- **ES Modules**: Sistema de módulos moderno

## 📚 Conceitos de Algoritmos Demonstrados

### 1. **Análise de Complexidade**
- Comparação prática entre O(2^n), O(n) e O(log n)
- Visualização do crescimento de funções

### 2. **Programação Dinâmica**
- Memoização como técnica de otimização
- Trade-off entre memória e tempo

### 3. **Matemática Computacional**
- Propriedades da sequência de Fibonacci
- Exponenciação rápida de matrizes

### 4. **Otimização de Algoritmos**
- Como diferentes abordagens impactam a performance
- Quando usar cada técnica

## 🎓 Objetivos Educacionais

Este projeto demonstra:

- **Importância da escolha de algoritmos** para problemas reais
- **Visualização prática** de complexidades temporais
- **Técnicas de otimização** como memoização e exponenciação rápida
- **Desenvolvimento full-stack** com TypeScript
- **Comunicação em tempo real** com WebSockets

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

*Desenvolvido para fins educacionais em Análise e Complexidade de Algoritmos* 🎓
