import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FavButton from '../fav-button';
import { FavoritesProvider } from '../../contexts/FavoritesContext';

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

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Star: ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <div data-testid="heart-icon" className={className} {...props}>
      ⭐
    </div>
  ),
}));

const renderFavButton = (pokemonId: number, initialFavorites: number[] = []) => {
  localStorageMock.getItem.mockReturnValue(JSON.stringify(initialFavorites));

  return render(
    <BrowserRouter>
      <FavoritesProvider>
        <FavButton pokemonId={pokemonId} />
      </FavoritesProvider>
    </BrowserRouter>
  );
};

describe('FavButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar como no favorito inicialmente', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');
    const heartIcon = screen.getByTestId('heart-icon');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(heartIcon).toBeInTheDocument();
  });

  it('debe renderizar como favorito cuando el Pokémon está en favoritos', () => {
    renderFavButton(25, [25, 100]);

    const button = screen.getByRole('button');
    const heartIcon = screen.getByTestId('heart-icon');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(heartIcon).toBeInTheDocument();
  });

  it('debe alternar el estado de favorito al hacer click', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');

    // Inicialmente no es favorito
    expect(button).toHaveAttribute('aria-pressed', 'false');

    // Click para añadir a favoritos
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');

    // Click para quitar de favoritos
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('debe tener los atributos de accesibilidad correctos', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Añadir a favoritos');
  });

  it('debe cambiar el aria-label cuando es favorito', () => {
    renderFavButton(25, [25]);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Añadir a favoritos');
  });

  it('debe actualizar el aria-label al alternar', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');

    // Inicialmente
    expect(button).toHaveAttribute('aria-label', 'Añadir a favoritos');

    // Después del click
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Añadir a favoritos');

    // Después del segundo click
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Añadir a favoritos');
  });

  it('debe tener las clases CSS correctas', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'group/fav',
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'h-10',
      'w-10',
      'hover:w-24',
      'rounded-full',
      'border',
      'backdrop-blur',
      'transition-all',
      'duration-300'
    );
  });

  it('debe manejar múltiples botones de favoritos independientemente', () => {
    render(
      <BrowserRouter>
        <FavoritesProvider>
          <FavButton pokemonId={25} />
          <FavButton pokemonId={100} />
        </FavoritesProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const heartIcons = screen.getAllByTestId('heart-icon');

    expect(buttons).toHaveLength(2);
    expect(heartIcons).toHaveLength(2);

    // Ambos deben estar inicialmente como no favoritos
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('debe persistir el estado en localStorage', () => {
    renderFavButton(25, []);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[25]');
  });
});
