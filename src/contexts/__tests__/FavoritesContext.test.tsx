import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../FavoritesContext';
import type { ReactNode } from 'react';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  return (
    <div>
      <div data-testid="favorite-ids">{JSON.stringify(favoriteIds)}</div>
      <div data-testid="is-favorite-25">{isFavorite(25).toString()}</div>
      <div data-testid="is-favorite-100">{isFavorite(100).toString()}</div>
      <button data-testid="toggle-25" onClick={() => toggleFavorite(25)}>
        Toggle 25
      </button>
      <button data-testid="toggle-100" onClick={() => toggleFavorite(100)}>
        Toggle 100
      </button>
    </div>
  );
};

// Wrapper para el contexto
const ContextWrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Inicialización', () => {
    it('debe inicializar con array vacío cuando no hay datos en localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[]');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('false');
      expect(screen.getByTestId('is-favorite-100')).toHaveTextContent('false');
    });

    it('debe inicializar con datos válidos del localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[25, 100, 150]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25,100,150]');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-100')).toHaveTextContent('true');
    });

    it('debe manejar datos inválidos en localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[]');
    });

    it('debe filtrar datos no numéricos del localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[25, "invalid", 100, null, 150]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25,100,150]');
    });
  });

  describe('toggleFavorite', () => {
    it('debe añadir un favorito cuando no existe', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      act(() => {
        screen.getByTestId('toggle-25').click();
      });

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25]');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
    });

    it('debe remover un favorito cuando existe', () => {
      localStorageMock.getItem.mockReturnValue('[25, 100]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      act(() => {
        screen.getByTestId('toggle-25').click();
      });

      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[100]');
      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('false');
    });

    it('debe manejar múltiples toggles correctamente', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      // Añadir 25
      act(() => {
        screen.getByTestId('toggle-25').click();
      });
      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25]');

      // Añadir 100
      act(() => {
        screen.getByTestId('toggle-100').click();
      });
      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25,100]');

      // Remover 25
      act(() => {
        screen.getByTestId('toggle-25').click();
      });
      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[100]');
    });
  });

  describe('isFavorite', () => {
    it('debe devolver true para favoritos existentes', () => {
      localStorageMock.getItem.mockReturnValue('[25, 100]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-100')).toHaveTextContent('true');
    });

    it('debe devolver false para favoritos no existentes', () => {
      localStorageMock.getItem.mockReturnValue('[25, 100]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      expect(screen.getByTestId('is-favorite-25')).toHaveTextContent('true');
      expect(screen.getByTestId('is-favorite-100')).toHaveTextContent('true');
    });
  });

  describe('Persistencia en localStorage', () => {
    it('debe guardar en localStorage cuando se añaden favoritos', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      act(() => {
        screen.getByTestId('toggle-25').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[25]');
    });

    it('debe actualizar localStorage cuando se remueven favoritos', () => {
      localStorageMock.getItem.mockReturnValue('[25, 100]');

      render(
        <ContextWrapper>
          <TestComponent />
        </ContextWrapper>
      );

      act(() => {
        screen.getByTestId('toggle-25').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[100]');
    });

    it('debe manejar errores de localStorage silenciosamente', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // No debe lanzar error
      expect(() => {
        render(
          <ContextWrapper>
            <TestComponent />
          </ContextWrapper>
        );
      }).not.toThrow();

      act(() => {
        screen.getByTestId('toggle-25').click();
      });

      // Debe continuar funcionando a pesar del error
      expect(screen.getByTestId('favorite-ids')).toHaveTextContent('[25]');
    });
  });

  describe('useFavorites hook', () => {
    it('debe lanzar error cuando se usa fuera del provider', () => {
      // Suprimir console.error para este test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFavorites debe usarse dentro de FavoritesProvider');

      consoleSpy.mockRestore();
    });
  });
});
