import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/**
 * Estado y acciones disponibles para el tema (claro/oscuro).
 *
 * - `isDarkMode`: indica si el modo oscuro está activo
 * - `toggleTheme()`: alterna entre tema claro/oscuro
 */
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook para consumir el contexto de tema.
 *
 * Requisitos: Debe usarse dentro de un `ThemeProvider`; en caso contrario lanza error.
 * @returns Objeto con `isDarkMode` y `toggleTheme`.
 * @throws Error si se usa fuera de `ThemeProvider`.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

/** Propiedades del proveedor de tema. */
interface ThemeProviderProps {
  /** Elementos React hijos que tendrán acceso al contexto. */
  children: ReactNode;
}

/** Clave usada para persistir el tema en `localStorage`. */
const THEME_STORAGE_KEY = 'theme';

/**
 * Proveedor que gestiona el modo oscuro/claro y lo persiste en `localStorage`.
 *
 * Inicialización: intenta cargar preferencia previa (`dark`/`light`) desde `localStorage`.
 * Si no existe, usa el media query `prefers-color-scheme` del sistema.
 * Efectos: aplica la clase `dark` en `<html>` cuando `isDarkMode` es `true`,
 * y guarda la preferencia en `localStorage`.
 *
 * @param props.children Elementos React que recibirán el contexto.
 * @returns Nodo JSX con el `ThemeContext.Provider`.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme === 'dark';
    } catch {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    } catch {
      // ignorar errores de almacenamiento
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
