# Client API

Referência completa da classe principal do Selena AI SDK.

## 📋 SelenaAI

Classe principal para interagir com a Selena AI.

### Construtor

```js
const client = new SelenaAI(options)
```

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `options` | Object | Sim | Objeto de configuração |
| `options.apiKey` | string | Sim | Sua API key da Selena AI |
| `options.baseURL` | string | Não | URL base da API (padrão: `https://elaxi.xyz`) |
| `options.logging` | string | Não | Nível de log: `none`, `error`, `info`, `debug` (padrão: `none`) |

**Exemplos:**

```js
import { SelenaAI } from 'selena-ai-sdk';

// Configuração básica
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

// Configuração completa
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  baseURL: 'https://elaxi.xyz',
  logging: 'debug'
});

// Ambiente de desenvolvimento
const devClient = new SelenaAI({
  apiKey: 'dev-api-key',
  logging: 'debug'
});

// Ambiente de produção
const prodClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'error'
});
```

### Propriedades

#### `apiKey` (readonly)
Sua API key configurada.

```js
console.log(client.apiKey); // 'sk-1234567890'
```

#### `baseURL` (readonly)
URL base configurada para a API.

```js
console.log(client.baseURL); // 'https://elaxi.xyz'
```

#### `chat` (readonly)
Instância da API de Chat.

```js
await client.chat.completions({
  message: 'Hello!'
});
```

#### `logger` (private)
Instância do logger configurada.

### Métodos

#### `setLogLevel(level)`

Muda o nível de logging em runtime.

**Parâmetros:**
- `level` (string): Novo nível de log (`none`, `error`, `info`, `debug`)

**Retorno:** `void`

**Exemplo:**

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

// Ativar debug temporariamente
client.setLogLevel('debug');

// Fazer request com logs detalhados
await client.chat.completions({
  message: 'Test message'
});

// Voltar para silencioso
client.setLogLevel('none');
```

#### `getInfo()`

Obtém informações sobre a configuração atual do cliente.

**Retorno:** Object
- `baseURL` (string): URL base configurada
- `logLevel` (string): Nível de log atual
- `version` (string): Versão do SDK

**Exemplo:**

```js
const info = client.getInfo();
console.log(info);
// Output:
// {
//   baseURL: 'https://elaxi.xyz',
//   logLevel: 'info',
//   version: '1.0.0'
// }
```

## 🔧 Exemplos Completos

### Configuração Multi-ambiente

```js
import { SelenaAI } from 'selena-ai-sdk';

class SelenaClientManager {
  constructor() {
    this.clients = new Map();
  }
  
  createClient(environment = 'production') {
    if (this.clients.has(environment)) {
      return this.clients.get(environment);
    }
    
    const configs = {
      development: {
        apiKey: 'dev-key',
        baseURL: 'http://localhost:3000',
        logging: 'debug'
      },
      staging: {
        apiKey: process.env.STAGING_API_KEY,
        baseURL: 'https://staging.elaxi.xyz',
        logging: 'info'
      },
      production: {
        apiKey: process.env.PROD_API_KEY,
        baseURL: 'https://elaxi.xyz',
        logging: 'error'
      }
    };
    
    const client = new SelenaAI(configs[environment]);
    this.clients.set(environment, client);
    
    return client;
  }
}

const manager = new SelenaClientManager();
const devClient = manager.createClient('development');
const prodClient = manager.createClient('production');
```

### Cliente com Retry Automático

```js
import { SelenaAI, APIError } from 'selena-ai-sdk';

class ResilientSelenaClient {
  constructor(options) {
    this.client = new SelenaAI(options);
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }
  
  async chatCompletion(params, attempt = 1) {
    try {
      return await this.client.chat.completions(params);
    } catch (error) {
      if (error instanceof APIError && 
          error.status >= 500 && 
          attempt < this.maxRetries) {
        
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.chatCompletion(params, attempt + 1);
      }
      
      throw error;
    }
  }
}

