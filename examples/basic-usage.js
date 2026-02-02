import { SelenaAI } from '../src/index.js';

// Configuração do cliente
const client = new SelenaAI({
  apiKey: process.env.SELENA_API_KEY,
  logging: 'info'
});

async function basicUsage() {
  console.log('🤖 Testando Selena AI SDK - Uso Básico\n');
  
  try {
    // Exemplo 1: Saudação simples
    console.log('📝 Enviando saudação...');
    const greeting = await client.chat.completions.create({
      model: 'selena-pro-v1',
      message: 'Olá! Como você está?'
    });
    console.log('💬 Resposta:', greeting.response);
    
    // Exemplo 2: Pergunta técnica
    console.log('\n📝 Fazendo pergunta técnica...');
    const technical = await client.chat.completions.create({
      message: 'Explique o que é JavaScript em uma frase.'
    });
    console.log('💬 Resposta:', technical.response);
    
    // Exemplo 3: Ajuda com código
    console.log('\n📝 Pedindo ajuda com código...');
    const codeHelp = await client.chat.completions.create({
      message: 'Como declarar uma função em JavaScript?'
    });
    console.log('💬 Resposta:', codeHelp.response);
    
    console.log('\n✅ Todos os testes básicos concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    
    if (error.code === 'AUTH_ERROR') {
      console.error('\n💡 Dica: Verifique se sua API key está configurada');
      console.error('   export SELENA_API_KEY=sua_chave_aqui');
    }
    
    process.exit(1);
  }
}

// Informações do cliente
console.log('ℹ️  Informações do Cliente:');
console.log(JSON.stringify(client.getInfo(), null, 2));
console.log('');

// Executar testes
basicUsage();