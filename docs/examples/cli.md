# CLI Examples

Exemplos práticos de uso da linha de comando do Selena AI SDK.

## 🚀 Setup Inicial

### Instalação Global

```bash
# Com npm
npm install -g selena-ai-sdk

# Verificar instalação
selena --version

# Mostrar ajuda
selena --help
```

### Configurar API Key

```bash
# Método 1: Variável de ambiente
export SELENA_API_KEY=sk-your-api-key-here

# Método 2: No arquivo de perfil
echo 'export SELENA_API_KEY=sk-your-api-key-here' >> ~/.bashrc
source ~/.bashrc

# Método 3: Comando de ajuda
selena config
```

## 💬 Chat Interativo

### Sessão Básica

```bash
$ selena chat

🤖 Selena AI - Modo Interativo
Digite "sair" para encerrar a conversa
Digite "limpar" para limpar a tela

✨ Você: Olá! Como você está?
🧠 Selena: Olá! Estou ótima, obrigado por perguntar. Sou a Selena, uma assistente de IA...

✨ Você: Me explique o que é JavaScript
🧠 Selena: JavaScript é uma linguagem de programação...

✨ Você: sair

👋 Até logo!
```

### Chat com Logs Detalhados

```bash
$ selena chat --verbose

[2024-01-31T10:00:00.000Z] [Selena DEBUG] → POST https://elaxi.xyz/api/chat
[2024-01-31T10:00:00.001Z] [Selena DEBUG] Body: {"model":"selena-pro-v1","message":"Olá"}
[2024-01-31T10:00:01.200Z] [Selena DEBUG] ← 200 (1199ms)
[2024-01-31T10:00:01.201Z] [Selena DEBUG] Response: {"response":"Olá! Como posso ajudar?"}

🤖 Selena AI - Modo Interativo
...

✨ Você: Olá
🧠 Selena: Olá! Como posso ajudar?
```

### Comandos Especiais

Durante o chat, você pode usar:

```bash
✨ Você: help

📖 Comandos disponíveis:
  sair, exit   - Encerrar o chat
  limpar, clear - Limpar a tela
  help         - Mostrar esta ajuda

✨ Você: limpar
(tela limpa)

🤖 Selena AI - Modo Interativo
Digite "sair" para encerrar a conversa
...
```

## 📝 Pergunta Única

### Básico

```bash
$ selena ask "Qual a capital do Brasil?"

🧠 Selena: A capital do Brasil é Brasília.
```

### Com Logs

```bash
$ selena ask "Explique machine learning" --verbose

[2024-01-31T10:00:00.000Z] [Selena DEBUG] → POST https://elaxi.xyz/api/chat
[2024-01-31T10:00:01.500Z] [Selena DEBUG] ← 200 (1500ms)
🧠 Selena: Machine learning é um campo da inteligência artificial...
```

### Modo Silencioso

```bash
$ selena ask "2 + 2?" --quiet
4
```

## 🔄 Scripts e Automação

### Script de Backup

```bash
#!/bin/bash
# backup-chat.sh

API_KEY="$1"
BACKUP_FILE="$2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -z "$API_KEY" ] || [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <api_key> <backup_file>"
  exit 1
fi

echo "🔄 Iniciando backup da conversa..."

BACKUP_CONTENT="=== Backup Selena AI - $TIMESTAMP ==="
BACKUP_CONTENT="$BACKUP_CONTENT\n\n📋 Resumo do dia:"

# Perguntar sobre resumo do dia
SUMMARY=$(SELENA_API_KEY="$API_KEY" selena ask "Gere um resumo das conversas de hoje em 3 tópicos" --quiet)
BACKUP_CONTENT="$BACKUP_CONTENT\n$SUMMARY"

BACKUP_CONTENT="$BACKUP_CONTENT\n\n💡 Insights:"
INSIGHTS=$(SELENA_API_KEY="$API_KEY" selena ask "Forneça 2 insights importantes da conversa de hoje" --quiet)
BACKUP_CONTENT="$BACKUP_CONTENT\n$INSIGHTS"

BACKUP_CONTENT="$BACKUP_CONTENT\n\n📅 Gerado em: $(date)"

echo -e "$BACKUP_CONTENT" > "$BACKUP_FILE"
echo "✅ Backup salvo em: $BACKUP_FILE"

# Uso:
# ./backup-chat.sh sk-your-key backups/chat_$(date +%Y%m%d).txt
```

### Script de Teste

