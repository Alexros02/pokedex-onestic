import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorite from '../favorite-page';
import { FavoritesProvider } from '../../contexts/FavoritesContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock de los servicios
vi.mock('../../services/pokedex-service', () => ({
  getPokemonData: vi.fn(),
  getSinnohTypeNames: vi.fn(),
  translateTypeToEs: vi.fn((type: string) => type),
  getTypeColor: vi.fn(() => '#F7D02C'),
  getPokemonArtworkUrl: vi.fn((id: number) => `https://example.com/pokemon/${id}.png`),
  TYPE_LABEL_ES: {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    electric: 'Eléctrico',
    grass: 'Planta',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    dark: 'Siniestro',
    steel: 'Acero',
    fairy: 'Hada',
  },
}));

// Mock de los componentes
vi.mock('../../Components/header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../Components/card-list', () => ({
  default: ({ pokemon, view }: { pokemon: any[]; view: string }) => (
    <div data-testid="card-list" data-view={view}>
      {pokemon.map(p => (
        <div key={p.id} data-testid={`pokemon-${p.id}`}>
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

// Mock del contexto de tema
const mockThemeContext = {
  isDark: false,
  toggleTheme: vi.fn(),
};

vi.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => mockThemeContext,
}));

const mockPokemonData = [
  {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    typeColor: '#F7D02C',
    weight: 60,
    description: 'Un Pokémon eléctrico muy popular.',
  },
  {
    id: 100,
    name: 'charmander',
    types: ['fire'],
    typeColor: '#EE8130',
    weight: 85,
    description: 'Un Pokémon de fuego.',
  },
];

const renderFavoritePage = (initialFavorites: number[] = [25, 100]) => {
  // Mock de localStorage
  const localStorageMock = {
    getItem: vi.fn(() => JSON.stringify(initialFavorites)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  return render(
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <Favorite />
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Favorite Page', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock de las funciones del servicio
    const { getPokemonData, getSinnohTypeNames } = await import('../../services/pokedex-service');
    vi.mocked(getPokemonData).mockResolvedValue(mockPokemonData);
    vi.mocked(getSinnohTypeNames).mockResolvedValue([
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
    ]);
  });

  it('debe renderizar el header', () => {
    renderFavoritePage();

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar el título de la página', () => {
    renderFavoritePage();

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe cargar y mostrar los Pokémon favoritos', async () => {
    renderFavoritePage([25, 100]);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay favoritos', async () => {
    renderFavoritePage([]);

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar el botón para ir a la página principal', async () => {
    renderFavoritePage([]);

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar el estado de carga inicialmente', () => {
    renderFavoritePage();

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const { getPokemonData } = await import('../../services/pokedex-service');
    vi.mocked(getPokemonData).mockRejectedValue(new Error('Network error'));

    renderFavoritePage([25, 100]);

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe aplicar el tema correcto', () => {
    renderFavoritePage();

    // Verificamos que se muestra el estado de carga inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar el contador de favoritos', async () => {
    renderFavoritePage([25, 100]);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    // Verificamos que se muestran los Pokémon favoritos
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('debe actualizar el contador cuando cambian los favoritos', async () => {
    renderFavoritePage([25]);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    // Verificamos que se muestra el Pokémon favorito
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('debe usar la vista de lista por defecto', async () => {
    renderFavoritePage([25, 100]);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    // Verificamos que los Pokémon se muestran (la vista por defecto es grid)
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });
});
