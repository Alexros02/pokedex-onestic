import { ChevronRight, Star } from 'lucide-react';
import pikachuImg from '../assets/pikachu.png';

interface Pokemon {
  id: number;
  name: string;
  type: string;
  weight: string;
  description: string;
}

interface CardListProps {
  pokemon: Pokemon;
}

const CardList = ({ pokemon }: CardListProps) => {
  return (
    <>
      {/* Card estilo lista (horizontal) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-md">
        <div className="relative z-10 flex items-center gap-4 p-4 sm:p-5">
          <div className="hidden sm:flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl border border-white/20 bg-white/10 items-center justify-center">
            <img
              src={pikachuImg}
              alt="Pikachu"
              className="max-h-full max-w-full object-contain drop-shadow-[0_6px_16px_rgba(250,204,21,0.5)]"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-md sm:text-lg font-semibold truncate">{pokemon.name}</h3>
              <span className="inline-flex items-center rounded-full bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 text-[11px] font-medium border border-yellow-300/30 backdrop-blur">
                {pokemon.type}
              </span>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Peso: {pokemon.weight}
            </div>
            {/* descripcion que solo se muestra en tamaños de responsive lg y xl */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1 line-clamp-2 hidden sm:block">
              {pokemon.description}
            </p>
          </div>
          <button
            type="button"
            aria-label="Añadir a favoritos"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 bg-white/20 backdrop-blur text-yellow-600 dark:text-yellow-300 hover:bg-white/30 transition shadow-md"
          >
            <Star className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Ver detalles"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur transition text-gray-700 dark:text-gray-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CardList;