```bash
#!/bin/bash
# test-selena.sh

API_KEY="${1:-$SELENA_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo "❌ ERRO: SELENA_API_KEY não configurada"
  echo "💡 Execute: export SELENA_API_KEY=sua_chave_aqui"
  exit 1
fi

echo "🧪 Testando Selena AI SDK..."
echo "================================"

# Teste 1: Pergunta simples
echo "📝 Teste 1: Pergunta simples"
RESULT1=$(SELENA_API_KEY="$API_KEY" selena ask "Qual é 2 + 2?" --quiet)
if [ "$RESULT1" = "4" ]; then
  echo "✅ Teste 1 passou"
else
  echo "❌ Teste 1 falhou: resposta foi '$RESULT1'"
fi

# Teste 2: Pergunta complexa
echo "📝 Teste 2: Pergunta complexa"
RESULT2=$(SELENA_API_KEY="$API_KEY" selena ask "Explique recursão em uma frase" --quiet)
if [ -n "$RESULT2" ]; then
  echo "✅ Teste 2 passou"
  echo "📝 Resposta: $RESULT2"
else
  echo "❌ Teste 2 falhou: sem resposta"
fi

# Teste 3: Validação de API key
echo "📝 Teste 3: Validação de API key"
if ! SELENA_API_KEY="invalid" selena ask "test" 2>/dev/null; then
  echo "✅ Teste 3 passou: validação funcionando"
else
  echo "❌ Teste 3 falhou: validação não funcionando"
fi

echo "================================"
echo "🏁 Testes concluídos!"
```

### Script de Perguntas em Lote

```bash
#!/bin/bash
# batch-questions.sh

API_KEY="${1:-$SELENA_API_KEY}"
QUESTIONS_FILE="${2:-questions.txt}"
OUTPUT_FILE="${3:-answers.txt}"

if [ -z "$API_KEY" ]; then
  echo "❌ ERRO: API key não fornecida"
  echo "Uso: $0 <api_key> [questions_file] [output_file]"
  exit 1
fi

if [ ! -f "$QUESTIONS_FILE" ]; then
  echo "❌ ERRO: Arquivo de perguntas não encontrado: $QUESTIONS_FILE"
  exit 1
fi

echo "🔄 Processando perguntas de: $QUESTIONS_FILE"
echo "📝 Salvando respostas em: $OUTPUT_FILE"
echo ""

# Limpar arquivo de saída
> "$OUTPUT_FILE"

# Processar cada linha do arquivo
line_num=0
while IFS= read -r question; do
  line_num=$((line_num + 1))
  
  # Pular linhas vazias
  if [ -z "$question" ]; then
    continue
  fi
  
  echo "📝 Pergunta $line_num: $question"
  
  # Fazer a pergunta
  answer=$(SELENA_API_KEY="$API_KEY" selena ask "$question" --quiet 2>/dev/null)
  
  if [ $? -eq 0 ]; then
    echo "💬 Resposta: $answer"
    echo "Q$line_num: $question" >> "$OUTPUT_FILE"
    echo "A$line_num: $answer" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
  else
    echo "❌ Erro ao processar pergunta $line_num"
    echo "Q$line_num: $question" >> "$OUTPUT_FILE"
    echo "A$line_num: [ERRO]" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
  fi
  
  # Pequena pausa entre perguntas
  sleep 1
done < "$QUESTIONS_FILE"

echo ""
echo "✅ Processamento concluído!"
echo "📁 Resultados salvos em: $OUTPUT_FILE"
```

### Exemplo de questions.txt:

```
Qual é a capital do Brasil?
Explique o que é machine learning
Como funciona o JavaScript?
O que é uma API REST?
Diferença entre SQL e NoSQL
```

## 🔗 Integração com Outras Ferramentas

### Com fzf (Fuzzy Finder)

```bash
#!/bin/bash
# chat-fzf.sh

PROMPTS_FILE="prompts.txt"

# Criar arquivo de prompts se não existir
if [ ! -f "$PROMPTS_FILE" ]; then
  echo "Criando arquivo de prompts..."
  cat > "$PROMPTS_FILE" << EOF
Explique o que é JavaScript
Como funciona o async/await?
O que é programação funcional?
Diferença entre var, let e const
Explique closures em JavaScript
Como funciona o hoisting?
O que é DOM manipulation?
Event loop em Node.js
Promises vs Callbacks
Diferença entre ES5 e ES6
EOF
fi

# Selecionar prompt com fzf
PROMPT=$(cat "$PROMPTS_FILE" | fzf --header="Selecione um prompt:" --height=10 --layout=reverse)

if [ -n "$PROMPT" ]; then
  echo "🤔 Perguntando: $PROMPT"
  selena ask "$PROMPT"
else
  echo "❌ Nenhum prompt selecionado"
fi
```

### Com tmux (Sessão Persistente)

