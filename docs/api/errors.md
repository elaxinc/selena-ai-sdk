# Error Handling

Referência completa das classes de erro do Selena AI SDK.

## 📋 Hierarquia de Erros

```
SelenaError (Base)
├── AuthenticationError
├── APIError
├── NetworkError
└── ValidationError
```

## 🔧 Classes de Erro

### SelenaError

Classe base para todos os erros do SDK.

```js
import { SelenaError } from 'selena-ai-sdk';

try {
  // código que pode lançar erro
} catch (error) {
  if (error instanceof SelenaError) {
    console.log('Erro do Selena AI SDK:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
  }
}
```

**Propriedades:**
- `message` (string): Mensagem de erro
- `name` (string): Nome da classe de erro
- `code` (string): Código de erro interno
- `details` (any): Detalhes adicionais

### AuthenticationError

Erro de autenticação - API key inválida ou ausente.

```js
import { AuthenticationError } from 'selena-ai-sdk';

try {
  const client = new SelenaAI({ apiKey: 'invalid-key' });
  await client.chat.completions({ message: 'test' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Falha de autenticação:', error.message);
    // Ação: verificar API key
  }
}
```

**Cenários:**
- API key não fornecida
- API key inválida
- API key expirada
- Sem permissão para o recurso

### APIError

Erros retornados pela API da Selena.

```js
import { APIError } from 'selena-ai-sdk';

try {
  await client.chat.completions({ message: 'test' });
} catch (error) {
  if (error instanceof APIError) {
    console.error('Erro da API:', error.message);
    console.error('Status HTTP:', error.status);
    console.error('Response:', error.response);
    
    switch (error.status) {
      case 400:
        console.error('Request inválido');
        break;
      case 401:
        console.error('Não autorizado');
        break;
      case 429:
        console.error('Muitos requests');
        break;
      case 500:
        console.error('Erro no servidor');
        break;
    }
  }
}
```

**Propriedades:**
- `status` (number): Status HTTP do erro
- `response` (any): Resposta do servidor

**Códigos Comuns:**
- `400` - Bad Request (parâmetros inválidos)
- `401` - Unauthorized (API key inválida)
- `403` - Forbidden (sem permissão)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
- `503` - Service Unavailable

### NetworkError

Erros de rede ou conectividade.

```js
import { NetworkError } from 'selena-ai-sdk';

try {
  await client.chat.completions({ message: 'test' });
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Erro de rede:', error.message);
    // Ação: verificar conexão, proxy, DNS
  }
}
```

**Cenários:**
- Sem conexão com internet
- DNS não resolve
- Timeout de conexão
- Problemas de proxy/firewall

### ValidationError

Erros de validação de parâmetros.

```js
import { ValidationError } from 'selena-ai-sdk';

try {
  new SelenaAI({ apiKey: null }); // API key inválida
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validação falhou:', error.message);
    console.error('Campo:', error.field);
  }
}

// No chat completions
try {
  await client.chat.completions({ message: '' }); // Mensagem vazia
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Erro de validação:', error.message);
    console.error('Campo problemático:', error.field);
  }
}
```

**Propriedades:**
- `field` (string): Nome do campo que falhou na validação

**Validações:**
- `apiKey`: string, não vazia, formato válido
- `message`: string, não vazia
- `model`: string (se fornecido)

## 🛡️ Tratamento Robusto de Erros

### Error Handler Central

```js
import { SelenaAI, AuthenticationError, APIError, NetworkError, ValidationError } from 'selena-ai-sdk';

class ErrorHandler {
  static handle(error, context = '') {
    console.error(`[${context}] Erro:`, error.message);
    
    if (error instanceof ValidationError) {
      return {
        type: 'validation',
        message: error.message,
        field: error.field,
        userFriendly: 'Parâmetros inválidos. Verifique sua requisição.',
        recoverable: true
      };
    }
    
    if (error instanceof AuthenticationError) {
      return {
        type: 'authentication',
        message: error.message,
        userFriendly: 'Erro de autenticação. Verifique sua API key.',
        recoverable: false
      };
    }
    
    if (error instanceof APIError) {
      const isRecoverable = [408, 429, 500, 502, 503, 504].includes(error.status);
      
      return {
        type: 'api',
        message: error.message,
        status: error.status,
        userFriendly: `Erro da API (${error.status}). ${isRecoverable ? 'Tente novamente.' : 'Contate o suporte.'}`,
        recoverable: isRecoverable
      };
    }
    
    if (error instanceof NetworkError) {
      return {
        type: 'network',
        message: error.message,
        userFriendly: 'Erro de conexão. Verifique sua internet.',
        recoverable: true
      };
    }
    
    // Erro genérico
    return {
      type: 'unknown',
      message: error.message,
      userFriendly: 'Erro inesperado. Tente novamente.',
      recoverable: false
    };
  }
}

// Uso
try {
  const response = await client.chat.completions({
    message: 'test message'
  });
} catch (error) {
  const handled = ErrorHandler.handle(error, 'chat');
  
  console.log('Tipo:', handled.type);
  console.log('Mensagem amigável:', handled.userFriendly);
  console.log('Recuperável:', handled.recoverable);
  
  if (!handled.recoverable) {
    // Lógica para erros não recuperáveis
    process.exit(1);
  }
}
```

### Retry com Backoff Exponencial

