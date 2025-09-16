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

/**
 * Obtiene el color asociado a un tipo primario.
 * @param primaryType nombre del tipo (por ejemplo, "fire").
 * @returns color hexadecimal o `undefined` si no existe mapeo.
 */
function getTypeColor(primaryType: string | undefined): string | undefined {
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

  const abilities = pokemon.abilities
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map(a => a.ability.name);

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
