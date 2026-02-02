# CLI Guide

Guia completo da linha de comando do Selena AI SDK.

## 🖥️ Instalação Global

```bash
# Com npm
npm install -g selena-ai-sdk

# Com yarn
yarn global add selena-ai-sdk

# Com pnpm
pnpm add -g selena-ai-sdk
```

## 🚀 Comandos Disponíveis

### `selena chat`

Inicia uma sessão de chat interativa.

```bash
selena chat [opções]
```

**Opções:**
- `-v, --verbose` - Mostrar logs detalhados
- `-q, --quiet` - Desativar logs

**Exemplos:**
```bash
# Chat normal
selena chat

# Com logs detalhados
selena chat --verbose

# Sem logs
selena chat --quiet

# Versão curta
selena chat -v
selena chat -q
```

### `selena ask <message>`

Faz uma única pergunta à Selena AI.

```bash
selena ask "sua mensagem aqui" [opções]
```

**Opções:**
- `-v, --verbose` - Mostrar logs detalhados
- `-q, --quiet` - Desativar logs

**Exemplos:**
```bash
# Pergunta simples
selena ask "Qual a capital do Brasil?"

# Com debug
selena ask "Explique machine learning" --verbose

# Sem logs
selena ask "2 + 2?" --quiet
```

### `selena config`

Mostra informações de configuração e como configurar a API key.

```bash
selena config
```

### `selena --version`

Mostra a versão do SDK.

```bash
selena --version
selena -v
```

### `selena --help`

Mostra a ajuda completa.

```bash
selena --help
selena -h
```

## 🎮 Modo Interativo

### Comandos Especiais

Durante o chat interativo, você pode usar:

| Comando | Descrição |
|---------|-----------|
| `sair` ou `exit` | Encerrar o chat |
| `limpar` ou `clear` | Limpar a tela |
| `help` | Mostrar ajuda |

### Exemplo de Sessão

```bash
$ selena chat --verbose

🤖 Selena AI - Modo Interativo
Digite "sair" para encerrar a conversa
Digite "limpar" para limpar a tela

✨ Você: Olá! Como você está?
🧠 Selena: Olá! Estou ótimo, obrigado por perguntar. Sou a Selena, uma assistente de IA pronta para ajudar. Como posso ser útil hoje?

✨ Você: Me explique o que é Node.js
🧠 Selena: Node.js é um runtime JavaScript que permite executar código JavaScript fora do navegador...

✨ Você: limpar
(tela limpa)

🤖 Selena AI - Modo Interativo
Digite "sair" para encerrar a conversa
Digite "limpar" para limpar a tela

✨ Você: sair

👋 Até logo!
```

## 🌈 Personalização

### Variáveis de Ambiente

A CLI respeita as seguintes variáveis:

```bash
# API Key (obrigatória)
export SELENA_API_KEY=sk-your-api-key-here

# URL base customizada (opcional)
export SELENA_BASE_URL=https://custom.api.com

# Timeout em segundos (padrão: 30)
export SELENA_TIMEOUT=60
```

### Cores e Stilos

A CLI usa `chalk` para cores. Você pode personalizar:

```bash
# Desativar cores
export NO_COLOR=1

# Forçar cores
export FORCE_COLOR=1
```

## 🔧 Uso Avançado

### Scripts com a CLI

**Script de Backup:**
```bash
#!/bin/bash
# backup-chat.sh

SELENA_API_KEY="$1"
BACKUP_FILE="$2"

if [ -z "$SELENA_API_KEY" ] || [ -z "$BACKUP_FILE" ]; then
  echo "Uso: $0 <api_key> <backup_file>"
  exit 1
fi

echo "Iniciando backup da conversa..."
selena ask "Gere um resumo das últimas conversas" --quiet > "$BACKUP_FILE"
echo "Backup salvo em: $BACKUP_FILE"
```

**Script de Teste:**
```bash
#!/bin/bash
# test-selena.sh

echo "Testando Selena AI SDK..."

# Testar 1: Pergunta simples
echo "Test 1: Pergunta simples"
selena ask "Qual é 2 + 2?" --quiet || echo "❌ Falha no Test 1"

# Testar 2: Pergunta complexa
echo "Test 2: Pergunta complexa"
selena ask "Explique recursão em programação" --quiet || echo "❌ Falha no Test 2"

# Testar 3: Validar API key
echo "Test 3: Validação de API key"
if ! SELENA_API_KEY="invalid" selena ask "test" 2>/dev/null; then
  echo "✅ Validação de API key funcionando"
else
  echo "❌ Falha na validação de API key"
fi

echo "Testes concluídos!"
```

### Integração com Outras Ferramentas

