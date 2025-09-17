import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getPokemonArtworkUrl,
  getTypeColor,
  translateTypeToEs,
  TYPE_COLOR,
  TYPE_LABEL_ES,
} from '../pokedex-service';

// Mock de fetch global
const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('getPokemonArtworkUrl', () => {
  it('debe generar URL correcta para un ID válido', () => {
    const result = getPokemonArtworkUrl(25);
    expect(result).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    );
  });

  it('debe generar URL correcta para ID 0', () => {
    const result = getPokemonArtworkUrl(0);
    expect(result).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png'
    );
  });

  it('debe generar URL correcta para ID grande', () => {
    const result = getPokemonArtworkUrl(1010);
    expect(result).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1010.png'
    );
  });
});

describe('getTypeColor', () => {
  it('debe devolver color correcto para tipo válido', () => {
    expect(getTypeColor('fire')).toBe('#EE8130');
    expect(getTypeColor('water')).toBe('#6390F0');
    expect(getTypeColor('grass')).toBe('#7AC74C');
  });

  it('debe devolver undefined para tipo no válido', () => {
    expect(getTypeColor('invalid')).toBeUndefined();
    expect(getTypeColor('')).toBeUndefined();
  });

  it('debe devolver undefined para undefined', () => {
    expect(getTypeColor(undefined)).toBeUndefined();
  });

  it('debe manejar todos los tipos definidos', () => {
    Object.keys(TYPE_COLOR).forEach(type => {
      expect(getTypeColor(type)).toBe(TYPE_COLOR[type]);
    });
  });
});

describe('translateTypeToEs', () => {
  it('debe traducir tipos válidos al español', () => {
    expect(translateTypeToEs('fire')).toBe('Fuego');
    expect(translateTypeToEs('water')).toBe('Agua');
    expect(translateTypeToEs('grass')).toBe('Planta');
    expect(translateTypeToEs('electric')).toBe('Eléctrico');
  });

  it('debe devolver el tipo original si no existe traducción', () => {
    expect(translateTypeToEs('unknown')).toBe('unknown');
    expect(translateTypeToEs('')).toBe('');
  });

  it('debe manejar todos los tipos definidos', () => {
    Object.keys(TYPE_LABEL_ES).forEach(type => {
      expect(translateTypeToEs(type)).toBe(TYPE_LABEL_ES[type]);
    });
  });
});

describe('TYPE_COLOR', () => {
  it('debe tener colores válidos en formato hexadecimal', () => {
    Object.values(TYPE_COLOR).forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('debe tener todos los tipos esperados', () => {
    const expectedTypes = [
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
      'ice',
      'fighting',
      'poison',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy',
    ];

    expectedTypes.forEach(type => {
      expect(TYPE_COLOR).toHaveProperty(type);
    });
  });
});

describe('TYPE_LABEL_ES', () => {
  it('debe tener traducciones para todos los tipos', () => {
    Object.keys(TYPE_COLOR).forEach(type => {
      expect(TYPE_LABEL_ES).toHaveProperty(type);
    });
  });

  it('debe tener traducciones no vacías', () => {
    Object.values(TYPE_LABEL_ES).forEach(translation => {
      expect(translation).toBeTruthy();
      expect(translation.length).toBeGreaterThan(0);
    });
  });
});

// Tests para funciones que requieren fetch (mockeadas)
describe('Funciones con fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPokemonSimpleDetails', () => {
    it('debe manejar respuesta exitosa', async () => {
      const mockPokemonData = {
        id: 25,
        name: 'pikachu',
        types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
        weight: 60,
      };

      const mockSpeciesData = {
        flavor_text_entries: [
          {
            flavor_text:
              'When it releases pent-up energy in a burst, the electric power is equal to a lightning bolt.',
            language: { name: 'en' },
          },
        ],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPokemonData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSpeciesData),
        });

      // Importar la función después del mock
      const { getPokemonSimpleDetails } = await import('../pokedex-service');

      const result = await getPokemonSimpleDetails(25);

      expect(result).toEqual({
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        typeColor: '#F7D02C',
        weight: 60,
        description:
          'When it releases pent-up energy in a burst, the electric power is equal to a lightning bolt.',
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon-species/25');
    });

    it('debe manejar error de red', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { getPokemonSimpleDetails } = await import('../pokedex-service');

      await expect(getPokemonSimpleDetails(25)).rejects.toThrow('Network error');
    });

    it('debe manejar respuesta HTTP no exitosa', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { getPokemonSimpleDetails } = await import('../pokedex-service');

      await expect(getPokemonSimpleDetails(999)).rejects.toThrow('HTTP 404 (/pokemon/999)');
    });
  });
});
