# Logging Examples

Exemplos detalhados de como configurar e usar o sistema de logging do Selena AI SDK.

## 📊 Níveis de Log

### Debug Mode

Mostra informações completas de request/response.

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'debug'
});

// Output no console:
// [2024-01-31T10:00:00.000Z] [Selena DEBUG] → POST https://elaxi.xyz/api/chat
// [2024-01-31T10:00:00.001Z] [Selena DEBUG] Body: { model: 'selena-pro-v1', message: 'Hello!' }
// [2024-01-31T10:00:01.200Z] [Selena DEBUG] ← 200 (1199ms)
// [2024-01-31T10:00:01.201Z] [Selena DEBUG] Response: { response: 'Hello! How can I help?' }
```

### Info Mode

Mostra informações básicas de operação.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

// Output no console:
// [2024-01-31T10:00:00.000Z] [Selena INFO] Creating chat completion { model: 'selena-pro-v1', messageLength: 12 }
// [2024-01-31T10:00:01.200Z] [Selena INFO] Chat completion created successfully
```

### Error Mode

Apenas erros serão exibidos.

```js
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'error'
});

// Apenas se houver erro:
// [2024-01-31T10:00:01.000Z] [Selena ERROR] Request failed: HTTP 401: Unauthorized
```

## 🔄 Logging Dinâmico

### Mudando em Runtime

```js
import { SelenaAI } from 'selena-ai-sdk';

const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none' // Inicia sem logs
});

async function demonstrateDynamicLogging() {
  console.log('🔇 Testando sem logs...');
  await client.chat.completions({
    message: 'Primeira mensagem (sem logs)'
  });
  
  console.log('\n🔊 Ativando debug...');
  client.setLogLevel('debug');
  
  await client.chat.completions({
    message: 'Segunda mensagem (com debug)'
  });
  
  console.log('\n🔇 Desativando logs...');
  client.setLogLevel('none');
  
  await client.chat.completions({
    message: 'Terceira mensagem (sem logs)'
  });
}

demonstrateDynamicLogging();
```

### Context-Aware Logging

```js
class ContextualLogger {
  constructor(baseClient) {
    this.client = baseClient;
    this.contexts = new Map();
  }
  
  withContext(name, config = {}) {
    this.contexts.set(name, config);
    return this;
  }
  
  async chat(message, context = 'default') {
    const config = this.contexts.get(context) || {};
    const originalLevel = this.client.logger.level;
    
    // Aplicar configuração do contexto
    if (config.logLevel) {
      this.client.setLogLevel(config.logLevel);
    }
    
    try {
      console.log(`[${context}] Enviando mensagem...`);
      
      const response = await this.client.chat.completions({
        message: `${config.prefix ? config.prefix + ' ' : ''}${message}`
      });
      
      console.log(`[${context}] Resposta recebida`);
      return response;
      
    } finally {
      // Restaurar logging original
      this.client.setLogLevel(originalLevel);
    }
  }
}

// Uso
const contextualClient = new ContextualLogger(client)
  .withContext('debug', { logLevel: 'debug', prefix: '[DEBUG]' })
  .withContext('production', { logLevel: 'error' })
  .withContext('testing', { logLevel: 'none' });

await contextualClient.chat('Test message', 'debug'); // Com debug
await contextualClient.chat('Production message', 'production'); // Apenas erros
await contextualClient.chat('Test silent', 'testing'); // Sem logs
```

## 📝 Custom Logger Implementation

### Arquivo de Log

```js
import fs from 'fs/promises';
import path from 'path';

class FileLogger {
  constructor(filePath, level = 'info') {
    this.filePath = filePath;
    this.level = level;
    this.levels = { none: 0, error: 1, info: 2, debug: 3 };
  }
  
  _shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }
  
  async _write(level, message) {
    if (!this._shouldLog(level)) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    try {
      await fs.appendFile(this.filePath, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  debug(message) {
    this._write('debug', message);
  }
  
  info(message) {
    this._write('info', message);
  }
  
  error(message) {
    this._write('error', message);
  }
}

// Uso com Selena AI
async function setupFileLogging() {
  const logDir = './logs';
  await fs.mkdir(logDir, { recursive: true });
  
  const fileLogger = new FileLogger(
    path.join(logDir, `selena-${new Date().toISOString().split('T')[0]}.log`),
    'debug'
  );
  
  const client = new SelenaAI({
    apiKey: process.env.SELENA_API_KEY,
    logging: 'none' // Desativar console logging
  });
  
  // Substituir o logger
  client.logger = fileLogger;
  
  return client;
}

const fileLoggedClient = await setupFileLogging();
```

