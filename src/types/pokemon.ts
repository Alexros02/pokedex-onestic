/**
 * Subconjunto de la respuesta de /pokemon/{id} de PokéAPI
 */
export type PokemonApi = {
  id: number;
  name: string;
  height: number; // decímetros
  weight: number; // hectogramos
  types: { slot: number; type: { name: string; url: string } }[];
  abilities: { ability: { name: string; url: string }; is_hidden: boolean; slot: number }[];
  stats: { base_stat: number; stat: { name: string } }[];
};

export type PokemonSimpleDetails = {
  id: number;
  name: string;
  types: string[];
  typeColor?: string;
  weight: number; // en hectogramos
  description?: string;
};

export type PokemonFullDetails = PokemonSimpleDetails & {
  height: number; // decímetros
  abilities: string[];
  stats: {
    hp?: number;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
  };
};
