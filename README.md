# Selena AI SDK

> SDK JavaScript moderno e elegante para integração com a Selena AI

[![npm version](https://badge.fury.io/js/selena-ai-sdk.svg)](https://badge.fury.io/js/selena-ai-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## ✨ Características

- 🎯 **Simples e Elegante** - API intuitiva e fácil de usar
- ⚡ **Zero Dependências** - Sem axios, apenas fetch nativo
- 📝 **Logging Configurável** - Controle total sobre debug logs
- 🖥️ **CLI Completa** - Chat interativo no terminal
- 🚀 **Streaming em Tempo Real** - Respostas com efeito de digitação
- 📚 **Documentação Linda** - Site com VitePress e gradientes
- 🔧 **TypeScript Ready** - Types via JSDoc
- ⚡ **Performance** - HTTP client nativo com timeout e retry

## 🚀 Instalação

```bash
# Com npm
npm install selena-ai-sdk

# Com yarn
yarn add selena-ai-sdk

# Global para CLI
npm install -g selena-ai-sdk
```

## 🔑 Configuração

1. Obtenha sua API key em [elaxi.xyz/dashboard](https://elaxi.xyz/dashboard)
2. Configure a variável de ambiente:

```bash
export SELENA_API_KEY=sua_chave_aqui
```

## 💻 Uso Básico

```javascript
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug' // 'none' para desativar logs
});

async function chat() {
  const response = await client.chat.completions({
    model: 'selena-pro-v1',
    message: 'Olá! Me apresente-se.'
  });
  
  console.log('Resposta:', response.response);
}

chat().catch(console.error);
```

## 🚀 Streaming

Responda com streaming em tempo real:

```javascript
// Streaming com callback
await client.chat.completions({
  model: 'selena-pro-v1',
  message: 'Me explique sobre IA',
  stream: true,
  onToken: (token) => {
    process.stdout.write(token); // Cada token aparece em tempo real
  }
});
```

## 🖥️ CLI

### Chat Interativo

```bash
# Iniciar chat interativo
selena chat

# Com streaming (resposta em tempo real)
selena chat --stream

# Com logs detalhados
selena chat --verbose

# Sem logs
selena chat --quiet
```

### Pergunta Única

```bash
# Pergunta normal
selena ask "Qual a capital da França?"

# Com streaming (resposta em tempo real)
selena ask "Me conte uma história" --stream
```

## 📖 Documentação

Visite [selena-ai-sdk-docs](https://elaxiinc.github.io/selena-ai-sdk/) para documentação completa.

## 🔧 Opções de Configuração

```javascript
const client = new SelenaAI({
  apiKey: 'sua-chave-aqui',
  baseURL: 'https://elaxi.xyz',  // Custom base URL
  logging: 'info'               // 'none', 'error', 'info', 'debug'
});
```

## 📝 Níveis de Log

- `none` - Sem logs
- `error` - Apenas erros
- `info` - Informações básicas
- `debug` - Logs completos de request/response

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork este repositório
2. Crie uma feature branch
3. Faça commit das suas mudanças
4. Push para o branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links

- [Documentação](https://elaxiinc.github.io/selena-ai-sdk/)
- [API Selena](https://elaxi.xyz/docs)
- [Issues](https://github.com/elaxiinc/selena-ai-sdk/issues)
- [Dashboard](https://elaxi.xyz/dashboard)

---

Feito com ❤️ pela equipe Elaxi