```js
import { APIError, NetworkError } from 'selena-ai-sdk';

class ResilientClient {
  constructor(baseClient) {
    this.client = baseClient;
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 segundo
  }
  
  async chatCompletion(params, attempt = 1) {
    try {
      return await this.client.chat.completions(params);
    } catch (error) {
      // Não retry para erros não recuperáveis
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError ||
          (error instanceof APIError && [400, 401, 403].includes(error.status))) {
        throw error;
      }
      
      // Verificar se ainda pode tentar
      if (attempt > this.maxRetries) {
        throw error;
      }
      
      // Calcular delay com backoff exponencial
      const delay = this.baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.1 * delay; // 10% jitter
      const totalDelay = delay + jitter;
      
      console.log(`Tentativa ${attempt} falhou, tentando novamente em ${Math.round(totalDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
      
      // Tentar novamente
      return this.chatCompletion(params, attempt + 1);
    }
  }
}

// Uso
const baseClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

const resilientClient = new ResilientClient(baseClient);

try {
  const response = await resilientClient.chatCompletion({
    message: 'test com retry'
  });
  console.log('Sucesso após tentativas:', response.response);
} catch (error) {
  console.error('Falha após todas as tentativas:', error.message);
}
```

### Error Recovery Strategies

```js
class ErrorRecovery {
  static async recoverFromError(error, context) {
    switch (error.constructor.name) {
      case 'AuthenticationError':
        return this.recoverAuth(error);
        
      case 'APIError':
        return this.recoverAPI(error);
        
      case 'NetworkError':
        return this.recoverNetwork(error);
        
      case 'ValidationError':
        return this.recoverValidation(error);
        
      default:
        return this.recoverGeneric(error);
    }
  }
  
  static async recoverAuth(error) {
    console.log('🔐 Tentando recuperar autenticação...');
    
    // Tentar ler do arquivo de config
    const fs = await import('fs/promises');
    
    try {
      const config = JSON.parse(await fs.readFile('.selena-config.json', 'utf8'));
      if (config.apiKey && config.apiKey !== process.env.SELENA_API_KEY) {
        console.log('✅ Usando API key do arquivo de configuração');
        return config.apiKey;
      }
    } catch {
      // Arquivo não existe ou inválido
    }
    
    // Tentar prompt para usuário (CLI)
    const inquirer = await import('inquirer');
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Digite sua API key:',
        validate: input => input.trim() !== '' || 'API key é obrigatória'
      }
    ]);
    
    return apiKey;
  }
  
  static async recoverAPI(error) {
    if (error.status === 429) {
      console.log('⏰ Rate limit atingido, aguardando...');
      const retryAfter = error.response?.retryAfter || 60;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return 'retry';
    }
    
    if (error.status >= 500) {
      console.log('🔄 Erro de servidor, tentando novamente...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return 'retry';
    }
    
    throw error;
  }
  
  static async recoverNetwork(error) {
    console.log('🌐 Problema de rede, tentando reconnect...');
    
    // Esperar progressivamente
    for (let i = 1; i <= 3; i++) {
      try {
        // Testar conectividade
        const response = await fetch('https://elaxi.xyz');
        if (response.ok) {
          console.log('✅ Conexão restaurada');
          return 'retry';
        }
      } catch {
        console.log(`❌ Tentativa ${i} falhou, aguardando...`);
        await new Promise(resolve => setTimeout(resolve, i * 2000));
      }
    }
    
    throw error;
  }
  
  static async recoverValidation(error) {
    console.log('⚠️ Erro de validação no campo:', error.field);
    
    if (error.field === 'message') {
      return {
        correction: 'Por favor, forneça uma mensagem não vazia',
        retry: true
      };
    }
    
    throw error;
  }
  
  static async recoverGeneric(error) {
    console.log('❓ Erro genérico, tentando abordagem padrão...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'retry';
  }
}

// Uso avançado
class SelfHealingClient {
  constructor(options) {
    this.options = options;
    this.client = null;
  }
  
  async getClient() {
    if (!this.client) {
      await this.initializeClient();
    }
    return this.client;
  }
  
  async initializeClient() {
    try {
      this.client = new SelenaAI(this.options);
      await this.client.chat.completions({ message: 'test' });
    } catch (error) {
      const recovery = await ErrorRecovery.recoverFromError(error, 'init');
      
      if (recovery !== 'retry' && typeof recovery !== 'object') {
        this.options.apiKey = recovery;
        this.client = new SelenaAI(this.options);
      }
    }
  }
  
  async chatCompletion(params) {
    const client = await this.getClient();
    
    try {
      return await client.chat.completions(params);
    } catch (error) {
      const recovery = await ErrorRecovery.recoverFromError(error, 'chat');
      
      if (recovery === 'retry') {
        return this.chatCompletion(params);
      }
      
      if (typeof recovery === 'object' && recovery.retry) {
        console.log(recovery.correction);
        // Aqui você poderia solicitar correção do usuário
        return this.chatCompletion(params);
      }
      
      throw error;
    }
  }
}
```

## 🧪 Testes de Error Handling

```js
import { SelenaAI, ValidationError, AuthenticationError, APIError } from 'selena-ai-sdk';

// Teste de validação
describe('Error Handling', () => {
  test('deve lançar ValidationError sem API key', () => {
    expect(() => new SelenaAI({})).toThrow(ValidationError);
  });
  
  test('deve lançar ValidationError com mensagem vazia', async () => {
    const client = new SelenaAI({
      apiKey: 'test-key',
      logging: 'none'
    });
    
    await expect(client.chat.completions({ message: '' }))
      .rejects.toThrow(ValidationError);
  });
  
  test('deve lidar com APIError corretamente', async () => {
    const client = new SelenaAI({
      apiKey: 'invalid-key',
      logging: 'none'
    });
    
    try {
      await client.chat.completions({ message: 'test' });
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(401);
    }
  });
});
```

---

Veja também [Client API](/api/client) para mais informações sobre uso do cliente.