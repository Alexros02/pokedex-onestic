/**
 * Utilidades para manejo de cadenas.
 */

/**
 * Capitaliza la primera letra de una cadena manteniendo el resto igual.
 * Si recibe `undefined` o una cadena vacía, devuelve la entrada tal cual (o `""`).
 * @param text Cadena de entrada.
 * @returns Cadena con primera letra en mayúscula.
 */
export function capitalizeFirst(text: string | undefined): string {
  if (!text) return text ?? '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
