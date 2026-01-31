import { SelenaAI } from '../src/index.js';

// Demonstração de diferentes níveis de logging
async function loggingDemo() {
  console.log('🔍 Demonstração de Logging - Selena AI SDK\n');
  
  // Testar com diferentes níveis de log
  const logLevels = ['none', 'error', 'info', 'debug'];
  
  for (const level of logLevels) {
    console.log(`\n📊 Testando com logging="${level}":`);
    console.log('─'.repeat(40));
    
    // Criar cliente com nível específico
    const client = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: level
    });
    
    try {
      const response = await client.chat.completions.create({
        message: 'Responda com "ok" apenas'
      });
      
      console.log('✅ Response recebida:', response.response);
    } catch (error) {
      console.log('❌ Erro capturado:', error.message);
    }
  }
  
  console.log('\n🔧 Mudando logging em runtime:');
  console.log('─'.repeat(40));
  
  const dynamicClient = new SelenaAI({
    apiKey: process.env.SELENA_API_KEY,
    logging: 'none'
  });
  
  console.log('Iniciando sem logs...');
  await dynamicClient.chat.completions.create({
    message: 'Primeira mensagem sem logs'
  });
  
  console.log('Ativando debug logs...');
  dynamicClient.setLogLevel('debug');
  await dynamicClient.chat.completions.create({
    message: 'Segunda mensagem com debug'
  });
  
  console.log('Desativando logs...');
  dynamicClient.setLogLevel('none');
  await dynamicClient.chat.completions.create({
    message: 'Terceira mensagem sem logs novamente'
  });
}

// Demonstração de tratamento de erros com logs
async function errorLoggingDemo() {
  console.log('\n🚨 Demonstração de Error Logging:');
  console.log('─'.repeat(40));
  
  // Cliente com logging detalhado
  const client = new SelenaAI({
    apiKey: 'chave-invalida-para-teste', // API key inválida propositalmente
    logging: 'debug'
  });
  
  try {
    await client.chat.completions.create({
      message: 'Esta mensagem vai falhar'
    });
  } catch (error) {
    console.log('Erro capturado (esperado):', error.message);
  }
  
  // Testar validação com logs
  console.log('\nTestando validação com logging...');
  try {
    const validClient = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: 'info'
    });
    
    await validClient.chat.completions.create({
      message: '' // Mensagem vazia para testar validação
    });
  } catch (error) {
    console.log('Erro de validação (esperado):', error.message);
  }
}

// Performance com logs
async function performanceLoggingDemo() {
  console.log('\n⚡ Demonstração de Performance com Logging:');
  console.log('─'.repeat(40));
  
  const messages = [
    'Qual é 2 + 2?',
    'Explique recursão',
    'O que é uma API?',
    'Como funciona async/await?',
    'Diferença entre let e const?'
  ];
  
  // Testar performance com diferentes níveis de log
  for (const level of ['none', 'debug']) {
    console.log(`\n🏃‍♂️ Testando performance com logging="${level}":`);
    
    const client = new SelenaAI({
      apiKey: process.env.SELENA_API_KEY,
      logging: level
    });
    
    const startTime = Date.now();
    
    for (const message of messages) {
      try {
        await client.chat.completions.create({
          message: message.substring(0, 50) // Limitar para testes
        });
      } catch (error) {
        console.log(`❌ Erro em "${message.substring(0, 20)}...": ${error.message}`);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️  Duração total: ${duration}ms`);
    console.log(`📊 Média por request: ${Math.round(duration / messages.length)}ms`);
  }
}

// Função principal
async function main() {
  console.log('🔍 Selena AI SDK - Logging Examples\n');
  
  // Verificar se API key está configurada
  if (!process.env.SELENA_API_KEY) {
    console.error('❌ SELENA_API_KEY não configurada');
    console.error('💡 Execute: export SELENA_API_KEY=sua_chave_aqui');
    process.exit(1);
  }
  
  try {
    await loggingDemo();
    await errorLoggingDemo();
    await performanceLoggingDemo();
    
    console.log('\n✅ Demonstração de logging concluída!');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar demonstração
main();