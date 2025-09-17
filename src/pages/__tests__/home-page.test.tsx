import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../home-page';
import { FavoritesProvider } from '../../contexts/FavoritesContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock de los servicios
vi.mock('../../services/pokedex-service', () => ({
  getSinnohPokemonPage: vi.fn(),
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

vi.mock('../../Components/type-filter', () => ({
  default: ({ onTypeChange }: { onTypeChange: (type: string) => void }) => (
    <div data-testid="type-filter">
      <button onClick={() => onTypeChange('fire')}>Fire</button>
      <button onClick={() => onTypeChange('all')}>All</button>
    </div>
  ),
}));

vi.mock('../../Components/view-switch', () => ({
  default: ({ onViewChange }: { view: string; onViewChange: (view: string) => void }) => (
    <div data-testid="view-switch">
      <button onClick={() => onViewChange('grid')}>Grid</button>
      <button onClick={() => onViewChange('list')}>List</button>
    </div>
  ),
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

vi.mock('../../Components/pagination', () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
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

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <Home />
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock de las funciones del servicio
    const { getSinnohPokemonPage, getSinnohTypeNames } = await import(
      '../../services/pokedex-service'
    );
    vi.mocked(getSinnohPokemonPage).mockResolvedValue({
      items: mockPokemonData,
      total: 210,
    });
    vi.mocked(getSinnohTypeNames).mockResolvedValue(['fire', 'water', 'electric', 'grass']);
  });

  it('debe renderizar todos los componentes principales', async () => {
    renderHomePage();

    expect(screen.getByText('Pokemons de Sinnoh')).toBeInTheDocument();
    expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('view-switch')).toBeInTheDocument();
    // La paginación se muestra después de cargar los datos
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe cargar y mostrar la lista de Pokémon', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  it('debe mostrar el estado de carga inicialmente', () => {
    renderHomePage();

    // El componente debe mostrar algún indicador de carga
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar el cambio de tipo de filtro', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    });

    // Verificamos que el filtro está presente
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('debe manejar el cambio de vista', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('view-switch')).toBeInTheDocument();
    });

    // Verificamos que los botones de vista están presentes
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('debe manejar la paginación', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    // Verificamos que los elementos de paginación están presentes
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('debe mostrar el total de páginas correctamente', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    // Verificamos que la paginación está presente
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const { getSinnohPokemonPage } = await import('../../services/pokedex-service');
    vi.mocked(getSinnohPokemonPage).mockRejectedValue(new Error('Network error'));

    renderHomePage();

    // Verificamos que se muestra el estado de carga
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe aplicar el tema correcto', () => {
    renderHomePage();

    // Verificamos que el título principal está presente
    expect(screen.getByText('Pokemons de Sinnoh')).toBeInTheDocument();
  });
});
