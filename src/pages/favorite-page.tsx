import { useEffect, useState } from 'react';
import Card from '../Components/card';
import CardList from '../Components/card-list';
import ViewSwitch from '../Components/view-switch';
import { useFavorites } from '../contexts/FavoritesContext';
import type { PokemonSimpleDetails } from '../types';
import { getPokemonData } from '../services/pokedex-service';

const FavoritePage = () => {
  const [isGridView, setIsGridView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pokedex:view:isGrid');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const { favoriteIds } = useFavorites();
  const [pokemonData, setPokemonData] = useState<PokemonSimpleDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toggleView = () => {
    setIsGridView(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pokedex:view:isGrid', JSON.stringify(next));
      } catch (error) {
        console.warn('No se pudo guardar la preferencia de vista', error);
      }
      return next;
    });
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const pokemonData = await getPokemonData(favoriteIds);
        setPokemonData(pokemonData);
      } catch (error) {
        console.error('Error cargando Pokémon:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [favoriteIds]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-4">Favoritos</h1>
        <ViewSwitch isGridView={isGridView} onToggle={toggleView} />
      </div>

      {isGridView ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {pokemonData.map((pokemon: PokemonSimpleDetails) => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {pokemonData.map((pokemon: PokemonSimpleDetails) => (
            <CardList key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