**Com fzf (fuzzy finder):**
```bash
#!/bin/bash
# chat-fzf.sh

PROMPTS_FILE="prompts.txt"

if [ ! -f "$PROMPTS_FILE" ]; then
  echo "Criando arquivo de prompts..."
  cat > "$PROMPTS_FILE" << EOF
Explique machine learning
Como funciona Node.js?
O que é programação funcional?
Diferença entre SQL e NoSQL
Como funciona uma API REST?
EOF
fi

PROMPT=$(cat "$PROMPTS_FILE" | fzf --header="Selecione um prompt:")

if [ -n "$PROMPT" ]; then
  echo "Perguntando: $PROMPT"
  selena ask "$PROMPT"
fi
```

**Com tmux (session persistente):**
```bash
#!/bin/bash
# persistent-chat.sh

SESSION_NAME="selena-chat"

if ! tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Criando nova sessão persistente..."
  tmux new-session -d -s "$SESSION_NAME" "selena chat"
fi

echo "Anexando à sessão: $SESSION_NAME"
tmux attach-session -t "$SESSION_NAME"
```

### Pipes e Redirection

**Salvar conversa:**
```bash
# Pergunta única para arquivo
selena ask "Me ajude a escrever um código em Python" > resposta.txt

# Chat interativo para arquivo (limitado)
selena chat | tee conversa.txt
```

**Processar respostas:**
```bash
# Contar palavras
selena ask "Escreva um parágrafo sobre IA" | wc -w

# Formatar JSON
selena ask "Gere um JSON válido" | python -m json.tool

# Extrair URLs
selena ask "Liste alguns sites úteis" | grep -o 'https://[^[:space:]]*'
```

## 🐛 Troubleshooting

### Erros Comuns

**"SELENA_API_KEY não encontrada":**
```bash
# Verificar se a variável existe
echo $SELENA_API_KEY

# Definir temporariamente
export SELENA_API_KEY=sua-chave

# Adicionar ao ~/.bashrc permanentemente
echo 'export SELENA_API_KEY=sua-chave' >> ~/.bashrc
source ~/.bashrc
```

**"Comando não encontrado":**
```bash
# Verificar instalação
npm list -g selena-ai-sdk

# Reinstalar
npm uninstall -g selena-ai-sdk
npm install -g selena-ai-sdk

# Ou usar npx
npx selena --help
```

**Problemas de permissão:**
```bash
# Verificar permissão
ls -la $(which selena)

# Corrigir permissão
chmod +x $(which selena)
```

**Conexão recusada:**
```bash
# Testar conectividade
curl -I https://elaxi.xyz

# Verificar proxy
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Testar sem proxy
unset HTTP_PROXY HTTPS_PROXY
selena ask "test"
```

### Debug Avançado

**Ativar verbosidade máxima:**
```bash
# Verbose mode
selena ask "test" --verbose

# Verbose + debug do Node
DEBUG=* selena ask "test" --verbose

# Com strace (Linux)
strace -e trace=network selena ask "test"
```

**Verificar instalação:**
```bash
# Versão
selena --version

# Path do executável
which selena

# Dependências
npm list -g selena-ai-sdk
```

## ⚡ Performance Tips

### Respostas Rápidas

Use `--quiet` para modo silencioso:
```bash
selena ask "question" --quiet
```

### Batch Processing

Processar múltiplas perguntas:
```bash
#!/bin/bash
# batch-ask.sh

QUESTIONS=(
  "O que é JavaScript?"
  "Explique async/await"
  "Como funciona o fetch API?"
)

for question in "${QUESTIONS[@]}"; do
  echo "P: $question"
  selena ask "$question" --quiet
  echo "---"
done
```

### Cache Local

Salvar respostas comuns:
```bash
#!/bin/bash
# cached-ask.sh

CACHE_DIR="$HOME/.selena-cache"
QUESTION="$1"

mkdir -p "$CACHE_DIR"

# Gerar hash da pergunta
HASH=$(echo "$QUESTION" | md5sum | cut -d' ' -f1)
CACHE_FILE="$CACHE_DIR/$HASH.txt"

if [ -f "$CACHE_FILE" ]; then
  echo "📦 Cache hit:"
  cat "$CACHE_FILE"
else
  echo "🌐 Cache miss:"
  selena ask "$QUESTION" --quiet | tee "$CACHE_FILE"
fi
```

## ✅ Checklist da CLI

- [ ] SDK instalado globalmente
- [ ] API key configurada
- [ ] Comandos básicos funcionando
- [ ] Chat interativo testado
- [ ] Scripts personalizados criados
- [ ] Troubleshooting conhecido

---

🎯 **Excelente!** Você dominou a CLI do Selena AI SDK. Continue para [API Reference](/api/client) ou veja mais [Exemplos](/examples/usage).