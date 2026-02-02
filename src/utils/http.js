/**
 * HTTP client usando fetch nativo do Node.js
 * Sem dependências externas como axios
 * Suporta timeouts, logging e tratamento de erros
 */

export function createHttpClient(config) {
  return async function request(endpoint, options = {}) {
    const onToken = options.onToken; // Callback para streaming
    const url = `${config.baseURL}${endpoint}`;
    const startTime = Date.now();
    
    if (config.logger) {
      config.logger.debug(`→ ${options.method || 'GET'} ${url}`);
      if (options.body) {
        try {
          config.logger.debug('Body:', JSON.parse(options.body));
        } catch {
          config.logger.debug('Body:', options.body);
        }
      }
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.text();
        } catch {
          errorData = response.statusText;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorData}`);
      }
      
 // Verificar se é streaming
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && (contentType.includes('text/plain') || contentType.includes('text/event-stream') || options.body?.includes('stream'))) {
        // Streaming response (Server-Sent Events)
        const text = await response.text();
        
        if (config.logger) {
          config.logger.debug('Raw streaming response:', text.substring(0, 200) + '...');
        }
        
        let fullResponse = '';
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6);
              if (jsonStr.trim() && jsonStr !== '[DONE]') {
                const jsonData = JSON.parse(jsonStr);
                const token = jsonData.response || jsonData.text || jsonData.content || jsonData.token || '';
                
                if (token) {
                  fullResponse += token;
                  
                  // Chama callback se existir
                  if (onToken && typeof onToken === 'function') {
                    onToken(token);
                  }
                }
              }
            } catch (e) {
              if (config.logger) {
                config.logger.debug('Failed to parse JSON line:', line);
              }
            }
          }
        }
        
        data = { response: fullResponse.trim() };
      } else {
        // Resposta JSON normal
        data = await response.json();
      }
      
      if (config.logger) {
        const duration = Date.now() - startTime;
        config.logger.debug(`← ${response.status} (${duration}ms)`);
        config.logger.debug('Response:', data);
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (config.logger) {
        config.logger.error('Request failed:', error.message);
      }
      throw error;
    }
  };
}