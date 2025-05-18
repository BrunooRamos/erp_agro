interface RateLimitOptions {
  maxAttempts: number;
  timeWindow: number; // en milisegundos
}

class RateLimiter {
  private attempts: Record<string, number[]> = {};
  
  /**
   * Verifica si una acción ha excedido el límite de intentos
   * @param key Identificador único para la acción (ej: 'login', 'register')
   * @param options Opciones de configuración
   * @returns true si está bloqueado, false si puede continuar
   */
  isRateLimited(key: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    
    // Inicializar array de intentos si no existe
    if (!this.attempts[key]) {
      this.attempts[key] = [];
    }
    
    // Filtrar intentos dentro de la ventana de tiempo
    this.attempts[key] = this.attempts[key].filter(
      timestamp => now - timestamp < options.timeWindow
    );
    
    // Verificar si ha excedido el máximo de intentos
    if (this.attempts[key].length >= options.maxAttempts) {
      return true; // Está bloqueado
    }
    
    // Registrar el intento actual
    this.attempts[key].push(now);
    return false; // No está bloqueado
  }
  
  /**
   * Obtiene el tiempo restante en milisegundos hasta que se pueda intentar nuevamente
   */
  getTimeRemaining(key: string, options: RateLimitOptions): number {
    if (!this.attempts[key] || this.attempts[key].length === 0) {
      return 0;
    }
    
    const now = Date.now();
    const oldestAttempt = this.attempts[key][0];
    const timeElapsed = now - oldestAttempt;
    
    return Math.max(0, options.timeWindow - timeElapsed);
  }
  
  /**
   * Reinicia los intentos para una clave específica
   */
  reset(key: string): void {
    delete this.attempts[key];
  }
}

// Exportar instancia singleton
export const rateLimiter = new RateLimiter(); 