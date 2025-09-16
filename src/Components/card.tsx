import { getPokemonArtworkUrl } from '../services/pokedex-service';
import { Star } from 'lucide-react';
import type { PokemonSimpleDetails } from '../types';

interface CardProps {
  pokemon: PokemonSimpleDetails;
}

const Card = ({ pokemon }: CardProps) => {
  const hexToRgb = (hex: string | undefined): { r: number; g: number; b: number } | undefined => {
    if (!hex) return undefined;
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    if (Number.isNaN(bigint)) return undefined;
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const toRgba = (hex: string | undefined, alpha: number): string | undefined => {
    const rgb = hexToRgb(hex);
    if (!rgb) return undefined;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  };

  const accent = pokemon.typeColor;
  const accentBg20 = toRgba(accent, 0.2);
  const accentBorder30 = toRgba(accent, 0.3);
  const accentShadow55 = toRgba(accent, 0.55);
  const accentHaloStrong = toRgba(accent, 0.4);
  const accentHaloSoft = toRgba(accent, 0.3);
  const accentHaloAltStrong = toRgba(accent, 0.3);
  const accentHaloAltSoft = toRgba(accent, 0.2);

  return (
    <>
      {/* Card estilo carta Pokémon (proporción vertical y tamaño fijo, mantiene estética glass) */}
      <div className="flex justify-center">
        <div className="relative w-72 h-[25rem] sm:w-80 sm:h-[25rem] rounded-2xl border border-white/25 bg-white/30 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* halos decorativos */}
          <div
            className="pointer-events-none absolute -top-24 -left-16 h-52 w-52 rounded-full blur-3xl"
            style={{
              backgroundImage:
                accentHaloStrong && accentHaloSoft
                  ? `linear-gradient(to bottom right, ${accentHaloStrong}, ${accentHaloSoft})`
                  : undefined,
            }}
          ></div>
          <div
            className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full blur-3xl"
            style={{
              backgroundImage:
                accentHaloAltStrong && accentHaloAltSoft
                  ? `linear-gradient(to top right, ${accentHaloAltStrong}, ${accentHaloAltSoft})`
                  : undefined,
            }}
          ></div>

          {/* cabecera */}
          <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">{pokemon.name}</h3>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border backdrop-blur"
              style={{
                backgroundColor: accentBg20,
                borderColor: accentBorder30,
                color: accent,
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
              className="max-h-full object-contain"
              style={{
                filter: accentShadow55 ? `drop-shadow(0 8px 24px ${accentShadow55})` : undefined,
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
          <button
            type="button"
            aria-label="Añadir a favoritos"
            className="absolute bottom-3 right-3 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 bg-white/20 backdrop-blur text-yellow-500 dark:text-yellow-300 hover:bg-white/30 transition shadow-md"
          >
            <Star className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
