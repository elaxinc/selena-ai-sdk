# Instalação

Guia completo de instalação do Selena AI SDK para diferentes ambientes e configurações.

## 📦 Requisitos

- **Node.js** >= 18.0.0
- **npm**, **yarn** ou **pnpm** para gerenciamento de pacotes
- **API Key** da Selena AI (obtenha em [elaxi.xyz/dashboard](https://elaxi.xyz/dashboard))

## 🚀 Instalação

### Com npm

```bash
# Instalar para seu projeto
npm install selena-ai-sdk

# Instalar globalmente para CLI
npm install -g selena-ai-sdk
```

### Com yarn

```bash
# Instalar para seu projeto
yarn add selena-ai-sdk

# Instalar globalmente para CLI
yarn global add selena-ai-sdk
```

### Com pnpm

```bash
# Instalar para seu projeto
pnpm add selena-ai-sdk

# Instalar globalmente para CLI
pnpm add -g selena-ai-sdk
```

## 🔧 Configuração

### 1. Obter API Key

1. Acesse [elaxi.xyz/dashboard](https://elaxi.xyz/dashboard)
2. Faça login ou crie uma conta
3. Copie sua API key

### 2. Configurar Variável de Ambiente

```bash
# No terminal (temporário)
export SELENA_API_KEY=sua_chave_aqui

# Adicionar ao ~/.bashrc (permanente)
echo 'export SELENA_API_KEY=sua_chave_aqui' >> ~/.bashrc
source ~/.bashrc

# Adicionar ao ~/.zshrc (para Zsh)
echo 'export SELENA_API_KEY=sua_chave_aqui' >> ~/.zshrc
source ~/.zshrc
```

### 3. Variáveis de Ambiente Opcionais

```bash
# Configurar proxy (se necessário)
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080

# Configurar timeout customizado (em milissegundos)
export SELENA_TIMEOUT=60000
```

## 🏗️ Configuração do Projeto

### ES Modules (Recomendado)

O Selena AI SDK usa ES Modules por padrão. Certifique-se de que seu projeto suporta ESM:

```json
// package.json
{
  "type": "module"
}
```

### TypeScript

O SDK funciona perfeitamente com TypeScript através de JSDoc:

```ts
// app.ts
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug'
});

// Autocomplete e type safety funcionarão!
const response = await client.chat.completions({
  model: 'selena-pro-v1',
  message: 'Hello!'
});
```

## 🧪 Verificação da Instalação

### 1. Testar o SDK

Crie um arquivo `test.js`:

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

console.log('Cliente criado:', client.getInfo());
```

Execute:
```bash
node test.js
```

### 2. Testar a CLI

```bash
# Verificar instalação
selena --version

# Testar comando de ajuda
selena --help

# Testar configuração
selena config
```

## 🔄 Ambientes Específicos

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV SELENA_API_KEY=your_api_key_here

CMD ["node", "your-app.js"]
```

### Serverless Functions

```js
// AWS Lambda, Vercel, Netlify, etc.
import { SelenaAI } from 'selena-ai-sdk';

export default async function handler(req, res) {
  const client = new SelenaAI({
    apiKey: process.env.SELENA_API_KEY,
    logging: 'none' // Desativar logs em produção
  });

  const response = await client.chat.completions({
    model: 'selena-pro-v1',
    message: 'Hello from serverless!'
  });

  return res.json(response);
}
```

### Browser

O SDK funciona em ambientes browser com bundlers:

```js
// Com Vite, Webpack, etc.
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: 'your-client-side-key', // ATENÇÃO: nunca exponha keys server-side
  baseURL: 'https://cors-proxy.example.com' // Se necessário
});
```

## 🚨 Solução de Problemas

### Erros Comuns

#### 1. "API key não encontrada"

```bash
# Verificar se a variável está definida
echo $SELENA_API_KEY

# Se estiver vazia, defina novamente
export SELENA_API_KEY=sua_chave_correta
```

#### 2. "Unsupported module resolution"

```json
// Adicionar ao package.json
{
  "type": "module"
}
```

#### 3. "Cannot find module 'selena-ai-sdk'"

```bash
# Reinstalar dependências
npm install

# Limpar cache se necessário
npm cache clean --force
```

#### 4. Problemas com permissão (CLI)

```bash
# Tornar executável (Linux/Mac)
chmod +x node_modules/.bin/selena

# Ou usar npx
npx selena --help
```

### Debug Mode

Ative logs detalhados para diagnóstico:

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug' // Mostrará todos os requests/responses
});
```

### Logs da CLI

```bash
# Com logs verbosos
selena chat --verbose

# Com logs silenciados
selena chat --quiet
```

## ✅ Checklist de Instalação

- [ ] Node.js >= 18.0.0 instalado
- [ ] Selena AI SDK instalado via npm/yarn/pnpm
- [ ] API Key obtida do dashboard
- [ ] Variável de ambiente configurada
- [ ] Projeto com `"type": "module"` (se ESM)
- [ ] Teste básico funcionando
- [ ] CLI funcionando (se instalado globalmente)

---

🎉 **Parabéns!** Você instalou o Selena AI SDK com sucesso. Continue para [Começo Rápido](/guide/quick-start).