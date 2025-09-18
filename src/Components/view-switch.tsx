import { Grid3X3, List } from 'lucide-react';

/**
 * Conmutador de vista: alterna entre cuadrícula y lista.
 * Muestra estado visual activo para la vista seleccionada.
 */
interface ViewSwitchProps {
  isGridView: boolean;
  onToggle: () => void;
}

const ViewSwitch = ({ isGridView, onToggle }: ViewSwitchProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex bg-white/10 dark:bg-white/5 rounded-lg p-1 gap-1 border border-white/20 backdrop-blur">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
            isGridView
              ? 'bg-white/20 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          aria-label="Vista de cuadrícula"
        >
          <Grid3X3 className="h-4 w-4" />
          <span className="hidden sm:inline">Cuadrícula</span>
        </button>
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
            !isGridView
              ? 'bg-white/20 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          aria-label="Vista de lista"
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Lista</span>
        </button>
      </div>
    </div>
  );
};

export default ViewSwitch;
