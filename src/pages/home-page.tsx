import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../Components/card';
import CardList from '../Components/card-list';
import ViewSwitch from '../Components/view-switch';
import {
  getSinnohPokemonPage,
  getSinnohTypeNames,
  getSinnohIdsByType,
  getPokemonData,
} from '../services/pokedex-service';
import type { PokemonSimpleDetails } from '../types';
import Pagination from '../Components/pagination';
import TypeFilter from '../Components/type-filter';
import { TYPE_LABEL_ES } from '../services/pokedex-service';

/**
 * Página principal: lista de Pokémon de Sinnoh con vista grid/lista,
 * filtro por tipo y paginación. Persiste la preferencia de vista.
 */
const HomePage = () => {
  const VIEW_STORAGE_KEY = 'pokedex:view:isGrid';
  const [isGridView, setIsGridView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [pokemons, setPokemons] = useState<PokemonSimpleDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;
  const [total, setTotal] = useState<number>(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sinnohTypes, setSinnohTypes] = useState<string[]>([]);
  const [filteredTotal, setFilteredTotal] = useState<number | null>(null);

  const toggleView = useCallback(() => {
    setIsGridView(prev => {
      const next = !prev;
      try {
        localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn('No se pudo guardar la preferencia de vista', error);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (selectedType === 'all') {
          const { items, total } = await getSinnohPokemonPage(page, pageSize);
          setPokemons(items);
          setTotal(total);
          setFilteredTotal(null);
        } else {
          const ids = await getSinnohIdsByType(selectedType);
          setFilteredTotal(ids.length);
          const safePage = Math.max(1, Math.floor(page || 1));
          const start = (safePage - 1) * pageSize;
          const end = Math.min(start + pageSize, ids.length);
          const pageIds = ids.slice(start, end);
          const items = await getPokemonData(pageIds);
          setPokemons(items);
        }
      } catch (error) {
        console.error('Error cargando Pokémon:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [page, selectedType]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const names = await getSinnohTypeNames();
        setSinnohTypes(names);
      } catch (err) {
        console.warn('No se pudieron cargar los tipos de Sinnoh', err);
      }
    };
    loadTypes();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedType]);

  /** Cambia a una página válida dentro de los límites. */
  const goToPage = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(1, p), totalPages);
      if (clamped !== page) setPage(clamped);
    },
    [page, totalPages]
  );

  const filteredPokemons = useMemo(() => {
    if (selectedType === 'all') return pokemons;
    return pokemons.filter(p => p.types.includes(selectedType));
  }, [pokemons, selectedType]);

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="text-center my-8">
        <h1 className="text-4xl mb-4 title-glass">Pokemons de Sinnoh</h1>
        <div className="flex items-center justify-between gap-4">
          <ViewSwitch isGridView={isGridView} onToggle={toggleView} />
          <div className="flex items-center">
            <TypeFilter
              types={sinnohTypes}
              value={selectedType}
              onChange={setSelectedType}
              labelsMap={TYPE_LABEL_ES}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Cargando...</div>
      ) : isGridView ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredPokemons.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPokemons.map(pokemon => (
            <CardList key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {(selectedType === 'all' ? total : filteredTotal ?? 0) > pageSize && (
        <Pagination
          page={page}
          total={selectedType === 'all' ? total : filteredTotal ?? 0}
          pageSize={pageSize}
          onChange={goToPage}
        />
      )}
    </div>
  );
};

export default HomePage;
