/**
 * Servicio para trabajar con datos de Pokémon de la región de Sinnoh usando la PokéAPI.
 *
 * Incluye utilidades para:
 * - Imprimir por consola el Pokédex regional extendido de Sinnoh (id 6) en formato "<id>. <nombre>".
 * - Obtener detalles simples por `id` (nombre, tipos, color de tipo, id, peso, descripción).
 * - Obtener detalles completos por `id` (lo anterior + habilidades, altura y estadísticas base).
 *
 * Notas importantes:
 * - `entry_number` en `pokemon_entries` representa el número en el Pokédex regional,
 *   que puede diferir del ID global (el que se usa en endpoints como /pokemon/{id}).
 * - Para imprimir "<id>. <nombre>", se extrae el ID global a partir de la URL de `pokemon_species`.
 * - Para Sinnoh existen dos Pokédex en PokéAPI: original (id 5) y extendido (id 6).
 */
import type { PokedexResponse } from '../types/pokedex';
export type { PokedexEntry } from '../types/pokedex';
import type { PokemonApi, PokemonSimpleDetails, PokemonFullDetails } from '../types/pokemon';
export type { PokemonSimpleDetails, PokemonFullDetails } from '../types/pokemon';
import type { SpeciesApi } from '../types/species';

/**
 * Identificador del Pokédex de Sinnoh extendido (Platinum) en PokéAPI.
 * - 5: Sinnoh (original)
 * - 6: Sinnoh (extendido)
 */
const SINNOH_POKEDEX_ID = 6;

/**
 * Obtiene el Pokédex regional de Sinnoh (extendido) y lo imprime por consola.
 *
 * Salida por consola:
 * - Línea 1: Resumen con total de entradas y el id del Pokédex utilizado
 * - Resto: Una línea por Pokémon en formato "<id>. <nombre>" ordenado por id ascendente
 *
 * Ejemplo de salida:
 * [Sinnoh Pokédex] Total: 210 (pokedex/6)
 * 25. pikachu
 * 26. raichu
 * ...
 */
export async function fetchSinnohPokedex(): Promise<void> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${SINNOH_POKEDEX_ID}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = (await response.json()) as PokedexResponse;
    /**
     * Extrae el ID global de la especie desde la URL de `pokemon_species`.
     * Ejemplo: https://pokeapi.co/api/v2/pokemon-species/25/ => 25
     */
    /**
     * Extrae el ID global de la especie desde la URL de `pokemon_species`.
     * @param url URL del recurso `pokemon-species`.
     * @returns ID global de la especie o NaN si no se puede extraer.
     * @example
     *  extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/') // => 25
     */
    const extractIdFromUrl = (url: string): number => {
      const match = url.match(/\/(\d+)\/?$/);
      return match ? Number(match[1]) : NaN;
    };

    const entries = data.pokemon_entries
      .map(e => ({
        id: extractIdFromUrl(e.pokemon_species.url),
        name: e.pokemon_species.name,
      }))
      .filter(e => Number.isFinite(e.id))
      .sort((a, b) => a.id - b.id);

    // Salida resumida y detallada
    console.log(`[Sinnoh Pokédex] Total: ${entries.length} (pokedex/${SINNOH_POKEDEX_ID})`);
    console.log(entries.map(e => `${e.id}. ${e.name}`).join('\n'));
  } catch (error) {
    console.error('Error al obtener el Pokédex de Sinnoh:', error);
  }
}

// --- Nuevos servicios de detalles por ID ---

// Tipos importados desde src/types

/**
 * Devuelve la URL del artwork oficial para un Pokémon por su ID global.
 * @param id ID global del Pokémon.
 */
export function getPokemonArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Mapa de colores por tipo principal (aproximación de la paleta habitual).
 */
const TYPE_COLOR: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const TYPE_LABEL_ES: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

export function translateTypeToEs(typeName: string): string {
  return TYPE_LABEL_ES[typeName] ?? typeName;
}

/**
 * Obtiene el color asociado a un tipo primario.
 * @param primaryType nombre del tipo (por ejemplo, "fire").
 * @returns color hexadecimal o `undefined` si no existe mapeo.
 */
export function getTypeColor(primaryType: string | undefined): string | undefined {
  if (!primaryType) return undefined;
  return TYPE_COLOR[primaryType] ?? undefined;
}

/**
 * Busca una estadística concreta en el array de stats.
 * @param stats lista de estadísticas base devuelta por /pokemon/{id}.
 * @param key nombre de la estadística (hp, attack, defense, special-attack, special-defense, speed).
 * @returns valor base de la estadística o `undefined` si no existe.
 */
function getStat(stats: PokemonApi['stats'], key: string): number | undefined {
  const found = stats.find(s => s.stat.name === key);
  return found?.base_stat;
}

