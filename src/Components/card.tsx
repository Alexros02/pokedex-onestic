import pikachuImg from '../assets/pikachu.png';
import { Star } from 'lucide-react';

const Card = () => {
  return (
    <>
   {/* Card estilo carta Pokémon (proporción vertical y tamaño fijo, mantiene estética glass) */}
   <div className="mt-6 flex justify-center">
   <div className="relative w-72 h-[23rem] sm:w-80 sm:h-[23rem] rounded-2xl border border-white/25 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
     {/* halos decorativos */}
     <div className="pointer-events-none absolute -top-24 -left-16 h-52 w-52 rounded-full bg-gradient-to-br from-yellow-300/40 to-amber-300/30 blur-3xl"></div>
     <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-300/30 to-purple-300/30 blur-3xl"></div>

     {/* cabecera */}
     <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
       <h3 className="text-xl font-semibold tracking-tight">Pikachu</h3>
       <span className="inline-flex items-center rounded-full bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 px-2.5 py-0.5 text-xs font-medium border border-yellow-300/30 backdrop-blur">
         Eléctrico
       </span>
     </div>

     {/* área de imagen */}
     <div className="relative z-10 mx-4 mt-1 rounded-xl border border-white/20 bg-white/10 p-3 h-40 sm:h-44 flex items-center justify-center">
       <img
         src={pikachuImg}
         alt="Pikachu"
         className="max-h-full object-contain drop-shadow-[0_8px_24px_rgba(250,204,21,0.55)]"
         loading="lazy"
       />
     </div>

     {/* información */}
     <div className="relative z-10 px-4 pt-3">
       <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Peso: 6.0 kg</div>
       <p className="text-sm text-gray-700 dark:text-gray-300">
         Descarga energía de sus mejillas cuando se emociona. Su cola funciona como
         pararrayos.
       </p>
     </div>

     {/* pie con mini chips */}
     <div className="relative z-10 px-4 pb-4 pt-3 flex items-center gap-2">
       <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-gray-800 dark:text-gray-200">
         #025
       </span>
     </div>

     {/* botón favorito */}
     <button
       type="button"
       aria-label="Añadir a favoritos"
       className="absolute bottom-3 right-3 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 bg-white/20 backdrop-blur text-yellow-600 dark:text-yellow-300 hover:bg-white/30 transition shadow-md"
     >
       <Star className="h-5 w-5" />
     </button>
   </div>
 </div>
 </>
  );
};

export default Card;
