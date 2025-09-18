/**
 * Utilidades para manejar colores de acento usados en componentes de tarjetas.
 */

/**
 * Convierte un color hexadecimal a RGB.
 * @param hex Color en formato hexadecimal (con o sin `#`).
 * @returns Objeto `{ r, g, b }` o `undefined` si el color no es válido.
 */
export const hexToRgb = (
  hex: string | undefined
): { r: number; g: number; b: number } | undefined => {
  if (!hex) return undefined;
  const clean = hex.replace('#', '');

  // Soporte para formato corto de 3 caracteres (p. ej., #F73 -> #FF7733)
  const expanded =
    clean.length === 3
      ? clean
          .split('')
          .map(char => char + char)
          .join('')
      : clean;

  const bigint = parseInt(expanded, 16);
  if (Number.isNaN(bigint)) return undefined;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

/**
 * Convierte un color hexadecimal a RGBA con transparencia.
 * @param hex Color en formato hexadecimal (con o sin `#`).
 * @param alpha Valor de transparencia en rango [0, 1].
 * @returns Cadena `rgba(r, g, b, a)` o `undefined` si el color no es válido.
 */
export const toRgba = (hex: string | undefined, alpha: number): string | undefined => {
  const rgb = hexToRgb(hex);
  if (!rgb) return undefined;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * Configuración de colores de acento derivada de un color base.
 */
export interface AccentColorConfig {
  accent: string | undefined;
  accentBg20: string | undefined;
  accentBorder30: string | undefined;
  accentShadow50: string | undefined;
  accentShadow55: string | undefined;
  accentHaloStrong: string | undefined;
  accentHaloSoft: string | undefined;
  accentHaloAltStrong: string | undefined;
  accentHaloAltSoft: string | undefined;
}

/**
 * Genera una configuración completa de colores de acento a partir de un color base.
 * @param typeColor Color base (hexadecimal) del tipo de Pokémon.
 * @returns Objeto `AccentColorConfig` con variantes de opacidad predefinidas.
 */
export const generateAccentColors = (typeColor: string | undefined): AccentColorConfig => {
  return {
    accent: typeColor,
    accentBg20: toRgba(typeColor, 0.2),
    accentBorder30: toRgba(typeColor, 0.3),
    accentShadow50: toRgba(typeColor, 0.5),
    accentShadow55: toRgba(typeColor, 0.55),
    accentHaloStrong: toRgba(typeColor, 0.4),
    accentHaloSoft: toRgba(typeColor, 0.3),
    accentHaloAltStrong: toRgba(typeColor, 0.3),
    accentHaloAltSoft: toRgba(typeColor, 0.2),
  };
};
