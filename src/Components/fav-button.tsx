import { Star } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

interface FavButtonProps {
  pokemonId: number;
}

const FavButton = ({ pokemonId }: FavButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    toggleFavorite(pokemonId);
  };

  return (
    <button
      type="button"
      aria-label="Añadir a favoritos"
      aria-pressed={isFavorite(pokemonId)}
      onClick={handleClick}
      className={`   inline-flex items-center justify-center h-10 w-10 rounded-full border backdrop-blur transition shadow-md ${
        isFavorite(pokemonId)
          ? 'border-yellow-400/60 bg-yellow-300/30 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-300/40'
          : 'border-white/30 bg-white/20 text-yellow-500 dark:text-yellow-300 hover:bg-white/30'
      }`}
    >
      <Star className={`h-5 w-5 ${isFavorite(pokemonId) ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavButton;
