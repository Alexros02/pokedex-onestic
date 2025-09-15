import { useTheme } from '../contexts/ThemeContext';
import pikachuImg from '../assets/pikachu.png';

import Card from '../Components/card';
import CardList from '../Components/card-list';





const TestComponentsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const pokemon = {
    id: 1,
    name: 'Pikachu',
    type: 'Eléctrico',
    weight: '6.0 kg',
    description: 'Pokémon ágil que acumula electricidad en las mejillas. Suele vivir en bosques y zonas con abundante energía.',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Test de Componentes</h1>
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </header>

      

        {/* Card estilo glass de Apple */}
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-lg">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-yellow-300/40 to-pink-300/40 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300/30 to-purple-300/30 blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-100 backdrop-blur">
                  #025
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Pikachu</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center rounded-full bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 px-2.5 py-1 text-xs font-medium border border-yellow-300/30 backdrop-blur">
                  Eléctrico
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 text-gray-800 dark:text-gray-200 px-2.5 py-1 text-xs font-medium border border-white/20 backdrop-blur">
                  Peso 6.0 kg
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 text-gray-800 dark:text-gray-200 px-2.5 py-1 text-xs font-medium border border-white/20 backdrop-blur">
                  Altura 0.4 m
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 max-w-prose mb-4">
                Pikachu almacena electricidad en sus mejillas. Si se le acerca un extraño, puede
                soltar una descarga eléctrica.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>ATK</span>
                    <span>55</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[55%] rounded-full bg-yellow-400/80"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>DEF</span>
                    <span>40</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[40%] rounded-full bg-yellow-400/60"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>SPD</span>
                    <span>90</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[90%] rounded-full bg-yellow-400"></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-xl bg-black/70 text-white backdrop-blur hover:bg-black/80 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition">
                  Ver detalles
                </button>
                <button className="px-4 py-2 rounded-xl border border-white/30 bg-white/20 backdrop-blur text-gray-900 dark:text-gray-100 hover:bg-white/30 transition">
                  Añadir a favoritos
                </button>
              </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
              <img
                src={pikachuImg}
                alt="Pikachu"
                className="h-40 sm:h-48 md:h-56 lg:h-64 object-contain drop-shadow-[0_8px_24px_rgba(250,204,21,0.55)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Card estilo carta Pokémon (proporción vertical y tamaño fijo, mantiene estética glass) */}
        <Card key={pokemon.id} pokemon={pokemon} />
    

        {/* Card estilo lista (horizontal) */}
        <CardList key={pokemon.id} pokemon={pokemon} />
      

      {/* Estados y mensajes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Estados</h2>
        <div className="grid gap-3">
          <div className="px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
            Info: ¡Cargando pokémon!
          </div>
          <div className="px-3 py-2 rounded bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800">
            Éxito: Añadido a favoritos
          </div>
          <div className="px-3 py-2 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800">
            Aviso: Sin conexión
          </div>
          <div className="px-3 py-2 rounded bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800">
            Error: No encontrado
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestComponentsPage;
