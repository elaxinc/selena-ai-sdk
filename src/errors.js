/**
 * Classes de erro customizadas para o Selena AI SDK
 */

export class SelenaError extends Error {
  constructor(message, code = 'SELENA_ERROR', details = null) {
    super(message);
    this.name = 'SelenaError';
    this.code = code;
    this.details = details;
  }
}

export class AuthenticationError extends SelenaError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class APIError extends SelenaError {
  constructor(message, status = null, response = null) {
    super(message, 'API_ERROR', { status, response });
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

export class NetworkError extends SelenaError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends SelenaError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
    this.field = field;
  }
}