const resilientClient = new ResilientSelenaClient({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

// Usar com retry automático
const response = await resilientClient.chatCompletion({
  message: 'Test message with retry'
});
```

### Cliente com Métricas

```js
import { SelenaAI } from 'selena-ai-sdk';

class MetricsSelenaClient {
  constructor(options) {
    this.client = new SelenaAI(options);
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0
    };
  }
  
  async chatCompletion(params) {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    try {
      const response = await this.client.chat.completions(params);
      
      this.metrics.successfulRequests++;
      this.metrics.totalResponseTime += Date.now() - startTime;
      
      return response;
      
    } catch (error) {
      this.metrics.failedRequests++;
      this.metrics.totalResponseTime += Date.now() - startTime;
      throw error;
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalRequests > 0 
        ? (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2) + '%'
        : '0%',
      averageResponseTime: this.metrics.totalRequests > 0
        ? Math.round(this.metrics.totalResponseTime / this.metrics.totalRequests) + 'ms'
        : '0ms'
    };
  }
  
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0
    };
  }
}

// Uso
const metricsClient = new MetricsSelenaClient({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

await metricsClient.chatCompletion({ message: 'Hello' });
await metricsClient.chatCompletion({ message: 'How are you?' });

console.log(metricsClient.getMetrics());
// Output:
// {
//   totalRequests: 2,
//   successfulRequests: 2,
//   failedRequests: 0,
//   totalResponseTime: 2450,
//   successRate: '100%',
//   averageResponseTime: '1225ms'
// }
```

## 🔐 Considerações de Segurança

### Armazenamento de API Keys

```js
import { SelenaAI } from 'selena-ai-sdk';

// ❌ RUIM - Hardcode no código
const badClient = new SelenaAI({
  apiKey: 'sk-1234567890abcdef' // Exposta no código fonte!
});

// ✅ BOM - Variável de ambiente
const goodClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

// ✅ MELHOR - Com validação
const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    throw new Error('Invalid API key format');
  }
  return apiKey;
};

const bestClient = new SelenaAI({
  apiKey: validateApiKey(process.env.SELENA_API_KEY)
});
```

### Logging Seguro

```js
import { SelenaAI } from 'selena-ai-sdk';

// Em produção, nunca use 'debug' logging
const productionClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
});

// Para dados sensíveis, use 'none'
const sensitiveClient = new SelenaAI({
  apiKey: process.env.SENSITIVE_API_KEY,
  logging: 'none'
});
```

## 🚨 Error Handling

```js
import { SelenaAI, ValidationError, APIError } from 'selena-ai-sdk';

async function robustChat() {
  try {
    const client = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: 'info'
    });
    
    const response = await client.chat.completions({
      message: 'Hello world!'
    });
    
    return response;
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation error:', error.message);
      console.error('Field:', error.field);
      
    } else if (error instanceof APIError) {
      console.error('API error:', error.message);
      console.error('Status:', error.status);
      
      if (error.status === 401) {
        console.error('Invalid API key - check your credentials');
      } else if (error.status === 429) {
        console.error('Rate limit exceeded - try again later');
      }
      
    } else {
      console.error('Unexpected error:', error.message);
    }
    
    throw error;
  }
}
```

## 📊 Performance Tips

### Reutilizar Cliente

```js
// ❌ RUIM - Criar cliente para cada request
async function badWay(messages) {
  const responses = [];
  
  for (const message of messages) {
    const client = new SelenaAI({ // Novo cliente toda vez!
      apiKey: process.env.SELENA_API_KEY
    });
    
    const response = await client.chat.completions({ message });
    responses.push(response);
  }
  
  return responses;
}

// ✅ BOM - Reutilizar cliente
async function goodWay(messages) {
  const client = new SelenaAI({ // Uma única vez
    apiKey: process.env.SELENA_API_KEY
  });
  
  const responses = [];
  
  for (const message of messages) {
    const response = await client.chat.completions({ message });
    responses.push(response);
  }
  
  return responses;
}
```

### Logging Otimizado

```js
// Em desenvolvimento
const devClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug'
});

// Em produção
const prodClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'error' // Menos overhead
});

// Para high-throughput
const perfClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none' // Zero overhead
});
```

---

Veja também [Chat API](/api/chat) para referência completa da API de chat.