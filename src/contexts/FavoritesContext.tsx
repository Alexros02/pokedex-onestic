import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/**
 * Estado y acciones disponibles en el contexto de favoritos.
 *
 * - `favoriteIds`: lista de IDs globales marcados como favoritos
 * - `isFavorite(id)`: indica si un ID está marcado como favorito
 * - `toggleFavorite(id)`: alterna el estado de favorito para un ID
 */
interface FavoritesContextType {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * Hook para consumir el contexto de favoritos.
 *
 * Requisitos: Debe usarse dentro de un `FavoritesProvider`, de lo contrario lanza error.
 *
 * @returns Objeto con `favoriteIds`, `isFavorite` y `toggleFavorite`.
 * @throws Error si se usa fuera de `FavoritesProvider`.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};

/**
 * Propiedades del proveedor de favoritos.
 */
interface FavoritesProviderProps {
  /** Elementos React hijos que tendrán acceso al contexto. */
  children: ReactNode;
}

/** Clave usada para persistir favoritos en `localStorage`. */
const LOCAL_STORAGE_KEY = 'favorites';

/**
 * Proveedor que gestiona la lista de favoritos y la persiste en `localStorage`.
 *
 * Inicialización: intenta cargar un arreglo de números desde `localStorage` bajo la clave `favorites`.
 * Persistencia: sincroniza `favoriteIds` con `localStorage` en cada cambio.
 *
 * @param props.children Elementos React que recibirán el contexto.
 * @returns Nodo JSX con el `FavoritesContext.Provider`.
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(v => typeof v === 'number');
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // ignorar errores de almacenamiento
    }
  }, [favoriteIds]);

  const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
