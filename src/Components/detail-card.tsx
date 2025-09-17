import { getPokemonArtworkUrl } from '../services/pokedex-service';
import type { PokemonFullDetails } from '../types';
import { generateAccentColors } from '../utils/color-utils';
import FavButton from './fav-button';

type DetailCardProps = {
  pokemon: PokemonFullDetails;
};

const DetailCard = ({ pokemon }: DetailCardProps) => {
  const accentColors = generateAccentColors(pokemon.typeColor);
  const p = {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    weightKg: (pokemon.weight / 10).toFixed(1) + ' kg',
    heightM: (pokemon.height / 10).toFixed(1) + ' m',
    abilities: pokemon.abilities,
    statsLabeled: [
      { label: 'PS', value: pokemon.stats.hp ?? 0 },
      { label: 'Ataque', value: pokemon.stats.attack ?? 0 },
      { label: 'Defensa', value: pokemon.stats.defense ?? 0 },
      { label: 'Atq. Esp.', value: pokemon.stats.specialAttack ?? 0 },
      { label: 'Def. Esp.', value: pokemon.stats.specialDefense ?? 0 },
      { label: 'Velocidad', value: pokemon.stats.speed ?? 0 },
    ],
    description: pokemon.description,
  };
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-xl">
      {/* halos decorativos */}
      <div
        className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full blur-3xl"
        style={{
          backgroundImage:
            accentColors.accentHaloStrong && accentColors.accentHaloSoft
              ? `linear-gradient(to bottom right, ${accentColors.accentHaloStrong}, ${accentColors.accentHaloSoft})`
              : undefined,
        }}
      ></div>
      <div
        className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundImage:
            accentColors.accentHaloAltStrong && accentColors.accentHaloAltSoft
              ? `linear-gradient(to top right, ${accentColors.accentHaloAltStrong}, ${accentColors.accentHaloAltSoft})`
              : undefined,
        }}
      ></div>

      <div className="relative z-10 p-5 sm:p-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-around gap-3 sm:gap-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{p.name}</h1>
            <div className="flex items-center gap-2">
              {p.types.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border backdrop-blur"
                  style={{
                    backgroundColor: accentColors.accentBg20,
                    borderColor: accentColors.accentBorder30,
                    color: accentColors.accent,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-gray-800 dark:text-gray-200">
                #{p.id.toString().padStart(3, '0')}
              </span>
              <FavButton pokemonId={p.id} />
             
            </div>
          </div>
        </div>

        {/* Cuerpo: imagen + info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="relative mx-auto w-full md:order-2">
            <img
              src={getPokemonArtworkUrl(p.id)}
              alt={p.name}
              className="max-h-full object-contain"
              style={{
                filter: accentColors.accentShadow55
                  ? `drop-shadow(0 12px 36px ${accentColors.accentShadow55})`
                  : undefined,
              }}
              loading="lazy"
            />

            {/* medidas */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200">
                Peso: {p.weightKg}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200">
                Altura: {p.heightM}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 md:order-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">{p.description}</p>

            {/* Habilidades */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-2 tracking-wide text-gray-800 dark:text-gray-200">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {p.abilities.map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-3 tracking-wide text-gray-800 dark:text-gray-200">
                Estadísticas
              </h2>
              <div className="space-y-3">
                {p.statsLabeled.map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-700 dark:text-gray-300">{s.label}</div>
                    <div className="flex-1 h-2 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-300/80 to-amber-400/80"
                        style={{ width: `${Math.min(s.value, 100)}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs text-gray-700 dark:text-gray-300">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
