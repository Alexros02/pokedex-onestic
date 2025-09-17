/**
 * Utilidades para manejo de colores de accent en los componentes de tarjetas
 */

/**
 * Convierte un color hexadecimal a RGB
 * @param hex - Color en formato hexadecimal (con o sin #)
 * @returns Objeto con valores RGB o undefined si el color no es válido
 */
export const hexToRgb = (
  hex: string | undefined
): { r: number; g: number; b: number } | undefined => {
  if (!hex) return undefined;
  const clean = hex.replace('#', '');

  // Manejar colores de 3 caracteres (ej: #F73 -> #FF7733)
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
 * Convierte un color hexadecimal a RGBA con transparencia
 * @param hex - Color en formato hexadecimal (con o sin #)
 * @param alpha - Valor de transparencia (0-1)
 * @returns Color en formato RGBA o undefined si el color no es válido
 */
export const toRgba = (hex: string | undefined, alpha: number): string | undefined => {
  const rgb = hexToRgb(hex);
  if (!rgb) return undefined;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * Configuraciones de colores de accent para componentes de tarjetas
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
 * Genera todas las configuraciones de colores de accent basadas en un color base
 * @param typeColor - Color base del tipo de Pokémon
 * @returns Configuración completa de colores de accent
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
