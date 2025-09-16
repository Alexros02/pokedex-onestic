import { useEffect, useState } from 'react';
import Card from '../Components/card';
import CardList from '../Components/card-list';
import ViewSwitch from '../Components/view-switch';
import { getPokemonSimpleDetails } from '../services/pokedex-service';
import type { PokemonSimpleDetails } from '../types';

const HomePage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [pokemons, setPokemons] = useState<PokemonSimpleDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  useEffect(() => {
    const load = async () => {
      try {
        // Carga inicial: primeros 12 Pokémon por id global
        const ids = Array.from({ length: 15 }, (_, i) => i + 1);
        const result = await Promise.all(ids.map(id => getPokemonSimpleDetails(id)));
        setPokemons(result);
      } catch (error) {
        console.error('Error cargando Pokémon:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-4">Bienvenido a pokedex</h1>
        <ViewSwitch isGridView={isGridView} onToggle={toggleView} />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Cargando...</div>
      ) : isGridView ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {pokemons.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {pokemons.map(pokemon => (
            <CardList key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
