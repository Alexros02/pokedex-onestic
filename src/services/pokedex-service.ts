/**
 * Servicio de acceso a datos de Pokémon basado en PokéAPI.
 *
 * Funcionalidades principales:
 * - Listado del Pokédex de Sinnoh extendido (Platinum, id 6) y utilidades relacionadas
 * - Obtención de detalles simples y completos por `id` global de Pokémon
 * - Paginación general (endpoint `/pokemon`) y paginación restringida a Sinnoh
 * - Filtros de tipos para el conjunto de Pokémon pertenecientes al Pokédex de Sinnoh
 *
 * Consideraciones:
 * - El Pokédex regional y el `id` global difieren: algunas operaciones requieren extraer el `id` desde URLs
 *   de recursos (p. ej., `pokemon-species`) que contienen el `id` global al final.
 * - Existen dos Pokédex de Sinnoh en PokéAPI: id 5 (original) e id 6 (extendido). Este servicio usa el 6.
 * - Se utiliza caché en memoria para los IDs globales de Sinnoh con el objetivo de minimizar llamadas redundantes.
 */
import type { PokedexResponse } from '../types/pokedex';
export type { PokedexEntry } from '../types/pokedex';
import type { PokemonApi, PokemonSimpleDetails, PokemonFullDetails } from '../types/pokemon';
export type { PokemonSimpleDetails, PokemonFullDetails } from '../types/pokemon';
import type { SpeciesApi } from '../types/species';

/**
 * Identificador del Pokédex de Sinnoh extendido (Platinum) en PokéAPI.
 * @see https://pokeapi.co/api/v2/pokedex/6
 */
const SINNOH_POKEDEX_ID = 6;

/**
 * Obtiene el Pokédex de Sinnoh (extendido) y lo imprime por consola.
 *
 * Formato de salida:
 * - Primera línea: resumen con total de entradas y el id del Pokédex usado
 * - Resto de líneas: `<id>. <nombre>` ordenado por `id` global ascendente
 *
 * Ejemplo:
 * `[Sinnoh Pokédex] Total: 210 (pokedex/6)`
 * `25. pikachu`
 * `26. raichu`
 *
 * Manejo de errores: registra en consola si la llamada HTTP no es satisfactoria.
 */
export async function fetchSinnohPokedex(): Promise<void> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${SINNOH_POKEDEX_ID}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = (await response.json()) as PokedexResponse;
    /**
     * Extrae el `id` global de la URL de `pokemon-species`.
     * @param url URL con formato `.../pokemon-species/{id}/`
     * @returns `id` como número o `NaN` si no coincide el patrón
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

/**
 * Construye la URL del artwork oficial de un Pokémon.
 * @param id `id` global de Pokémon
 * @returns URL al sprite de artwork oficial
 */
export function getPokemonArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Mapa de colores por tipo principal (aproximación habitual). */
export const TYPE_COLOR: Record<string, string> = {
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
 * Obtiene el color hexadecimal asociado a un tipo primario.
 * @param primaryType nombre del tipo en minúsculas (p. ej., `fire`)
 * @returns color hexadecimal o `undefined` si no hay mapeo
 */
export function getTypeColor(primaryType: string | undefined): string | undefined {
  if (!primaryType) return undefined;
  return TYPE_COLOR[primaryType] ?? undefined;
}

/**
 * Obtiene el valor base de una estadística por nombre.
 * @param stats arreglo de estadísticas devuelto por `/pokemon/{id}`
 * @param key nombre interno de la estadística (`hp`, `attack`, `defense`, `special-attack`, `special-defense`, `speed`)
 * @returns valor base o `undefined` si no se encuentra
 */
function getStat(stats: PokemonApi['stats'], key: string): number | undefined {
  const found = stats.find(s => s.stat.name === key);
  return found?.base_stat;
}

/**
 * Normaliza la descripción de especie priorizando ES y, en su defecto, EN.
 * Colapsa espacios y saltos de línea para obtener una frase continua.
 * @param flavorEntries entradas de `flavor_text` por idioma
 * @returns descripción normalizada o `undefined` si no hay entradas válidas
 */
function normalizeFlavor(flavorEntries: SpeciesApi['flavor_text_entries']): string | undefined {
  const entry =
    flavorEntries?.find(e => e.language?.name === 'es') ||
    flavorEntries?.find(e => e.language?.name === 'en');
  if (!entry?.flavor_text) return undefined;
  // Colapsa cualquier espacio en blanco (incluye tabs, saltos de línea, etc.)
  return entry.flavor_text.replace(/\s+/g, ' ').trim();
}

/**
 * Obtiene detalles simples de un Pokémon combinando `/pokemon/{id}` y `/pokemon-species/{id}` en paralelo.
 *
 * Incluye: `id`, `name`, `types` (ordenados por `slot`), `typeColor`, `weight` y `description` normalizada.
 *
 * @param id `id` global del Pokémon
 * @returns detalles simples listos para mostrar en UI
 * @throws Error si alguna respuesta HTTP no es satisfactoria
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

/**
 * Obtiene detalles completos de un Pokémon.
 *
 * Extiende los detalles simples con: `height`, `abilities` (intentando traducir a ES si es posible)
 * y `stats` desglosadas (`hp`, `attack`, `defense`, `specialAttack`, `specialDefense`, `speed`).
 *
 * @param id `id` global del Pokémon
 * @returns detalles completos aptos para vistas de detalle
 * @throws Error si alguna respuesta HTTP no es satisfactoria
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
 * Lista Pokémon con paginación global (`/pokemon?limit&offset`) y devuelve sus detalles simples.
 * @param page número de página (base 1)
 * @param pageSize tamaño de página (por defecto, 15)
 * @returns `{ items, total }` donde `items` son detalles simples y `total` el conteo global
 * @throws Error si la respuesta de listado no es satisfactoria
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

/** Caché en memoria para los IDs globales del Pokédex de Sinnoh (extendido). */
let cachedSinnohIdsPromise: Promise<number[]> | undefined;

/**
 * Devuelve y cachea los IDs globales que forman el Pokédex de Sinnoh (extendido).
 * @returns array de `id` globales ordenados ascendentemente
 * @throws Error si la respuesta de `/pokedex/{id}` no es satisfactoria
 */
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
 * Pagina exclusivamente sobre los Pokémon presentes en el Pokédex de Sinnoh (extendido).
 * @param page número de página (base 1)
 * @param pageSize tamaño de página (por defecto, 15)
 * @returns `{ items, total }` donde `items` son detalles simples y `total` el número de Pokémon en Sinnoh
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
 * Lista los nombres de tipos que existen en el conjunto de Pokémon de Sinnoh (extendido).
 * Cruza el endpoint de tipos con el conjunto de IDs de Sinnoh para filtrar únicamente tipos presentes.
 * @returns nombres de tipos ordenados alfabéticamente
 * @throws Error si la respuesta del listado de tipos no es satisfactoria
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
 * Devuelve los `id` globales de Pokémon de Sinnoh que pertenecen al tipo indicado.
 * @param typeName nombre del tipo en minúsculas (p. ej., `fire`)
 * @returns array de `id` globales ordenados ascendentemente
 * @throws Error si la respuesta de `/type/{typeName}` no es satisfactoria
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
