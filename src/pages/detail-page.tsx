import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailCard from '../Components/detail-card';
import { useEffect, useState } from 'react';
import { getPokemonFullDetails } from '../services/pokedex-service';
import type { PokemonFullDetails } from '../types';

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<PokemonFullDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const numericId = Number(id);
        const data = await getPokemonFullDetails(numericId);
        setPokemon(data);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el Pokémon');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </button>
      </div>
      {isLoading && <div className="text-center text-gray-700 dark:text-gray-300">Cargando...</div>}
      {error && !isLoading && (
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      )}
      {pokemon && !isLoading && !error && <DetailCard pokemon={pokemon} />}
    </div>
  );
};

export default DetailPage;
