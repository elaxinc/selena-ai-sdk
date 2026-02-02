# Exemplos de Uso

Exemplos práticos e completos para usar o Selena AI SDK em diferentes cenários.

## 🚀 Índice

- [Uso Básico](#uso-básico)
- [Logging](#logging)
- [CLI](#cli)
- [Express.js](#expressjs)
- [Batch Processing](#batch-processing)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)

---

## 📦 Uso Básico

### Exemplo Simples

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

async function basicExample() {
  const response = await client.chat.completions({
    model: 'selena-pro-v1',
    message: 'Olá! Como você está?'
  });
  
  console.log(response.response);
}

basicExample();
```

### Múltiplas Perguntas

```js
async function multipleQuestions() {
  const questions = [
    'O que é JavaScript?',
    'Explique async/await',
    'Como funciona o fetch API?'
  ];
  
  for (const question of questions) {
    const response = await client.chat.completions({
      message: question
    });
    
    console.log(`Q: ${question}`);
    console.log(`A: ${response.response}\n`);
  }
}

multipleQuestions();
```

---

## 📝 Logging

### Debug Completo

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug' // Mostrará todos os requests/responses
});

async function debugExample() {
  const response = await client.chat.completions({
    message: 'Explique machine learning'
  });
  
  console.log(response.response);
}
```

### Logging Dinâmico

```js
function createClient(environment) {
  const logLevel = environment === 'production' ? 'error' : 'debug';
  
  return new SelenaAI({
    apiKey: process.env.SELENA_API_KEY,
    logging: logLevel
  });
}

// Mudar logging em runtime
client.setLogLevel('verbose');
```

---

## 🖥️ CLI

### Chat Interativo

```bash
# Iniciar chat
selena chat

# Com logs detalhados
selena chat --verbose

# Sem logs
selena chat --quiet
```

### Pergunta Única

```bash
# Perguntar diretamente
selena ask "Qual a capital do Brasil?"

# Com debug
selena ask "Explique machine learning" --verbose

# Em script
#!/bin/bash
API_KEY="your-key"
MESSAGE=$1

SELENA_API_KEY=$API_KEY selena ask "$MESSAGE"
```

### Script de Backup

```bash
#!/bin/bash
# backup-chat.sh

SELENA_API_KEY="$1"
BACKUP_FILE="$2"

selena ask "Gere um resumo das conversas de hoje" > "$BACKUP_FILE"
echo "Backup salvo em: $BACKUP_FILE"
```

---

## 🌐 Express.js

### Servidor Web Simples

```js
import express from 'express';
import { SelenaAI } from 'selena-ai-sdk';

const app = express();
app.use(express.json());

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
});

// Endpoint de chat
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }
    
    const response = await client.chat.completions({
      message
    });
    
    res.json({ 
      response: response.response,
      model: 'selena-pro-v1',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

### Middleware de Rate Limiting

```js
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // 10 requests por minuto
  message: 'Too many chat requests',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/chat', chatLimiter);
```

---

## 📦 Batch Processing

### Processamento em Lote

```js
import { SelenaAI } from 'selena-ai-sdk';

class BatchProcessor {
  constructor(options) {
    this.client = new SelenaAI(options);
    this.concurrency = options.concurrency || 3;
    this.delay = options.delay || 1000;
  }
  
  async processBatch(messages) {
    const results = [];
    
    for (let i = 0; i < messages.length; i += this.concurrency) {
      const batch = messages.slice(i, i + this.concurrency);
      
      const promises = batch.map(async (message, index) => {
        try {
          const response = await this.client.chat.completions({
            message
          });
          
          return {
            index: i + index,
            success: true,
            data: response
          };
        } catch (error) {
          return {
            index: i + index,
            success: false,
            error: error.message
          };
        }
      });
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      
      // Delay entre batches
      if (i + this.concurrency < messages.length) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    return results;
  }
}

// Uso
const processor = new BatchProcessor({
  apiKey: process.env.SELENA_API_KEY,
  concurrency: 3,
  delay: 1000
});

const messages = [
  'O que é Node.js?',
  'Explique async/await',
  'Como funciona o fetch?',
  'O que são promises?',
  'Explique closures',
  'Diferença entre let e const',
  'O que é TypeScript?',
  'Como funciona o event loop?'
];

const results = await processor.processBatch(messages);

results.forEach(result => {
  if (result.success) {
    console.log(`✅ ${result.index}: ${result.data.response.substring(0, 50)}...`);
  } else {
    console.log(`❌ ${result.index}: ${result.error}`);
  }
});
```

### CSV Processor

```js
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

async function processCSVFile(filePath) {
  try {
    // Ler arquivo CSV
    const content = await fs.readFile(filePath, 'utf8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });
    
    const client = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: 'info'
    });
    
    // Processar cada linha
    for (const record of records) {
      const prompt = `Analise os seguintes dados: ${JSON.stringify(record)}`;
      
      try {
        const response = await client.chat.completions({
          message: prompt
        });
        
        console.log(`✅ Processado: ${record.id}`);
        console.log(`📝 Análise: ${response.response}`);
        
        // Salvar resultado
        record.analysis = response.response;
        
      } catch (error) {
        console.error(`❌ Erro em ${record.id}:`, error.message);
        record.error = error.message;
      }
      
      // Pequena pausa
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Salvar resultados
    const outputPath = filePath.replace('.csv', '_processed.csv');
    await fs.writeFile(outputPath, JSON.stringify(records, null, 2));
    
    console.log(`📁 Resultados salvos em: ${outputPath}`);
    
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
  }
}
```

---

## 🚨 Error Handling

### Robust Error Handler

```js
import { SelenaAI, ValidationError, APIError } from 'selena-ai-sdk';

class RobustChatClient {
  constructor(options) {
    this.client = new SelenaAI(options);
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }
  
  async chat(message, attempt = 1) {
    try {
      const response = await this.client.chat.completions({
        message: message.trim()
      });
      
      return response;
      
    } catch (error) {
      // Não retry para erros de validação
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      
      // Retry para erros de servidor
      if (error instanceof APIError && 
          error.status >= 500 && 
          attempt <= this.maxRetries) {
        
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms... (attempt ${attempt})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.chat(message, attempt + 1);
      }
      
      throw error;
    }
  }
}

// Uso
const robustClient = new RobustChatClient({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

try {
  const response = await robustClient.chat('Explique machine learning');
  console.log(response.response);
} catch (error) {
  console.error('Final error:', error.message);
}
```

### Fallback Strategy

```js
class FallbackClient {
  constructor(primaryOptions, secondaryOptions) {
    this.primary = new SelenaAI(primaryOptions);
    this.secondary = new SelenaAI(secondaryOptions);
  }
  
  async chat(message) {
    try {
      console.log('🥇 Tentando servidor primário...');
      return await this.primary.chat.completions({ message });
    } catch (primaryError) {
      console.log('⚠️ Servidor primário falhou, tentando backup...');
      
      try {
        return await this.secondary.chat.completions({ message });
      } catch (secondaryError) {
        throw new Error(`Ambos servidores falharam: ${primaryError.message}`);
      }
    }
  }
}
```

---

## 🔧 Advanced Patterns

### Template System

```js
class PromptTemplates {
  static codeReview(code, language) {
    return `
Revise o seguinte código em ${language}:

\`\`\`${language}
${code}
\`\`\`

Analise:
1. Qualidade e clareza
2. Boas práticas
3. Possíveis bugs
4. Sugestões de melhoria
5. Performance
    `.trim();
  }
  
  static documentation(functionality) {
    return `
Escreva documentação técnica para: ${functionality}

Inclua:
1. Descrição geral
2. Parâmetros
3. Retorno
4. Exemplos de uso
5. Casos de erro
    `.trim();
  }
  
  static optimization(task, constraints = '') {
    return `
Otimize o seguinte código para ${task}:

${constraints ? `Restrições: ${constraints}` : ''}

Considere:
1. Performance
2. Legibilidade
3. Manutenibilidade
4. Boas práticas
    `.trim();
  }
}

// Uso
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

// Code review
const code = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
`;

const review = await client.chat.completions({
  message: PromptTemplates.codeReview(code, 'JavaScript')
});

// Generate documentation
const docs = await client.chat.completions({
  message: PromptTemplates.documentation('API de autenticação JWT')
});
```

### Chat com Memória

```js
class MemoryChat {
  constructor(client, maxSize = 10) {
    this.client = client;
    this.memory = [];
    this.maxSize = maxSize;
  }
  
  async sendMessage(message) {
    // Construir prompt com memória
    const prompt = this.buildPromptWithMemory(message);
    
    try {
      const response = await this.client.chat.completions({
        message: prompt
      });
      
      // Adicionar à memória
      this.addToMemory('user', message);
      this.addToMemory('assistant', response.response);
      
      return response.response;
      
    } catch (error) {
      throw error;
    }
  }
  
  buildPromptWithMemory(currentMessage) {
    if (this.memory.length === 0) {
      return currentMessage;
    }
    
    let prompt = 'Conversa anterior:\n\n';
    
    for (const entry of this.memory) {
      const role = entry.role === 'user' ? 'Você' : 'Assistente';
      prompt += `${role}: ${entry.message}\n`;
    }
    
    prompt += `\nNova mensagem: ${currentMessage}`;
    return prompt;
  }
  
  addToMemory(role, message) {
    this.memory.push({
      role,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Manter apenas as últimas trocas
    if (this.memory.length > this.maxSize * 2) {
      this.memory = this.memory.slice(-this.maxSize * 2);
    }
  }
  
  clearMemory() {
    this.memory = [];
  }
  
  getMemory() {
    return [...this.memory];
  }
}

// Uso
const memoryChat = new MemoryChat(client, 5);

await memoryChat.sendMessage('Meu nome é João');
await memoryChat.sendMessage('Qual é a capital do Brasil?');
await memoryChat.sendMessage('Qual é o meu nome?'); // Lembrará!
```

### Streaming Simulation

```js
async function simulateStreaming(message, onChunk) {
  const client = new SelenaAI({
    apiKey: process.env.SELENA_API_KEY
  });
  
  try {
    // Para API streaming (quando disponível)
    const response = await client.chat.completions({
      message: `${message}\n\nPor favor, responda em frases curtas, separadas por "|"`
    });
    
    // Simular streaming
    const sentences = response.response.split('|').filter(s => s.trim());
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed) {
        onChunk(trimmed + ' ');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
  } catch (error) {
    onChunk(`Erro: ${error.message}`);
  }
}

// Uso
await simulateStreaming(
  'Explique o conceito de programação assíncrona',
  (chunk) => process.stdout.write(chunk)
);
```

---

## ✅ Testes

### Unit Tests

```js
import { SelenaAI, ValidationError } from 'selena-ai-sdk';

describe('SelenaAI SDK', () => {
  test('deve criar cliente com API key válida', () => {
    const client = new SelenaAI({
      apiKey: 'test-key',
      logging: 'none'
    });
    
    expect(client).toBeDefined();
    expect(client.getInfo().version).toBe('1.0.0');
  });
  
  test('deve lançar erro sem API key', () => {
    expect(() => new SelenaAI({})).toThrow(ValidationError);
  });
  
  test('deve mudar nível de logging', () => {
    const client = new SelenaAI({
      apiKey: 'test-key',
      logging: 'none'
    });
    
    client.setLogLevel('debug');
    expect(client.getInfo().logLevel).toBe('debug');
  });
});
```

### Integration Tests

```js
describe('Integration Tests', () => {
  test('deve fazer request real', async () => {
    const client = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: 'none'
    });
    
    const response = await client.chat.completions({
      message: 'Responda com apenas: ok'
    });
    
    expect(response.response).toContain('ok');
  });
  
  test('deve lidar com API key inválida', async () => {
    const client = new SelenaAI({
      apiKey: 'invalid-key',
      logging: 'none'
    });
    
    await expect(client.chat.completions({
      message: 'test'
    })).rejects.toThrow();
  });
});
```

---

## 🎯 Best Practices

### Performance

```js
// ✅ BOM - Reutilizar cliente
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

for (const message of messages) {
  await client.chat.completions({ message });
}

// ❌ RUIM - Criar cliente a cada request
for (const message of messages) {
  const client = new SelenaAI({
    apiKey: process.env.SELENA_API_KEY
  });
  await client.chat.completions({ message });
}
```

### Security

```js
// ✅ BOM - Variáveis de ambiente
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

// ❌ RUIM - Hardcode no código
const client = new SelenaAI({
  apiKey: 'sk-1234567890abcdef' // Exposto!
});
```

### Error Handling

```js
// ✅ BOM - Tratamento específico
try {
  const response = await client.chat.completions({ message });
  return response;
} catch (error) {
  if (error instanceof ValidationError) {
    // Tratar validação
  } else if (error instanceof APIError) {
    // Tratar erro da API
  } else {
    // Tratar erro genérico
  }
}

// ❌ RUIM - Catch genérico
try {
  const response = await client.chat.completions({ message });
  return response;
} catch (error) {
  console.log('Erro:', error.message); // Sem tratamento específico
}
```

---

🎉 **Excelente!** Agora você tem exemplos práticos para usar o Selena AI SDK em diversos cenários. Para mais informações, consulte a [documentação completa](/guide/installation).