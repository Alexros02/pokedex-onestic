import { ChevronRight } from 'lucide-react';
import { getPokemonArtworkUrl, translateTypeToEs } from '../services/pokedex-service';
import type { PokemonSimpleDetails } from '../types';
import { generateAccentColors } from '../utils/color-utils';
import { useNavigate } from 'react-router-dom';
import FavButton from './fav-button';

interface CardListProps {
  pokemon: PokemonSimpleDetails;
}

const CardList = ({ pokemon }: CardListProps) => {
  const navigate = useNavigate();
  const accentColors = generateAccentColors(pokemon.typeColor);
  return (
    <>
      {/* Card estilo lista (horizontal) */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/30 dark:bg-white/5 backdrop-blur-xl group transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:bg-white/40 dark:hover:bg-white/10 shadow-md cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/pokemon/${pokemon.id}`)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/pokemon/${pokemon.id}`);
          }
        }}
      >
        <div className="relative z-10 flex items-center gap-4 p-4 sm:p-5">
          {/* halos decorativos */}
          <div
            className="pointer-events-none absolute -top-24 -left-16 h-52 w-52 rounded-full blur-3xl "
            style={{
              backgroundImage:
                accentColors.accentHaloStrong && accentColors.accentHaloSoft
                  ? `linear-gradient(to bottom right, ${accentColors.accentHaloStrong}, ${accentColors.accentHaloSoft})`
                  : undefined,
            }}
          ></div>
          <div
            className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full blur-3xl"
            style={{
              backgroundImage:
                accentColors.accentHaloAltStrong && accentColors.accentHaloAltSoft
                  ? `linear-gradient(to top right, ${accentColors.accentHaloAltStrong}, ${accentColors.accentHaloAltSoft})`
                  : undefined,
            }}
          ></div>
          <div className="hidden sm:flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl    items-center justify-center">
            <img
              src={getPokemonArtworkUrl(pokemon.id)}
              alt={pokemon.name}
              className="max-h-full max-w-full object-contain"
              style={{
                filter: accentColors.accentShadow50
                  ? `drop-shadow(0 6px 16px ${accentColors.accentShadow50})`
                  : undefined,
              }}
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-md sm:text-lg font-semibold truncate">{pokemon.name}</h3>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border backdrop-blur"
                style={{
                  backgroundColor: accentColors.accentBg20,
                  borderColor: accentColors.accentBorder30,
                  color: accentColors.accent,
                }}
              >
                {pokemon.types.map(translateTypeToEs).join('/')}
              </span>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Peso: {(pokemon.weight / 10).toFixed(1)} kg
            </div>
            {/* descripcion que solo se muestra en tamaños de responsive lg y xl */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1 line-clamp-2 hidden sm:block">
              {pokemon.description}
            </p>
          </div>

          <div className="inline-flex items-center justify-center h-10 w-fit ml-auto">
            <FavButton pokemonId={pokemon.id} />
          </div>

          <button
            type="button"
            aria-label="Ver detalles"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur transition text-gray-700 dark:text-gray-200"
            onClick={e => {
              e.stopPropagation();
              navigate(`/pokemon/${pokemon.id}`);
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default CardList;