```bash
#!/bin/bash
# persistent-chat.sh

SESSION_NAME="selena-chat"

# Verificar se a sessão já existe
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "📱 Anexando à sessão existente: $SESSION_NAME"
  tmux attach-session -t "$SESSION_NAME"
else
  echo "🆕 Criando nova sessão persistente..."
  tmux new-session -d -s "$SESSION_NAME" "selena chat"
  
  # Configurar títulos e layouts
  tmux rename-window -t "$SESSION_NAME:0" "Chat"
  
  echo "✅ Sessão criada: $SESSION_NAME"
  echo "📱 Anexando à sessão..."
  tmux attach-session -t "$SESSION_NAME"
fi
```

### Com grep e sed (Processamento)

```bash
#!/bin/bash
# process-responses.sh

OUTPUT_FILE="responses.txt"

echo "🔄 Coletando respostas..."
echo ""

# Fazer múltiplas perguntas e processar
questions=(
  "O que é Node.js?"
  "Explique Express.js"
  "Como funciona MongoDB?"
  "O que é React?"
)

for i in "${!questions[@]}"; do
  question="${questions[$i]}"
  
  echo "📝 Pergunta $((i+1)): $question"
  
  # Obter resposta
  response=$(selena ask "$question" --quiet)
  
  # Extrair palavras-chave com grep
  keywords=$(echo "$response" | grep -o -E '\b(Node|Express|MongoDB|React|JavaScript|API|database)\b' | sort -u | tr '\n' ', ' | sed 's/,$//')
  
  # Contar palavras
  word_count=$(echo "$response" | wc -w)
  
  # Salvar resultados
  echo "Q$((i+1)): $question" >> "$OUTPUT_FILE"
  echo "A$((i+1)): $response" >> "$OUTPUT_FILE"
  echo "K$((i+1)): $keywords" >> "$OUTPUT_FILE"
  echo "W$((i+1)): $word_count palavras" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "💬 $word_count palavras, palavras-chave: $keywords"
  echo ""
  
  sleep 1
done

echo "✅ Respostas processadas e salvas em: $OUTPUT_FILE"
```

## 🌐 Webhooks e APIs

### Server Webhook Receiver

```bash
#!/bin/bash
# webhook-server.sh

PORT="${1:-3000}"
LOG_FILE="webhook.log"

echo "🌐 Iniciando servidor webhook na porta $PORT..."
echo "📝 Logs serão salvos em: $LOG_FILE"

# Criar servidor simples com nc (netcat)
while true; do
  echo "🔄 Aguardando request..." | tee -a "$LOG_FILE"
  
  # Receber request
  request=$(nc -l -p "$PORT")
  
  echo "📥 Request recebido: $(date)" | tee -a "$LOG_FILE"
  echo "$request" >> "$LOG_FILE"
  
  # Extrair mensagem (assumindo JSON simples)
  message=$(echo "$request" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$message" ]; then
    echo "💬 Processando mensagem: $message" | tee -a "$LOG_FILE"
    
    # Fazer pergunta para Selena
    response=$(selena ask "$message" --quiet)
    
    echo "🤖 Resposta da Selena: $response" | tee -a "$LOG_FILE"
    
    # Enviar resposta
    echo "HTTP/1.1 200 OK"
    echo "Content-Type: application/json"
    echo "Access-Control-Allow-Origin: *"
    echo ""
    echo "{\"response\":\"$response\",\"timestamp\":\"$(date -Iseconds)\"}"
  else
    echo "❌ Nenhuma mensagem encontrada no request" | tee -a "$LOG_FILE"
    
    echo "HTTP/1.1 400 Bad Request"
    echo "Content-Type: application/json"
    echo ""
    echo "{\"error\":\"No message found\"}"
  fi
  
  echo "---" >> "$LOG_FILE"
  echo ""
done
```

### Cliente Webhook

```bash
#!/bin/bash
# webhook-client.sh

WEBHOOK_URL="${1:-http://localhost:3000}"

echo "🌐 Enviando mensagens para: $WEBHOOK_URL"

messages=(
  "Olá, como você está?"
  "Explique machine learning"
  "Qual a capital da França?"
)

for message in "${messages[@]}"; do
  echo "📤 Enviando: $message"
  
  response=$(curl -s -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"$message\"}")
  
  echo "📥 Resposta: $response"
  echo ""
  
  sleep 1
done
```

## 📊 Monitoramento e Logs

### CLI com Logs Detalhados

