import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../card';
import type { PokemonSimpleDetails } from '../../types';

// Mock del hook useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock del componente FavButton
vi.mock('../fav-button', () => ({
  default: ({ pokemonId }: { pokemonId: number }) => (
    <button data-testid={`fav-button-${pokemonId}`}>Fav</button>
  ),
}));

// Mock de las utilidades de color
vi.mock('../../utils/color-utils', () => ({
  generateAccentColors: () => ({
    accent: '#F7D02C',
    accentBg20: 'rgba(247, 208, 44, 0.2)',
    accentBorder30: 'rgba(247, 208, 44, 0.3)',
    accentShadow55: 'rgba(247, 208, 44, 0.55)',
    accentHaloStrong: 'rgba(247, 208, 44, 0.4)',
    accentHaloSoft: 'rgba(247, 208, 44, 0.3)',
    accentHaloAltStrong: 'rgba(247, 208, 44, 0.3)',
    accentHaloAltSoft: 'rgba(247, 208, 44, 0.2)',
  }),
}));

// Mock del servicio
vi.mock('../../services/pokedex-service', () => ({
  getPokemonArtworkUrl: (id: number) => `https://example.com/pokemon/${id}.png`,
  translateTypeToEs: (type: string) => (type === 'electric' ? 'Eléctrico' : type),
}));

const mockPokemon: PokemonSimpleDetails = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  typeColor: '#F7D02C',
  weight: 60,
  description: 'Un Pokémon eléctrico muy popular.',
};

const renderCard = (pokemon: PokemonSimpleDetails) => {
  return render(
    <BrowserRouter>
      <Card pokemon={pokemon} />
    </BrowserRouter>
  );
};

describe('Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente con datos del Pokémon', () => {
    renderCard(mockPokemon);

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText('Eléctrico')).toBeInTheDocument();
    expect(screen.getByText('Peso: 6.0 kg')).toBeInTheDocument();
    expect(screen.getByText('Un Pokémon eléctrico muy popular.')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
  });

  it('debe mostrar la imagen del Pokémon con URL correcta', () => {
    renderCard(mockPokemon);

    const image = screen.getByAltText(/pikachu/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/pokemon/25.png');
  });

  it('debe navegar al hacer click en la tarjeta', () => {
    renderCard(mockPokemon);

    const card = screen.getByRole('button', { name: /pikachu/i });
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/25');
  });

  // Atajos de teclado deshabilitados: no se prueban eventos de Enter o Espacio

  it('debe mostrar el botón de favoritos', () => {
    renderCard(mockPokemon);

    expect(screen.getByTestId('fav-button-25')).toBeInTheDocument();
  });

  it('debe manejar múltiples tipos correctamente', () => {
    const pokemonWithMultipleTypes: PokemonSimpleDetails = {
      ...mockPokemon,
      types: ['fire', 'flying'],
    };

    renderCard(pokemonWithMultipleTypes);

    expect(screen.getByText('fire/flying')).toBeInTheDocument();
  });

  it('debe formatear el peso correctamente', () => {
    const pokemonWithDifferentWeight: PokemonSimpleDetails = {
      ...mockPokemon,
      weight: 150,
    };

    renderCard(pokemonWithDifferentWeight);

    expect(screen.getByText('Peso: 15.0 kg')).toBeInTheDocument();
  });

  it('debe formatear el ID con padding de ceros', () => {
    const pokemonWithSingleDigitId: PokemonSimpleDetails = {
      ...mockPokemon,
      id: 5,
    };

    renderCard(pokemonWithSingleDigitId);

    expect(screen.getByText('#005')).toBeInTheDocument();
  });

  it('debe manejar Pokémon sin descripción', () => {
    const pokemonWithoutDescription: PokemonSimpleDetails = {
      ...mockPokemon,
      description: undefined,
    };

    renderCard(pokemonWithoutDescription);

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.queryByText('Un Pokémon eléctrico muy popular.')).not.toBeInTheDocument();
  });

  // Sin requisito de tabindex explícito

  it('debe aplicar estilos de hover y focus', () => {
    renderCard(mockPokemon);

    const card = screen.getByRole('button', { name: /pikachu/i });
    expect(card).toHaveClass('group', 'transition-all', 'duration-300', 'ease-out');
  });
});
