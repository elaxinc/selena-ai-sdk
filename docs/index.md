---
layout: home

hero:
  name: Selena AI SDK
  text: Integração moderna com IA
  tagline: SDK JavaScript elegante e poderoso para conversar com a Selena AI
  image:
    src: /logo.svg
    alt: Selena AI
  actions:
    - theme: brand
      text: Começar
      link: /guide/installation
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/elaxinc/selena-ai-sdk

features:
  - icon: ⚡
    title: Zero Dependências
    details: Sem axios, sem bundles pesados. Apenas JavaScript moderno com fetch nativo do Node.js.
  - icon: 🎯
    title: Logging Configurável
    details: Controle total sobre logs com níveis debug, info, error ou completamente desativado.
  - icon: 🖥️
    title: CLI Poderosa
    details: Interface de linha de comando interativa para conversas rápidas e produtivas.
  - icon: 📚
    title: Documentação Completa
    details: Site bonito com VitePress, exemplos práticos e guias detalhados.
  - icon: 🔧
    title: TypeScript Ready
    details: Types incluídos via JSDoc para excelente developer experience e autocomplete.
  - icon: 🚀
    title: Performance
    details: HTTP client nativo com fetch, timeouts automáticos e tratamento robusto de erros.
---

## 🌟 Por que Selena AI SDK?

O Selena AI SDK foi projetado para ser **simples, elegante e poderoso**. 

Com uma API intuitiva inspirada nos melhores SDKs do mercado, ele permite que você integre a Selena AI em seus projetos JavaScript/Node.js com apenas algumas linhas de código.

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug' // 'none' para desativar
});

const response = await client.chat.completions({
  model: 'selena-pro-v1',
  message: 'Olá, mundo!'
});

console.log(response.response);
```

<div class="custom-card">

### 🎨 Design Elegante

- **API Intuitiva**: Métodos claros e nomes descritivos
- **Consistente**: Segue padrões estabelecidos pelo ecossistema JavaScript
- **Type Safety**: Autocomplete completo com JSDoc
- **Error Handling**: Classes de erro específicas para diferentes cenários

</div>

<div class="custom-card">

### 🛡️ Seguro e Robusto

- **Gerenciamento Seguro**: API keys tratadas com segurança
- **Timeout Automático**: Proteção contra requests infinitas
- **Retry Inteligente**: Tratamento automático de erros de rede
- **Validação**: Validação rigorosa de parâmetros de entrada

</div>

## 🚀 Começo Rápido

### 1. Instalação

<div class="badge badge-primary">npm</div>
<div class="badge badge-primary">yarn</div>
<div class="badge badge-primary">pnpm</div>

```bash
# Com npm
npm install selena-ai-sdk

# Com yarn
yarn add selena-ai-sdk

# Global para CLI
npm install -g selena-ai-sdk
```

### 2. Configuração

```bash
# Definir API key
export SELENA_API_KEY=sua_chave_aqui
```

### 3. Usar no Código

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

const response = await client.chat.completions({
  model: 'selena-pro-v1',
  message: 'Explique machine learning em termos simples'
});
```

### 4. CLI Interativa

```bash
# Chat interativo
selena chat --verbose

# Uma pergunta rápida
selena ask "Qual a capital da França?"

# Configuração
selena config
```

## 🎯 Características Principais

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 2rem 0;">

<div class="custom-card">

#### 🎨 **Design Elegante**
API moderna e intuitiva inspirada nos melhores SDKs do mercado

</div>

<div class="custom-card">

#### 🔐 **Seguro**
Gerenciamento seguro de API keys e validação rigorosa

</div>

<div class="custom-card">

#### 📝 **Logs Detalhados**
Debug completo de requests/responses com níveis configuráveis

</div>

<div class="custom-card">

#### 🖥️ **CLI Completa**
Chat interativo no terminal com comandos especiais

</div>

<div class="custom-card">

#### 📖 **Documentação Linda**
Site com VitePress, gradientes animados e exemplos práticos

</div>

<div class="custom-card">

#### ⚡ **Performance Zero**
Sem dependências de runtime, apenas fetch nativo do Node.js

</div>

</div>

## 🔄 Comparação

| Característica | Selena AI SDK | Outros SDKs |
|---------------|----------------|-------------|
| **Dependências** | ✅ Zero | ❌ axios, node-fetch |
| **Logging** | ✅ Configurável | ⚠️ Limitado |
| **CLI** | ✅ Inclusa | ❌ Separada |
| **Documentação** | ✅ VitePress | ⚠️ Básica |
| **TypeScript** | ✅ JSDoc | ⚠️ Requer setup |
| **Performance** | ✅ Fetch nativo | ❌ Overhead |

<div class="alert alert-info">

**💡 Dica:** O Selena AI SDK foi construído pensando na experiência do desenvolvedor. Cada detalhe, desde os nomes dos métodos até as mensagens de erro, foi cuidadosamente projetado para ser claro e útil.

</div>

---

## 🚀 Pronto para começar?

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;">

<a href="/guide/installation" class="VPButton brand">Instalar Agora</a>
<a href="/examples/usage" class="VPButton alt">Ver Exemplos</a>
<a href="https://github.com/elaxinc/selena-ai-sdk" class="VPButton alt">GitHub</a>

</div>

<div class="custom-card" style="text-align: center; margin-top: 3rem;">

**Feito com ❤️ pela equipe Elaxi**  
[Documentação da API](https://elaxi.xyz/docs) • [Dashboard](https://elaxi.xyz/dashboard) • [Support](https://github.com/elaxinc/selena-ai-sdk/issues)

</div>