/**
 * Normaliza el texto descriptivo seleccionando español (si existe) o inglés y
 * colapsando espacios/saltos de línea.
 * @param flavorEntries lista de descripciones en distintos idiomas.
 * @returns descripción normalizada o `undefined` si no hay entradas.
 */
function normalizeFlavor(flavorEntries: SpeciesApi['flavor_text_entries']): string | undefined {
  const entry =
    flavorEntries?.find(e => e.language?.name === 'es') ||
    flavorEntries?.find(e => e.language?.name === 'en');
  if (!entry?.flavor_text) return undefined;
  // Colapsa cualquier espacio en blanco (incluye tabs, saltos de línea, etc.)
  return entry.flavor_text.replace(/\s+/g, ' ').trim();
}

// Tipos de salida reexportados desde src/types

/**
 * Obtiene detalles simples de un Pokémon por `id`.
 * Combina llamadas a `/pokemon/{id}` y `/pokemon-species/{id}` en paralelo.
 * @param id ID global del Pokémon.
 * @returns objeto con id, nombre, tipos, color del tipo principal, peso y descripción.
 * @throws Error si alguna llamada HTTP no es satisfactoria.
 */
export async function getPokemonSimpleDetails(id: number): Promise<PokemonSimpleDetails> {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);
  if (!pokemonRes.ok) throw new Error(`HTTP ${pokemonRes.status} (/pokemon/${id})`);
  if (!speciesRes.ok) throw new Error(`HTTP ${speciesRes.status} (/pokemon-species/${id})`);
  const [pokemon, species] = (await Promise.all([pokemonRes.json(), speciesRes.json()])) as [
    PokemonApi,
    SpeciesApi
  ];

  const types = pokemon.types
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map(t => t.type.name);

  return {
    id: pokemon.id,
    name: pokemon.name,
    types,
    typeColor: getTypeColor(types[0]),
    weight: pokemon.weight,
    description: normalizeFlavor(species.flavor_text_entries),
  };
}

// Tipos de salida reexportados desde src/types

/**
 * Obtiene detalles completos de un Pokémon por `id`.
 * Incluye las estadísticas base, habilidades y altura además de los detalles simples.
 * @param id ID global del Pokémon.
 * @returns objeto con detalles completos.
 * @throws Error si alguna llamada HTTP no es satisfactoria.
 */
export async function getPokemonFullDetails(id: number): Promise<PokemonFullDetails> {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);
  if (!pokemonRes.ok) throw new Error(`HTTP ${pokemonRes.status} (/pokemon/${id})`);
  if (!speciesRes.ok) throw new Error(`HTTP ${speciesRes.status} (/pokemon-species/${id})`);
  const [pokemon, species] = (await Promise.all([pokemonRes.json(), speciesRes.json()])) as [
    PokemonApi,
    SpeciesApi
  ];

  const types = pokemon.types
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map(t => t.type.name);

  const abilityEntries = pokemon.abilities.slice().sort((a, b) => a.slot - b.slot);
  const abilities = await Promise.all(
    abilityEntries.map(async a => {
      try {
        const res = await fetch(a.ability.url);
        if (!res.ok) return a.ability.name;
        const data = (await res.json()) as {
          names?: { language?: { name?: string }; name?: string }[];
        };
        const es = data.names?.find(n => n.language?.name === 'es')?.name;
        return es ?? a.ability.name;
      } catch {
        return a.ability.name;
      }
    })
  );

  const stats = {
    hp: getStat(pokemon.stats, 'hp'),
    attack: getStat(pokemon.stats, 'attack'),
    defense: getStat(pokemon.stats, 'defense'),
    specialAttack: getStat(pokemon.stats, 'special-attack'),
    specialDefense: getStat(pokemon.stats, 'special-defense'),
    speed: getStat(pokemon.stats, 'speed'),
  };

  return {
    id: pokemon.id,
    name: pokemon.name,
    types,
    typeColor: getTypeColor(types[0]),
    weight: pokemon.weight,
    description: normalizeFlavor(species.flavor_text_entries),
    height: pokemon.height,
    abilities,
    stats,
  };
}

/**
 * Lista Pokémon paginados usando el endpoint /pokemon con limit/offset y
 * devuelve los detalles simples de cada uno.
 * @param page Número de página (1-based).
 * @param pageSize Tamaño de página. Por defecto 15.
 * @returns items con detalles simples y total de elementos disponibles.
 */
