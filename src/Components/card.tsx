import { getPokemonArtworkUrl } from '../services/pokedex-service';
import type { PokemonSimpleDetails } from '../types';
import { generateAccentColors } from '../utils/color-utils';
import { useNavigate } from 'react-router-dom';
import FavButton from './fav-button';

interface CardProps {
  pokemon: PokemonSimpleDetails;
}

const Card = ({ pokemon }: CardProps) => {
  const navigate = useNavigate();
  const accentColors = generateAccentColors(pokemon.typeColor);

  return (
    <>
      {/* Card estilo carta Pokémon (proporción vertical y tamaño fijo, mantiene estética glass) */}
      <div className="flex justify-center">
        <div
          className="relative w-72 h-[25rem] sm:w-80 sm:h-[25rem] rounded-2xl border  border-white/25 bg-white/30 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:bg-white/40 dark:hover:bg-white/10"
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
          {/* halos decorativos */}
          <div
            className="pointer-events-none absolute -top-24 -left-16 h-52 w-52 rounded-full blur-3xl"
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

          {/* cabecera */}
          <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">{pokemon.name}</h3>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border backdrop-blur"
              style={{
                backgroundColor: accentColors.accentBg20,
                borderColor: accentColors.accentBorder30,
                color: accentColors.accent,
              }}
            >
              {pokemon.types.join('/')}
            </span>
          </div>

          {/* área de imagen */}
          <div className="relative z-10 mx-4 mt-1 rounded-xl border border-white/20 bg-white/10 p-3 h-40 sm:h-44 flex items-center justify-center">
            <img
              src={getPokemonArtworkUrl(pokemon.id)}
              alt={pokemon.name}
              className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
              style={{
                filter: accentColors.accentShadow55
                  ? `drop-shadow(0 8px 24px ${accentColors.accentShadow55})`
                  : undefined,
              }}
              loading="lazy"
            />
          </div>

          {/* información */}
          <div className="relative z-10 px-4 pt-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Peso: {(pokemon.weight / 10).toFixed(1)} kg
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{pokemon.description}</p>
          </div>

          {/* pie con mini chips */}
          <div className="relative z-10 px-4 pb-4 pt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-gray-800 dark:text-gray-200">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>

          {/* botón favorito */}
          <div className="absolute bottom-3 right-3 z-30">
            <FavButton pokemonId={pokemon.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
