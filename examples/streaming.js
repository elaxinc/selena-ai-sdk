/**
 * Exemplo de uso do Selena AI SDK com streaming
 * Demonstra como receber respostas em tempo real
 */

import { SelenaAI } from '../src/index.js';

// Configura API key (substitua pela sua)
const apiKey = process.env.SELENA_API_KEY;

if (!apiKey) {
  console.error('❌ Erro: SELENA_API_KEY não encontrada');
  console.error('Execute: export SELENA_API_KEY=sua_chave_aqui');
  process.exit(1);
}

async function streamingExample() {
  console.log('🚀 Exemplo de Streaming com Selena AI SDK\n');
  
  const client = new SelenaAI({
    apiKey,
    logging: 'debug'
  });
  
  try {
    console.log('📝 Pergunta: "Me explique sobre inteligência artificial"');
    console.log('🧠 Selena (streaming): ');
    
    await client.chat.completions({
      model: 'selena-pro-v1',
      message: 'Me explique sobre inteligência artificial',
      stream: true,
      onToken: (token) => {
        // Cada token é exibido assim que chega
        process.stdout.write(token);
      }
    });
    
    console.log('\n\n✅ Streaming concluído!');
    
    // Exemplo sem streaming para comparação
    console.log('\n📝 Mesma pergunta sem streaming:');
    console.log('🧠 Selena (normal): ');
    
    const response = await client.chat.completions({
      model: 'selena-pro-v1',
      message: 'Me explique sobre inteligência artificial'
    });
    
    console.log(response.response);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

streamingExample();