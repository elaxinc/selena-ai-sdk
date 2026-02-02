/**
 * Selena AI SDK - Export principal
 * SDK JavaScript moderno para integração com Selena AI
 */

// Classes principais
export { SelenaAI } from './client.js';

// APIs específicas
export { ChatAPI } from './chat.js';

// Utilitários
export { Logger } from './utils/logger.js';
export { createHttpClient } from './utils/http.js';

// Erros
export {
  SelenaError,
  AuthenticationError,
  APIError,
  NetworkError,
  ValidationError
} from './errors.js';

// Versão
export const VERSION = '1.0.0';