export async function getPokemonPage(
  page: number,
  pageSize: number = 15
): Promise<{ items: PokemonSimpleDetails[]; total: number }> {
  const safePage = Math.max(1, Math.floor(page || 1));
  const safePageSize = Math.max(1, Math.floor(pageSize || 15));
  const offset = (safePage - 1) * safePageSize;

  const listRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${safePageSize}&offset=${offset}`
  );
  if (!listRes.ok) throw new Error(`HTTP ${listRes.status} (/pokemon list)`);
  const listData = (await listRes.json()) as {
    count: number;
    results: { name: string; url: string }[];
  };

  const extractIdFromUrl = (url: string): number => {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    return match ? Number(match[1]) : NaN;
  };

  const ids = listData.results
    .map(r => extractIdFromUrl(r.url))
    .filter(id => Number.isFinite(id)) as number[];

  const items = await Promise.all(ids.map(id => getPokemonSimpleDetails(id)));
  return { items, total: listData.count };
}

// --- Paginación limitada al Pokédex de Sinnoh (extendido id 6) ---

let cachedSinnohIdsPromise: Promise<number[]> | undefined;

export async function getSinnohGlobalIds(): Promise<number[]> {
  if (!cachedSinnohIdsPromise) {
    cachedSinnohIdsPromise = (async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokedex/${SINNOH_POKEDEX_ID}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} (/pokedex/${SINNOH_POKEDEX_ID})`);
      const data = (await res.json()) as PokedexResponse;
      const extractIdFromUrl = (url: string): number => {
        const match = url.match(/\/(\d+)\/?$/);
        return match ? Number(match[1]) : NaN;
      };
      const ids = data.pokemon_entries
        .map(e => extractIdFromUrl(e.pokemon_species.url))
        .filter(id => Number.isFinite(id)) as number[];
      // Ordenar por id ascendente para una paginación estable
      ids.sort((a, b) => a - b);
      return ids;
    })();
  }
  return cachedSinnohIdsPromise;
}

/**
 * Pagina exclusivamente sobre los Pokémon del Pokédex de Sinnoh (extendido).
 */
export async function getSinnohPokemonPage(
  page: number,
  pageSize: number = 15
): Promise<{ items: PokemonSimpleDetails[]; total: number }> {
  const safePage = Math.max(1, Math.floor(page || 1));
  const safePageSize = Math.max(1, Math.floor(pageSize || 15));
  const ids = await getSinnohGlobalIds();
  const total = ids.length;
  const start = (safePage - 1) * safePageSize;
  const end = Math.min(start + safePageSize, total);
  const pageIds = ids.slice(start, end);
  const items = await Promise.all(pageIds.map(id => getPokemonSimpleDetails(id)));
  return { items, total };
}

export async function getPokemonData(ids: number[]): Promise<PokemonSimpleDetails[]> {
  return Promise.all(ids.map(id => getPokemonSimpleDetails(id)));
}

/**
 * Devuelve la lista de nombres de tipos que existen en el Pokédex de Sinnoh.
 * Optimiza llamadas usando el endpoint de tipos e intersección con los IDs de Sinnoh.
 */
export async function getSinnohTypeNames(): Promise<string[]> {
  const sinnohIds = await getSinnohGlobalIds();
  const setSinnoh = new Set(sinnohIds);
  const listRes = await fetch('https://pokeapi.co/api/v2/type');
  if (!listRes.ok) throw new Error(`HTTP ${listRes.status} (/type)`);
  const listData = (await listRes.json()) as { results: { name: string; url: string }[] };

  const detailPromises = listData.results.map(async t => {
    const res = await fetch(t.url);
    if (!res.ok) return undefined;
    const data = (await res.json()) as {
      name: string;
      pokemon: { pokemon: { name: string; url: string } }[];
    };
    const hasInSinnoh = data.pokemon.some(p => {
      const match = p.pokemon.url.match(/\/pokemon\/(\d+)\/?$/);
      const id = match ? Number(match[1]) : NaN;
      return Number.isFinite(id) && setSinnoh.has(id);
    });
    return hasInSinnoh ? data.name : undefined;
  });

  const names = (await Promise.all(detailPromises)).filter(
    (n): n is string => typeof n === 'string'
  );

  // Orden fijo por nombre para estabilidad visual
  names.sort((a, b) => a.localeCompare(b));
  return names;
}

/**
 * Devuelve los IDs globales de Pokémon de Sinnoh que pertenecen al tipo indicado.
 */
export async function getSinnohIdsByType(typeName: string): Promise<number[]> {
  const sinnohIds = await getSinnohGlobalIds();
  const setSinnoh = new Set(sinnohIds);
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} (/type/${typeName})`);
  const data = (await res.json()) as {
    pokemon: { pokemon: { url: string } }[];
  };
  const ids = data.pokemon
    .map(p => {
      const m = p.pokemon.url.match(/\/pokemon\/(\d+)\/?$/);
      return m ? Number(m[1]) : NaN;
    })
    .filter(id => Number.isFinite(id) && setSinnoh.has(id)) as number[];
  ids.sort((a, b) => a - b);
  return ids;
}
