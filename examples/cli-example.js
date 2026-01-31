#!/usr/bin/env node

/**
 * Exemplos de uso da CLI do Selena AI SDK
 * Execute este script para ver demonstrações práticas
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, '..', 'bin', 'selena'), ...args], {
      stdio: 'pipe',
      env: { ...process.env, SELENA_API_KEY: process.env.SELENA_API_KEY }
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function demoVersion() {
  console.log(colorLog('cyan', '\n🔍 Demo 1: Verificar Versão'));
  console.log('─'.repeat(50));
  
  try {
    const result = await runCommand('--version');
    console.log(colorLog('green', '✅ Comando: selena --version'));
    console.log(colorLog('blue', '📤 Output:'), result.stdout.trim());
  } catch (error) {
    console.log(colorLog('red', '❌ Erro:'), error.message);
  }
}

async function demoHelp() {
  console.log(colorLog('cyan', '\n📖 Demo 2: Ajuda da CLI'));
  console.log('─'.repeat(50));
  
  try {
    const result = await runCommand('--help');
    console.log(colorLog('green', '✅ Comando: selena --help'));
    console.log(colorLog('blue', '📤 Output:'));
    console.log(result.stdout);
  } catch (error) {
    console.log(colorLog('red', '❌ Erro:'), error.message);
  }
}

async function demoConfig() {
  console.log(colorLog('cyan', '\n⚙️ Demo 3: Configuração'));
  console.log('─'.repeat(50));
  
  try {
    const result = await runCommand(['config']);
    console.log(colorLog('green', '✅ Comando: selena config'));
    console.log(colorLog('blue', '📤 Output:'));
    console.log(result.stdout);
  } catch (error) {
    console.log(colorLog('red', '❌ Erro:'), error.message);
  }
}

async function demoAsk() {
  console.log(colorLog('cyan', '\n💬 Demo 4: Pergunta Única'));
  console.log('─'.repeat(50));
  
  try {
    const question = 'Qual a capital do Brasil?';
    console.log(colorLog('yellow', `📝 Pergunta: "${question}"`));
    
    const result = await runCommand(['ask', question, '--verbose']);
    console.log(colorLog('green', '✅ Comando: selena ask "Qual a capital do Brasil?" --verbose'));
    console.log(colorLog('blue', '📤 Output:'));
    console.log(result.stdout);
    
    if (result.stderr) {
      console.log(colorLog('magenta', '📤 Logs:'));
      console.log(result.stderr);
    }
  } catch (error) {
    console.log(colorLog('red', '❌ Erro:'), error.message);
  }
}

async function demoAskQuiet() {
  console.log(colorLog('cyan', '\n🤫 Demo 5: Pergunta Modo Silencioso'));
  console.log('─'.repeat(50));
  
  try {
    const question = '2 + 2 = ?';
    console.log(colorLog('yellow', `📝 Pergunta: "${question}" (modo --quiet)`));
    
    const result = await runCommand(['ask', question, '--quiet']);
    console.log(colorLog('green', '✅ Comando: selena ask "2 + 2 = ?" --quiet'));
    console.log(colorLog('blue', '📤 Output:'));
    console.log('💬', result.stdout.trim());
  } catch (error) {
    console.log(colorLog('red', '❌ Erro:'), error.message);
  }
}

async function demoErrorHandling() {
  console.log(colorLog('cyan', '\n🚨 Demo 6: Tratamento de Erros'));
  console.log('─'.repeat(50));
  
  // Testar sem API key
  console.log(colorLog('yellow', '🧪 Testando sem API key...'));
  const originalKey = process.env.SELENA_API_KEY;
  delete process.env.SELENA_API_KEY;
  
  try {
    const result = await runCommand(['ask', 'test']);
    console.log(colorLog('green', '✅ Comando: selena ask "test" (sem API key)'));
    console.log(colorLog('red', '📤 Stderr:'));
    console.log(result.stderr);
  } catch (error) {
    console.log(colorLog('red', '❌ Erro esperado:'), error.message);
  }
  
  // Restaurar API key
  process.env.SELENA_API_KEY = originalKey;
  
  // Testar com API key inválida
  console.log(colorLog('yellow', '\n🧪 Testando com API key inválida...'));
  process.env.SELENA_API_KEY = 'invalid-key-for-test';
  
  try {
    const result = await runCommand(['ask', 'test', '--quiet']);
    console.log(colorLog('green', '✅ Comando: selena ask "test" --quiet (API key inválida)'));
    console.log(colorLog('red', '📤 Stderr:'));
    console.log(result.stderr);
  } catch (error) {
    console.log(colorLog('red', '❌ Erro esperado:'), error.message);
  }
  
  // Restaurar API key original
  process.env.SELENA_API_KEY = originalKey;
}

async function demoPerformance() {
  console.log(colorLog('cyan', '\n⚡ Demo 7: Performance Test'));
  console.log('─'.repeat(50));
  
  const questions = [
    'O que é JavaScript?',
    'Explique async/await',
    'Como funciona o fetch API?'
  ];
  
  console.log(colorLog('yellow', `🏃‍♂️ Testando ${questions.length} perguntas sequenciais...`));
  
  const startTime = Date.now();
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(colorLog('blue', `\n📝 Pergunta ${i + 1}: ${question}`));
    
    try {
      const start = Date.now();
      const result = await runCommand(['ask', question, '--quiet']);
      const duration = Date.now() - start;
      
      console.log(colorLog('green'), `✅ Resposta recebida em ${duration}ms`);
      console.log(colorLog('cyan'), `💬 ${result.stdout.trim().substring(0, 100)}...`);
    } catch (error) {
      console.log(colorLog('red'), `❌ Erro na pergunta ${i + 1}:`, error.message);
    }
  }
  
  const totalDuration = Date.now() - startTime;
  const avgDuration = Math.round(totalDuration / questions.length);
  
  console.log(colorLog('yellow'), `\n📊 Estatísticas:`);
  console.log(colorLog('blue'), `⏱️  Tempo total: ${totalDuration}ms`);
  console.log(colorLog('blue'), `📊 Tempo médio: ${avgDuration}ms por request`);
}

async function demoIntegration() {
  console.log(colorLog('cyan', '\n🔗 Demo 8: Integração com Outras Ferramentas'));
  console.log('─'.repeat(50));
  
  // Demo de pipe
  console.log(colorLog('yellow'), '🧪 Testando integração com echo (simulado)...');
  
  try {
    // Simular: echo "pergunta" | selena ask
    const question = 'Explique o que é Node.js em uma frase';
    console.log(colorLog('blue'), `📝 Simulando: echo "${question}" | selena ask --quiet`);
    
    const result = await runCommand(['ask', question, '--quiet']);
    console.log(colorLog('green'), '✅ Resultado:');
    console.log(colorLog('cyan'), `💬 ${result.stdout.trim()}`);
  } catch (error) {
    console.log(colorLog('red'), '❌ Erro:', error.message);
  }
  
  // Demo de redirecionamento
  console.log(colorLog('yellow'), '\n🧪 Testando salvamento em arquivo (simulado)...');
  
  try {
    const question = 'Gere um JSON válido com nome e idade';
    console.log(colorLog('blue'), `📝 Simulando: selena ask "${question}" > output.json`);
    
    const result = await runCommand(['ask', question]);
    console.log(colorLog('green'), '✅ JSON gerado:');
    console.log(colorLog('cyan'), result.stdout.trim());
  } catch (error) {
    console.log(colorLog('red'), '❌ Erro:', error.message);
  }
}

async function main() {
  console.log(colorLog('bright'), colorLog('magenta'), '\n🤖 Selena AI SDK - CLI Examples');
  console.log(colorLog('cyan'), 'Demonstrações práticas da linha de comando\n');
  
  // Verificar API key
  if (!process.env.SELENA_API_KEY) {
    console.log(colorLog('red'), '❌ SELENA_API_KEY não configurada');
    console.log(colorLog('yellow'), '💡 Execute: export SELENA_API_KEY=sua_chave_aqui');
    console.log(colorLog('yellow'), '🔗 Obtenha sua key em: https://elaxi.xyz/dashboard\n');
    process.exit(1);
  }
  
  // Executar demonstrações
  const demos = [
    demoVersion,
    demoHelp,
    demoConfig,
    demoAsk,
    demoAskQuiet,
    demoErrorHandling,
    demoPerformance,
    demoIntegration
  ];
  
  for (const demo of demos) {
    try {
      await demo();
    } catch (error) {
      console.log(colorLog('red'), `❌ Erro na demo: ${error.message}`);
    }
    
    // Pequena pausa entre demos
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(colorLog('bright'), colorLog('green'), '\n✅ Todas as demonstrações concluídas!');
  console.log(colorLog('cyan'), '\n📚 Para mais informações:');
  console.log(colorLog('blue'), '📖 Documentação: https://elaxinc.github.io/selena-ai-sdk/');
  console.log(colorLog('blue'), '🐛 Issues: https://github.com/elaxinc/selena-ai-sdk/issues');
  console.log(colorLog('blue'), '💬 Dashboard: https://elaxi.xyz/dashboard\n');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(colorLog('red'), '❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

export { main as runCLIDemos };