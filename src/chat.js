/**
 * Chat API implementation para Selena AI
 * Implementa o endpoint /api/chat
 */

import { APIError, ValidationError } from './errors.js';

export class ChatAPI {
  constructor(http, logger) {
    this.http = http;
    this.logger = logger;
  }
  
  /**
   * Cria uma completion de chat
   * @param {Object} params - Parâmetros da requisição
   * @param {string} params.model - Modelo a ser usado (padrão: 'selena-pro-v1')
   * @param {string} params.message - Mensagem/prompt para a IA (obrigatório)
   * @param {boolean} [params.stream=false] - Habilita streaming de resposta
   * @param {Function} [params.onToken] - Callback para cada token (quando stream=true)
   * @returns {Promise<Object>} Resposta da API
   */
  async completions(params) {
    // Validação
    if (!params.message) {
      throw new ValidationError('message parameter is required', 'message');
    }
    
    if (typeof params.message !== 'string') {
      throw new ValidationError('message must be a string', 'message');
    }
    
    if (params.model && typeof params.model !== 'string') {
      throw new ValidationError('model must be a string', 'model');
    }
    
    this.logger?.info('Creating chat completion', { 
      model: params.model || 'selena-pro-v1',
      messageLength: params.message.length,
      stream: params.stream || false
    });
    
    try {
      const requestBody = {
        model: params.model || 'selena-pro-v1',
        message: params.message
      };
      
      // Adiciona stream se solicitado
      if (params.stream) {
        requestBody.stream = true;
      }
      
      const response = await this.http('/api/chat?skd=true', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        onToken: params.onToken
      });
      
      this.logger?.info('Chat completion created successfully');
      return response;
    } catch (error) {
      this.logger?.error('Chat completion failed', error.message);
      
      if (error.message.includes('HTTP 401')) {
        throw new APIError('Invalid API key or authentication failed', 401);
      } else if (error.message.includes('HTTP 429')) {
        throw new APIError('Rate limit exceeded', 429);
      } else if (error.message.includes('HTTP 400')) {
        throw new ValidationError('Invalid request parameters', null);
      } else if (error.message.includes('HTTP')) {
        const status = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || 500);
        throw new APIError(`API request failed: ${error.message}`, status);
      } else {
        throw error;
      }
    }
  }
}