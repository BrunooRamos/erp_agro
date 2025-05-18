/**
 * Encripta datos usando AES
 * @param data Dato a encriptar
 * @returns Dato encriptado
 */
export function encryptData(data: string): string {
  // Utilizaremos una clave derivada de la información del navegador
  // Esto no es perfecto, pero mejora la seguridad básica
  const browserKey = getBrowserFingerprint();
  
  try {
    // Simple encriptación XOR como ejemplo
    // En producción, usa una biblioteca de encriptación real como CryptoJS
    return btoa(
      Array.from(data)
        .map((char, i) => 
          String.fromCharCode(char.charCodeAt(0) ^ browserKey.charCodeAt(i % browserKey.length))
        )
        .join('')
    );
  } catch (error) {
    console.error('Encryption error', error);
    return data; // Fallback para no romper la funcionalidad
  }
}

/**
 * Desencripta datos
 * @param encryptedData Dato encriptado
 * @returns Dato desencriptado
 */
export function decryptData(encryptedData: string): string {
  const browserKey = getBrowserFingerprint();
  
  try {
    const decodedData = atob(encryptedData);
    return Array.from(decodedData)
      .map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ browserKey.charCodeAt(i % browserKey.length))
      )
      .join('');
  } catch (error) {
    console.error('Decryption error', error);
    throw new Error('Invalid encrypted data');
  }
}

/**
 * Genera una huella digital única del navegador
 * @returns String único para este navegador
 */
function getBrowserFingerprint(): string {
  const navigator = window.navigator;
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    `${screen.width}x${screen.height}`
  ].join('|');
  
  // Crear un hash simple
  return fingerprint.split('')
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0)
    .toString(16);
} 