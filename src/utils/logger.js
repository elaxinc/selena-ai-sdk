/**
 * Logger configurável para o Selena AI SDK
 * Suporta diferentes níveis de log: none, error, info, debug
 */

export class Logger {
  constructor(level = 'none') {
    this.level = level;
    this.levels = { 
      none: 0, 
      error: 1, 
      info: 2, 
      debug: 3 
    };
  }
  
  _shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }
  
  _format(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [Selena ${level.toUpperCase()}]`;
    console.log(prefix, message, ...args);
  }
  
  debug(message, ...args) {
    if (this._shouldLog('debug')) this._format('debug', message, ...args);
  }
  
  info(message, ...args) {
    if (this._shouldLog('info')) this._format('info', message, ...args);
  }
  
  error(message, ...args) {
    if (this._shouldLog('error')) this._format('error', message, ...args);
  }
}