```bash
#!/bin/bash
# debug-cli.sh

API_KEY="${1:-$SELENA_API_KEY}"
LOG_FILE="selena-debug.log"

echo "🔍 Modo Debug - Selena AI CLI"
echo "📝 Logs detalhados em: $LOG_FILE"
echo ""

# Função de log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Testar diferentes comandos
log "🔄 Iniciando testes debug"

log "📝 Test 1: Verificar versão"
selena --version 2>&1 | tee -a "$LOG_FILE"

log "📝 Test 2: Pergunta simples"
echo "Pergunta: O que é 2 + 2?" | tee -a "$LOG_FILE"
selena ask "O que é 2 + 2?" --verbose 2>&1 | tee -a "$LOG_FILE"

log "📝 Test 3: Pergunta com erro"
echo "Pergunta com API key inválida:" | tee -a "$LOG_FILE"
SELENA_API_KEY="invalid" selena ask "test" --verbose 2>&1 | tee -a "$LOG_FILE"

log "🏁 Testes concluídos"
echo "📁 Logs salvos em: $LOG_FILE"
```

### Performance Monitor

```bash
#!/bin/bash
# perf-monitor.sh

OUTPUT_FILE="performance-$(date +%Y%m%d_%H%M%S).csv"

echo "📊 Monitor de Performance - Selena AI CLI"
echo "📝 Resultados em: $OUTPUT_FILE"

# Cabeçalho do CSV
echo "timestamp,command,duration_ms,status" > "$OUTPUT_FILE"

commands=(
  "selena ask \"Qual é 2 + 2?\" --quiet"
  "selena ask \"Explique JS\" --quiet"
  "selena ask \"O que é AI?\" --quiet"
)

for cmd in "${commands[@]}"; do
  echo "⏱️ Executando: $cmd"
  
  start_time=$(date +%s%N)
  
  if eval "$cmd" >/dev/null 2>&1; then
    status="success"
  else
    status="error"
  fi
  
  end_time=$(date +%s%N)
  duration=$(( (end_time - start_time) / 1000000 )) # Converter para ms
  
  echo "📊 $duration ms - $status"
  
  # Salvar no CSV
  timestamp=$(date -Iseconds)
  echo "$timestamp,\"$cmd\",$duration,$status" >> "$OUTPUT_FILE"
  
  sleep 1
done

echo ""
echo "✅ Monitoramento concluído!"
echo "📁 Resultados em: $OUTPUT_FILE"

# Resumo
echo ""
echo "📊 Resumo de Performance:"
awk -F',' 'NR>1 {sum+=$3; count++} END {printf "Média: %.2f ms\n", sum/count}' "$OUTPUT_FILE"
```

## ✅ Boas Práticas

### Variáveis de Ambiente

```bash
# ~/.selena-config
export SELENA_API_KEY="sk-your-api-key"
export SELENA_BASE_URL="https://elaxi.xyz"
export SELENA_TIMEOUT="30"
export SELENA_LOG_LEVEL="info"

# Carregar no .bashrc
echo "source ~/.selena-config" >> ~/.bashrc
source ~/.bashrc
```

### Alias Úteis

```bash
# ~/.bashrc ou ~/.zshrc

# Alias para comandos comuns
alias s-ask='selena ask'
alias s-chat='selena chat'
alias s-debug='selena chat --verbose'

# Alias para perguntas específicas
alias s-explain='selena ask "Explique em termos simples"'
alias s-debug-code='selena ask "Ajude a debugar este código:"'

# Função para chat com contexto
s-context() {
  echo "Contexto: $1"
  selena ask "Considerando o contexto '$1', $2"
}

# Função para tradução
s-translate() {
  selena ask "Traduza '$1' para inglês" --quiet
}

# Função para resumir
s-summarize() {
  selena ask "Resuma em 3 pontos: $1" --quiet
}
```

### Error Handling

```bash
#!/bin/bash
# robust-cli.sh

API_KEY="${1:-$SELENA_API_KEY}"

# Função de tratamento de erro
handle_error() {
  local exit_code=$1
  local command="$2"
  
  if [ $exit_code -ne 0 ]; then
    echo "❌ Erro no comando: $command"
    echo "💡 Possíveis soluções:"
    echo "   1. Verifique sua API key: echo \$SELENA_API_KEY"
    echo "   2. Teste conectividade: ping elaxi.xyz"
    echo "   3. Verifique status: curl -I https://elaxi.xyz"
    exit $exit_code
  fi
}

# Usar tratamento de erro
trap 'handle_error $? "$BASH_COMMAND"' ERR

# Executar comandos
echo "🔄 Testando conectividade..."
curl -s "https://elaxi.xyz" > /dev/null
handle_error $? "curl elaxi.xyz"

echo "🔄 Testando API..."
selena ask "test" --quiet > /dev/null
handle_error $? "selena ask test"

echo "✅ Todos os testes passaram!"
```

---

Estes exemplos cobrem desde o uso básico até automação avançada com a CLI do Selena AI SDK. Para mais informações, consulte a [documentação completa](/guide/cli).