### Structured Logging

```js
class StructuredLogger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = { none: 0, error: 1, info: 2, debug: 3 };
  }
  
  _shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }
  
  _log(level, event, data = {}) {
    if (!this._shouldLog(level)) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...data
    };
    
    console.log(JSON.stringify(logEntry));
  }
  
  debug(event, data) {
    this._log('debug', event, data);
  }
  
  info(event, data) {
    this._log('info', event, data);
  }
  
  error(event, data) {
    this._log('error', event, data);
  }
}

// Integrar com Selena AI
const structuredClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

structuredClient.logger = new StructuredLogger('debug');

// Output estruturado:
// {"timestamp":"2024-01-31T10:00:00.000Z","level":"debug","event":"http_request","url":"https://elaxi.xyz/api/chat","method":"POST"}
// {"timestamp":"2024-01-31T10:00:01.200Z","level":"debug","event":"http_response","status":200,"duration":1200}
```

### Multi-Channel Logger

```js
class MultiChannelLogger {
  constructor(channels = []) {
    this.channels = channels;
  }
  
  _log(level, message, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    };
    
    this.channels.forEach(channel => {
      try {
        channel.log(logEntry);
      } catch (error) {
        console.error('Logger channel error:', error);
      }
    });
  }
  
  debug(message, data) {
    this._log('debug', message, data);
  }
  
  info(message, data) {
    this._log('info', message, data);
  }
  
  error(message, data) {
    this._log('error', message, data);
  }
}

// Canais de logging
class ConsoleChannel {
  log(entry) {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    console.log(prefix, entry.message, entry.data ? JSON.stringify(entry.data) : '');
  }
}

class FileChannel {
  constructor(filePath) {
    this.filePath = filePath;
  }
  
  async log(entry) {
    await fs.appendFile(this.filePath, JSON.stringify(entry) + '\n');
  }
}

class WebhookChannel {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }
  
  async log(entry) {
    if (entry.level === 'error') {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }
  }
}

// Configuração multi-channel
const multiLogger = new MultiChannelLogger([
  new ConsoleChannel(),
  new FileChannel('./logs/app.log'),
  new WebhookChannel('https://hooks.slack.com/your-webhook')
]);

const multiClient = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'none'
});

multiClient.logger = multiLogger;
```

## 🔍 Debugging com Logs

### Request Tracing

```js
class RequestTracer {
  constructor(client) {
    this.client = client;
    this.traces = new Map();
  }
  
  generateTraceId() {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async traceRequest(message) {
    const traceId = this.generateTraceId();
    const startTime = Date.now();
    
    console.log(`[TRACE:${traceId}] Iniciando request`);
    
    try {
      // Ativar logging temporariamente
      const originalLevel = this.client.logger.level;
      this.client.setLogLevel('debug');
      
      const response = await this.client.chat.completions({
        message: `[TRACE:${traceId}] ${message}`
      });
      
      this.client.setLogLevel(originalLevel);
      
      const duration = Date.now() - startTime;
      
      this.traces.set(traceId, {
        message,
        response: response.response,
        duration,
        timestamp: new Date().toISOString(),
        success: true
      });
      
      console.log(`[TRACE:${traceId}] Request concluída em ${duration}ms`);
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.traces.set(traceId, {
        message,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
        success: false
      });
      
      console.log(`[TRACE:${traceId}] Request falhou em ${duration}ms: ${error.message}`);
      
      throw error;
    }
  }
  
  getTrace(traceId) {
    return this.traces.get(traceId);
  }
  
  getAllTraces() {
    return Array.from(this.traces.entries()).map(([id, trace]) => ({
      id,
      ...trace
    }));
  }
}

// Uso
const tracer = new RequestTracer(client);

await tracer.traceRequest('Test message 1');
await tracer.traceRequest('Test message 2');

console.log('Todos os traces:', tracer.getAllTraces());
```

### Performance Analysis

