import { useState } from 'react';
import Card from '../Components/card';
import CardList from '../Components/card-list';
import ViewSwitch from '../Components/view-switch';



const FavoritePage = () => {
  const [isGridView, setIsGridView] = useState(true);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Datos de ejemplo para los Pokémon
  const pokemonData = [
    {
      id: 1,
      name: 'Pikachu',
      type: 'Eléctrico',
      weight: '6.0 kg',
      description: 'Pokémon ágil que acumula electricidad en las mejillas.',
    },
    {
      id: 2,
      name: 'Charizard',
      type: 'Fuego/Volador',
      weight: '90.5 kg',
      description: 'Pokémon dragón que puede volar a gran altura.',
    },
    {
      id: 3,
      name: 'Blastoise',
      type: 'Agua',
      weight: '85.5 kg',
      description: 'Pokémon tortuga con cañones de agua en su caparazón.',
    },
    {
      id: 4,
      name: 'Venusaur',
      type: 'Planta/Veneno',
      weight: '100.0 kg',
      description: 'Pokémon planta que libera un aroma dulce.',
    },
    {
      id: 5,
      name: 'Mewtwo',
      type: 'Psíquico',
      weight: '122.0 kg',
      description: 'Pokémon legendario creado genéticamente.',
    },
    {
      id: 6,
      name: 'Mew',
      type: 'Psíquico',
      weight: '4.0 kg',
      description: 'Pokémon mítico considerado el ancestro de todos.',
    },
  ];

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-4">Favoritos</h1>
        <ViewSwitch isGridView={isGridView} onToggle={toggleView} />
      </div>

      {isGridView ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pokemonData.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {pokemonData.map(pokemon => (
            <CardList key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;