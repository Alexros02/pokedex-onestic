/**
 * Tipados para la respuesta del endpoint /pokedex/{id} de PokéAPI
 */
export type PokedexEntry = {
  entry_number: number;
  pokemon_species: {
    name: string;
    url: string;
  };
};

export type PokedexResponse = {
  name: string;
  id: number;
  pokemon_entries: PokedexEntry[];
};
