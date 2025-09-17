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
      className={`group/fav  relative inline-flex items-center  justify-center h-10 w-10 hover:w-24 rounded-full border backdrop-blur transition-all duration-300 shadow-md overflow-hidden ${
        isFavorite(pokemonId)
          ? 'border-yellow-400/60 bg-yellow-300/30 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-300/40'
          : 'border-white/30 bg-white/20 text-yellow-500 dark:text-yellow-300 hover:bg-white/30'
      }`}
    >
      <Star
        className={`h-5 w-5 transition-opacity duration-200 group-hover/fav:opacity-0 ${
          isFavorite(pokemonId) ? 'fill-current' : ''
        }`}
      />
      <span className="absolute left-0 top-0 h-full w-full flex items-center justify-center text-xs font-medium text-gray-800 dark:text-gray-200 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {isFavorite(pokemonId) ? 'Eliminar' : 'Añadir'}
      </span>
    </button>
  );
};

export default FavButton;
