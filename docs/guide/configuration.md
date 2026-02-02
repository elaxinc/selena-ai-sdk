# Configuração

Guia completo de configuração e opções avançadas do Selena AI SDK.

## 🔧 Opções de Configuração

### Configuração Básica

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: 'sua-api-key-aqui',
  baseURL: 'https://elaxi.xyz',
  logging: 'info'
});
```

### Parâmetros Completos

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|---------|-----------|
| `apiKey` | string | - | **Obrigatório**. Sua API key da Selena AI |
| `baseURL` | string | `https://elaxi.xyz` | URL base da API |
| `logging` | string | `none` | Nível de log: `none`, `error`, `info`, `debug` |

## 📝 Níveis de Logging

### `none` (Padrão)
Nenhum log será exibido. Ideal para produção.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});
```

### `error`
Apenas erros serão exibidos.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'error'
});
```

### `info`
Informações básicas de operação.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

// Output:
// [2024-01-31T10:00:00.000Z] [Selena INFO] Creating chat completion { model: 'selena-pro-v1', messageLength: 25 }
// [2024-01-31T10:00:01.500Z] [Selena INFO] Chat completion created successfully
```

### `debug`
Logs completos incluindo requests e responses.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug'
});

// Output:
// [2024-01-31T10:00:00.000Z] [Selena DEBUG] → POST https://elaxi.xyz/api/chat
// [2024-01-31T10:00:00.001Z] [Selena DEBUG] Body: { model: 'selena-pro-v1', message: 'Hello world' }
// [2024-01-31T10:00:01.200Z] [Selena DEBUG] ← 200 (1199ms)
// [2024-01-31T10:00:01.201Z] [Selena DEBUG] Response: { response: 'Hello! How can I help you today?' }
```

## 🔄 Mudando Configurações

### Mudar Logging em Runtime

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

// Ativar debug temporariamente
client.setLogLevel('debug');

// Fazer request com debug
await client.chat.completions({
  message: 'Test message'
});

// Voltar para produção
client.setLogLevel('error');
```

### Configuração Dinâmica

```js
import { SelenaAI } from 'selena-ai-sdk';

function createClient(environment = 'development') {
  const config = {
    apiKey: process.env.SELENA_API_KEY,
    logging: 'none'
  };
  
  switch (environment) {
    case 'development':
      config.logging = 'debug';
      break;
    case 'staging':
      config.logging = 'info';
      break;
    case 'production':
      config.logging = 'error';
      break;
  }
  
  return new SelenaAI(config);
}

const devClient = createClient('development');
const prodClient = createClient('production');
```

## 🌐 Configurações de Rede

### Proxy

O SDK respeita as variáveis de ambiente padrão de proxy:

```bash
# HTTP Proxy
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=https://proxy.example.com:8080

# Ignorar proxy para certos hosts
export NO_PROXY=localhost,127.0.0.1
```

### Timeout Customizado

O timeout padrão é 30 segundos. Para mudar, você precisará interceptar o request:

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

// Request com timeout customizado
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s

try {
  const response = await client.chat.completions({
    message: 'Long request...',
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  console.log(response.response);
} catch (error) {
  clearTimeout(timeoutId);
  
  if (error.name === 'AbortError') {
    console.log('Request timeout');
  }
}
```

### Custom Base URL

Para ambientes customizados ou staging:

```js
import { SelenaAI } from 'selena-ai-sdk';

// Produção
const prodClient = new SelenaAI({
  apiKey: process.env.PROD_API_KEY,
  baseURL: 'https://elaxi.xyz'
});

// Staging
const stagingClient = new SelenaAI({
  apiKey: process.env.STAGING_API_KEY,
  baseURL: 'https://staging.elaxi.xyz'
});

// Local
const localClient = new SelenaAI({
  apiKey: process.env.LOCAL_API_KEY,
  baseURL: 'http://localhost:3000'
});
```

## 🔐 Segurança

### Variáveis de Ambiente

Nunca hardcode sua API key:

```js
// ❌ RUIM
const client = new SelenaAI({
  apiKey: 'sk-1234567890abcdef' // Exposta no código!
});

// ✅ BOM
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});
```

### Arquivo .env

Use um arquivo `.env` para desenvolvimento:

```bash
# .env
SELENA_API_KEY=sk-your-api-key-here
SELENA_BASE_URL=https://elaxi.xyz
SELENA_LOG_LEVEL=debug
```

```js
// Carregar variáveis com dotenv
import dotenv from 'dotenv';
dotenv.config();

import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  baseURL: process.env.SELENA_BASE_URL,
  logging: process.env.SELENA_LOG_LEVEL
});
```

## 🧪 Ambiente de Teste

### Mock Responses

Para testes unitários, você pode mockar o HTTP client:

```js
import { SelenaAI } from 'selena-ai-sdk';

// Mock do HTTP client
const mockHttpClient = jest.fn().mockResolvedValue({
  response: 'Mock response'
});

// Criar cliente com mock
const client = new SelenaAI({
  apiKey: 'test-key',
  logging: 'none'
});

// Substituir o HTTP client
client.http = mockHttpClient;

// Testar
const response = await client.chat.completions({
  message: 'Test'
});

expect(response.response).toBe('Mock response');
```

### Test Environment

```js
import { SelenaAI } from 'selena-ai-sdk';

const isTest = process.env.NODE_ENV === 'test';

const client = new SelenaAI({
  apiKey: isTest ? 'test-api-key' : process.env.SELENA_API_KEY,
  baseURL: isTest ? 'http://localhost:3001' : 'https://elaxi.xyz',
  logging: isTest ? 'none' : 'info'
});
```

## 🏗️ Configuração de Frameworks

### Express.js

```js
import express from 'express';
import { SelenaAI } from 'selena-ai-sdk';

const app = express();
app.use(express.json());

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await client.chat.completions({
      message
    });
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000);
```

### Fastify

```js
import Fastify from 'fastify';
import { SelenaAI } from 'selena-ai-sdk';

const app = Fastify({ logger: true });
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

app.post('/chat', async (request, reply) => {
  try {
    const { message } = request.body;
    
    const response = await client.chat.completions({
      message
    });
    
    return reply.send(response);
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

app.listen({ port: 3000 });
```

## 📊 Monitoramento

### Metrics e Health Checks

```js
import { SelenaAI } from 'selena-ai-sdk';

class MonitoredSelenaClient {
  constructor(options) {
    this.client = new SelenaAI(options);
    this.metrics = {
      requests: 0,
      errors: 0,
      totalTime: 0
    };
  }
  
  async chatCompletion(params) {
    const startTime = Date.now();
    this.metrics.requests++;
    
    try {
      const response = await this.client.chat.completions(params);
      
      this.metrics.totalTime += Date.now() - startTime;
      return response;
      
    } catch (error) {
      this.metrics.errors++;
      this.metrics.totalTime += Date.now() - startTime;
      throw error;
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      averageTime: this.metrics.requests > 0 
        ? this.metrics.totalTime / this.metrics.requests 
        : 0
    };
  }
}

const monitoredClient = new MonitoredSelenaClient({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});
```

## ✅ Checklist de Configuração

- [ ] API key configurada via variável de ambiente
- [ ] Logging apropriado para cada ambiente
- [ ] Timeout configurado se necessário
- [ ] Proxy configurado em ambientes corporativos
- [ ] Tratamento de erros implementado
- [ ] Variáveis de teste configuradas
- [ ] Monitoramento e métricas configuradas

---

🎯 **Pronto!** Você configurou o Selena AI SDK para produção. Continue para [CLI Guide](/guide/cli) ou [API Reference](/api/client).