import pikachuImg from '../assets/pikachu.png';
import { Star } from 'lucide-react';


interface PokemonDetail {
    id: number;
    name: string;
    types: string[];
    weight: string;
    height: string;
    abilities: string[];
    stats: { label: string; value: number }[];
    description: string;
  }
  
  const mockPokemon: PokemonDetail = {
    id: 25,
    name: 'Pikachu',
    types: ['Eléctrico'],
    weight: '6.0 kg',
    height: '0.4 m',
    abilities: ['Electricidad Estática', 'Pararrayos'],
    stats: [
      { label: 'PS', value: 35 },
      { label: 'Ataque', value: 55 },
      { label: 'Defensa', value: 40 },
      { label: 'Atq. Esp.', value: 50 },
      { label: 'Def. Esp.', value: 50 },
      { label: 'Velocidad', value: 90 },
    ],
    description:
      'Pikachu almacena electricidad en sus mejillas. Si se siente amenazado, libera descargas eléctricas. Es un Pokémon ágil y sociable.',
  };


const DetailCard = () => {
    const p = mockPokemon;
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-xl">
        {/* halos decorativos */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-yellow-300/40 to-amber-300/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300/30 to-purple-300/30 blur-3xl"></div>

        <div className="relative z-10 p-5 sm:p-8">
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-around gap-3 sm:gap-4 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{p.name}</h1>
              <div className="flex items-center gap-2">
                {p.types.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 px-2.5 py-0.5 text-xs font-medium border border-yellow-300/30 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="sm:ml-auto flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-gray-800 dark:text-gray-200">
                  #{p.id.toString().padStart(3, '0')}
                </span>
                <button
                  type="button"
                  aria-label="Añadir a favoritos"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 bg-white/20 backdrop-blur text-yellow-600 dark:text-yellow-300 hover:bg-white/30 transition shadow-md"
                >
                  <Star className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cuerpo: imagen + info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen */}
            <div className="relative mx-auto w-full md:order-2">
              <img
                src={pikachuImg}
                alt={p.name}
                className="max-h-full object-contain drop-shadow-[0_12px_36px_rgba(250,204,21,0.55)]"
                loading="lazy"
              />

              {/* medidas */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200">
                  Peso: {p.weight}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200">
                  Altura: {p.height}
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
                  {p.stats.map(s => (
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