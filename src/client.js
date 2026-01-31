/**
 * Client principal do Selena AI SDK
 * Coordena HTTP client, logger e APIs específicas
 */

import { createHttpClient } from './utils/http.js';
import { Logger } from './utils/logger.js';
import { ChatAPI } from './chat.js';
import { ValidationError } from './errors.js';

export class SelenaAI {
  /**
   * Cria uma nova instância do cliente Selena AI
   * @param {Object} options - Opções de configuração
   * @param {string} options.apiKey - Chave de API (obrigatório)
   * @param {string} [options.baseURL='https://elaxi.xyz'] - URL base da API
   * @param {string} [options.logging='none'] - Nível de log: none, error, info, debug
   */
  constructor(options = {}) {
    // Validação
    if (!options.apiKey) {
      throw new ValidationError(
        'API key is required. Get yours at https://elaxi.xyz/dashboard',
        'apiKey'
      );
    }
    
    if (typeof options.apiKey !== 'string') {
      throw new ValidationError('API key must be a string', 'apiKey');
    }
    
    // Configuração
    this.apiKey = options.apiKey;
    this.baseURL = options.baseURL || 'https://elaxi.xyz';
    
    // Logger
    this.logger = new Logger(options.logging || 'none');
    
    // HTTP client
    this.http = createHttpClient({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      logger: this.logger.level !== 'none' ? this.logger : null
    });
    
    // APIs
    this.chat = new ChatAPI(this.http, this.logger);
    
    this.logger?.info('Selena AI client initialized', {
      baseURL: this.baseURL,
      logLevel: options.logging || 'none'
    });
  }
  
  /**
   * Atualiza o nível de logging
   * @param {string} level - Novo nível de log: none, error, info, debug
   */
  setLogLevel(level) {
    this.logger = new Logger(level);
    this.http = createHttpClient({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      logger: level !== 'none' ? this.logger : null
    });
    
    this.chat = new ChatAPI(this.http, this.logger);
    
    this.logger?.info('Log level updated', { newLevel: level });
  }
  
  /**
   * Obtém informações sobre o cliente
   * @returns {Object} Informações do cliente
   */
  getInfo() {
    return {
      baseURL: this.baseURL,
      logLevel: this.logger.level,
      version: '1.0.0'
    };
  }
}