```js
class PerformanceAnalyzer {
  constructor(client) {
    this.client = client;
    this.metrics = {
      requests: [],
      totalTime: 0,
      errorCount: 0
    };
  }
  
  async analyzeRequest(message) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}`;
    
    this.client.logger.info(`[PERF:${requestId}] Iniciando request`);
    
    try {
      const response = await this.client.chat.completions({
        message
      });
      
      const duration = Date.now() - startTime;
      
      this.metrics.requests.push({
        id: requestId,
        message,
        duration,
        responseLength: response.response.length,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      this.metrics.totalTime += duration;
      
      this.client.logger.info(`[PERF:${requestId}] Success: ${duration}ms`);
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.errorCount++;
      
      this.metrics.requests.push({
        id: requestId,
        message,
        duration,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      });
      
      this.metrics.totalTime += duration;
      
      this.client.logger.error(`[PERF:${requestId}] Error: ${duration}ms - ${error.message}`);
      
      throw error;
    }
  }
  
  getPerformanceReport() {
    const totalRequests = this.metrics.requests.length;
    const successRate = totalRequests > 0 
      ? ((totalRequests - this.metrics.errorCount) / totalRequests * 100).toFixed(2)
      : '0';
    
    const avgDuration = totalRequests > 0
      ? Math.round(this.metrics.totalTime / totalRequests)
      : 0;
    
    const durations = this.metrics.requests.map(r => r.duration);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    return {
      totalRequests,
      successRate: `${successRate}%`,
      avgDuration: `${avgDuration}ms`,
      minDuration: `${minDuration}ms`,
      maxDuration: `${maxDuration}ms`,
      errorCount: this.metrics.errorCount
    };
  }
}

// Uso
const analyzer = new PerformanceAnalyzer(client);

// Fazer várias requests para análise
const messages = ['Hello', 'How are you?', 'Explain AI', 'What is JS?'];

for (const msg of messages) {
  try {
    await analyzer.analyzeRequest(msg);
  } catch (error) {
    // Ignorar erros para este exemplo
  }
}

console.log('Relatório de performance:', analyzer.getPerformanceReport());
```

## 🔧 Log Management

### Log Rotation

```js
import fs from 'fs/promises';
import path from 'path';

class LogRotator {
  constructor(logDir, maxFiles = 7, maxSize = 10 * 1024 * 1024) { // 10MB
    this.logDir = logDir;
    this.maxFiles = maxFiles;
    this.maxSize = maxSize;
  }
  
  async rotateLog(filePath) {
    try {
      const stats = await fs.stat(filePath);
      
      if (stats.size < this.maxSize) {
        return false; // Não precisa rotacionar
      }
      
      const basename = path.basename(filePath, '.log');
      const dir = path.dirname(filePath);
      
      // Mover arquivos existentes
      for (let i = this.maxFiles - 1; i > 0; i--) {
        const oldFile = path.join(dir, `${basename}.${i}.log`);
        const newFile = path.join(dir, `${basename}.${i + 1}.log`);
        
        try {
          await fs.rename(oldFile, newFile);
        } catch {
          // Arquivo pode não existir
        }
      }
      
      // Mover arquivo atual
      const rotatedFile = path.join(dir, `${basename}.1.log`);
      await fs.rename(filePath, rotatedFile);
      
      console.log(`Log rotacionado: ${filePath} -> ${rotatedFile}`);
      return true;
      
    } catch (error) {
      console.error('Erro ao rotacionar log:', error);
      return false;
    }
  }
}

// Uso com FileLogger
class RotatingFileLogger extends FileLogger {
  constructor(filePath, level = 'info', rotator) {
    super(filePath, level);
    this.rotator = rotator;
  }
  
  async _write(level, message) {
    if (!this._shouldLog(level)) return;
    
    // Verificar se precisa rotacionar antes de escrever
    await this.rotator.rotateLog(this.filePath);
    
    return super._write(level, message);
  }
}

const logDir = './logs';
await fs.mkdir(logDir, { recursive: true });

const rotator = new LogRotator(logDir);
const rotatingLogger = new RotatingFileLogger(
  path.join(logDir, 'selena.log'),
  'debug',
  rotator
);
```

---

Veja também [Configuration](/guide/configuration) para mais opções de logging.