# Chat API

A API de Chat permite integração completa com a Selena AI.

## Métodos

### `completions(params)`

Envia uma mensagem para a Selena AI e obtém uma resposta.

**Parâmetros:**
- `message` (string, obrigatório): Mensagem/prompt
- `model` (string, opcional): Modelo (padrão: `selena-pro-v1`)
- `stream` (boolean, opcional): Habilita streaming
- `onToken` (function, opcional): Callback para streaming

**Exemplo:**
```js
const response = await client.chat.completions({
  message: 'Olá, como você está?'
});
console.log(response.response);

// Com streaming
await client.chat.completions({
  message: 'Conte uma história',
  stream: true,
  onToken: (token) => process.stdout.write(token)
});
```

## Resposta

A resposta contém:
- `response` (string): Texto gerado pela IA

## Erros

Os seguintes erros podem ocorrer:
- `ValidationError`: Parâmetros inválidos
- `APIError`: Erros da API (401, 429, etc.)
- `NetworkError`: Problemas de conexão