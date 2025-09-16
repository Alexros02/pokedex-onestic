/**
 * Subconjunto de la respuesta de /pokemon-species/{id} de PokéAPI
 */
export type SpeciesApi = {
  color?: { name: string };
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
};
