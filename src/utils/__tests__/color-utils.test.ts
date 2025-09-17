import { describe, it, expect } from 'vitest';
import { hexToRgb, toRgba, generateAccentColors } from '../color-utils';

describe('hexToRgb', () => {
  it('debe convertir un color hexadecimal válido con #', () => {
    const result = hexToRgb('#FF5733');
    expect(result).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('debe convertir un color hexadecimal válido sin #', () => {
    const result = hexToRgb('FF5733');
    expect(result).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('debe convertir colores en minúsculas', () => {
    const result = hexToRgb('#ff5733');
    expect(result).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('debe convertir colores de 3 caracteres', () => {
    const result = hexToRgb('#F73');
    expect(result).toEqual({ r: 255, g: 119, b: 51 });
  });

  it('debe devolver undefined para colores inválidos', () => {
    expect(hexToRgb('invalid')).toBeUndefined();
    expect(hexToRgb('#GGGGGG')).toBeUndefined();
    expect(hexToRgb('')).toBeUndefined();
  });

  it('debe devolver undefined para undefined', () => {
    expect(hexToRgb(undefined)).toBeUndefined();
  });

  it('debe manejar colores con valores extremos', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('toRgba', () => {
  it('debe convertir un color hexadecimal a RGBA con alpha', () => {
    const result = toRgba('#FF5733', 0.5);
    expect(result).toBe('rgba(255, 87, 51, 0.5)');
  });

  it('debe manejar alpha de 0', () => {
    const result = toRgba('#FF5733', 0);
    expect(result).toBe('rgba(255, 87, 51, 0)');
  });

  it('debe manejar alpha de 1', () => {
    const result = toRgba('#FF5733', 1);
    expect(result).toBe('rgba(255, 87, 51, 1)');
  });

  it('debe devolver undefined para colores inválidos', () => {
    expect(toRgba('invalid', 0.5)).toBeUndefined();
    expect(toRgba(undefined, 0.5)).toBeUndefined();
  });

  it('debe manejar colores de 3 caracteres', () => {
    const result = toRgba('#F73', 0.8);
    expect(result).toBe('rgba(255, 119, 51, 0.8)');
  });
});

describe('generateAccentColors', () => {
  it('debe generar colores de accent para un color válido', () => {
    const result = generateAccentColors('#FF5733');

    expect(result.accent).toBe('#FF5733');
    expect(result.accentBg20).toBe('rgba(255, 87, 51, 0.2)');
    expect(result.accentBorder30).toBe('rgba(255, 87, 51, 0.3)');
    expect(result.accentShadow50).toBe('rgba(255, 87, 51, 0.5)');
    expect(result.accentShadow55).toBe('rgba(255, 87, 51, 0.55)');
    expect(result.accentHaloStrong).toBe('rgba(255, 87, 51, 0.4)');
    expect(result.accentHaloSoft).toBe('rgba(255, 87, 51, 0.3)');
    expect(result.accentHaloAltStrong).toBe('rgba(255, 87, 51, 0.3)');
    expect(result.accentHaloAltSoft).toBe('rgba(255, 87, 51, 0.2)');
  });

  it('debe manejar colores sin #', () => {
    const result = generateAccentColors('FF5733');

    expect(result.accent).toBe('FF5733');
    expect(result.accentBg20).toBe('rgba(255, 87, 51, 0.2)');
  });

  it('debe manejar undefined devolviendo undefined en todas las propiedades', () => {
    const result = generateAccentColors(undefined);

    expect(result.accent).toBeUndefined();
    expect(result.accentBg20).toBeUndefined();
    expect(result.accentBorder30).toBeUndefined();
    expect(result.accentShadow50).toBeUndefined();
    expect(result.accentShadow55).toBeUndefined();
    expect(result.accentHaloStrong).toBeUndefined();
    expect(result.accentHaloSoft).toBeUndefined();
    expect(result.accentHaloAltStrong).toBeUndefined();
    expect(result.accentHaloAltSoft).toBeUndefined();
  });

  it('debe manejar colores inválidos devolviendo undefined en todas las propiedades', () => {
    const result = generateAccentColors('invalid-color');

    expect(result.accent).toBe('invalid-color');
    expect(result.accentBg20).toBeUndefined();
    expect(result.accentBorder30).toBeUndefined();
    expect(result.accentShadow50).toBeUndefined();
    expect(result.accentShadow55).toBeUndefined();
    expect(result.accentHaloStrong).toBeUndefined();
    expect(result.accentHaloSoft).toBeUndefined();
    expect(result.accentHaloAltStrong).toBeUndefined();
    expect(result.accentHaloAltSoft).toBeUndefined();
  });

  it('debe generar colores consistentes para el mismo input', () => {
    const color = '#7AC74C'; // Verde tipo Planta
    const result1 = generateAccentColors(color);
    const result2 = generateAccentColors(color);

    expect(result1).toEqual(result2);
  });
});
