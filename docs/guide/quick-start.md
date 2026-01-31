# Começo Rápido

Aprenda a usar o Selena AI SDK em minutos com exemplos práticos.

## 🎯 Primeiros Passos

### 1. Configuração Básica

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info' // 'none', 'error', 'info', 'debug'
});
```

### 2. Primeira Conversa

```js
try {
  const response = await client.chat.completions({
    model: 'selena-pro-v1',
    message: 'Olá! Como você está?'
  });
  
  console.log('Resposta:', response.response);
} catch (error) {
  console.error('Erro:', error.message);
}
```

## 📝 Exemplos Práticos

### Conversa Simples

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY
});

async function simpleChat() {
  const response = await client.chat.completions({
    message: 'Explique o que é inteligência artificial em uma frase'
  });
  
  console.log(response.response);
}

simpleChat();
```

### Conversa com Logging Detalhado

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug' // Mostrará request/response completos
});

async function detailedChat() {
  console.log('Enviando mensagem...');
  
  const response = await client.chat.completions({
    model: 'selena-pro-v1',
    message: 'Quais são os benefícios do JavaScript moderno?'
  });
  
  console.log('Resposta recebida:', response.response);
}

detailedChat();
```

### Tratamento de Erros

```js
import { SelenaAI, APIError, ValidationError } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

async function robustChat() {
  try {
    const response = await client.chat.completions({
      model: 'selena-pro-v1',
      message: 'Me ajude a resolver este problema matemático: 2 + 2'
    });
    
    console.log('✅ Sucesso:', response.response);
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('❌ Erro de validação:', error.message);
      console.error('Campo:', error.field);
      
    } else if (error instanceof APIError) {
      console.error('❌ Erro da API:', error.message);
      console.error('Status:', error.status);
      
    } else {
      console.error('❌ Erro inesperado:', error.message);
    }
  }
}

robustChat();
```

### Múltiplas Perguntas

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

async function multipleQuestions() {
  const questions = [
    'O que é programação funcional?',
    'Como funciona o hoisting em JavaScript?',
    'Explique o conceito de closures'
  ];
  
  for (const question of questions) {
    console.log(`\n🤔 Pergunta: ${question}`);
    
    try {
      const response = await client.chat.completions({
        message: question
      });
      
      console.log(`🧠 Resposta: ${response.response}`);
      
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
    }
    
    // Pequena pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

multipleQuestions();
```

### Chat com Timeout

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug'
});

async function chatWithTimeout() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ Timeout - cancelando request...');
    controller.abort();
  }, 10000); // 10 segundos
  
  try {
    const response = await client.chat.completions({
      message: 'Escreva uma história muito longa sobre viagem espacial',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('✅ Resposta:', response.response);
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log('⏰ Request cancelado por timeout');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

chatWithTimeout();
```

## 🖥️ Exemplos de CLI

### Chat Interativo no Terminal

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
```

### Comandos Especiais no Chat

Quando estiver no modo `selena chat`, você pode usar:

- `sair` ou `exit` - Encerrar o chat
- `limpar` ou `clear` - Limpar a tela
- `help` - Mostrar ajuda

## 🔄 Uso Avançado

### Mudar Nível de Logging

```js
import { SelenaAI } from 'selena-ai-sdk';

let client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

// Mudar para debug durante desenvolvimento
client.setLogLevel('debug');

// Voltar para produção
client.setLogLevel('error');
```

### Obter Informações do Cliente

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  baseURL: 'https://elaxi.xyz',
  logging: 'info'
});

console.log(client.getInfo());
// Output:
// {
//   baseURL: 'https://elaxi.xyz',
//   logLevel: 'info',
//   version: '1.0.0'
// }
```

### Ambiente de Produção

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  baseURL: process.env.SELENA_BASE_URL || 'https://elaxi.xyz'
});
```

## 🧪 Testes Unitários

```js
// Com Jest ou similar
import { SelenaAI, ValidationError } from 'selena-ai-sdk';

describe('SelenaAI', () => {
  test('deve lançar erro sem API key', () => {
    expect(() => new SelenaAI()).toThrow(ValidationError);
  });
  
  test('deve criar cliente com API key', () => {
    const client = new SelenaAI({
      apiKey: 'test-key',
      logging: 'none'
    });
    
    expect(client).toBeDefined();
    expect(client.getInfo().version).toBe('1.0.0');
  });
});
```

## ✅ Checklist de Uso

- [ ] SDK configurado com API key
- [ ] Primeira requisição funcionando
- [ ] Tratamento de erros implementado
- [ ] Logs configurados conforme ambiente
- [ ] CLI testada (se instalada globalmente)
- [ ] Testes básicos passando

---

🎉 **Excelente!** Você já sabe usar o Selena AI SDK. Continue para [Configuração Avançada](/guide/configuration) ou veja mais [Exemplos](/examples/usage).