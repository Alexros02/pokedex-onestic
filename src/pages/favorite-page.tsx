import { useEffect, useMemo, useState } from 'react';
import Card from '../Components/card';
import CardList from '../Components/card-list';
import ViewSwitch from '../Components/view-switch';
import { useFavorites } from '../contexts/FavoritesContext';
import type { PokemonSimpleDetails } from '../types';
import { getPokemonData, getSinnohTypeNames } from '../services/pokedex-service';
import Pagination from '../Components/pagination';
import TypeFilter from '../Components/type-filter';
import { TYPE_LABEL_ES } from '../services/pokedex-service';

const FavoritePage = () => {
  const [isGridView, setIsGridView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pokedex:view:isGrid');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const { favoriteIds } = useFavorites();
  const [allFavoritesData, setAllFavoritesData] = useState<PokemonSimpleDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sinnohTypes, setSinnohTypes] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    if (selectedType === 'all') return allFavoritesData;
    return allFavoritesData.filter(p => p.types.includes(selectedType));
  }, [allFavoritesData, selectedType]);

  const totalFiltered = filteredData.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalFiltered / pageSize)),
    [totalFiltered]
  );

  const toggleView = () => {
    setIsGridView(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pokedex:view:isGrid', JSON.stringify(next));
      } catch (error) {
        console.warn('No se pudo guardar la preferencia de vista', error);
      }
      return next;
    });
  };

  useEffect(() => {
    // Ajusta la página si cambia el total filtrado
    setPage(prev => Math.min(Math.max(1, prev), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const loadAllFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await getPokemonData(favoriteIds);
        setAllFavoritesData(data);
      } catch (error) {
        console.error('Error cargando Pokémon favoritos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllFavorites();
  }, [favoriteIds]);

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

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) setPage(clamped);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="text-center my-8">
        <h1 className="text-3xl inline-block px-2 title-glass">Favoritos</h1>
        <div className="mt-4 flex items-center justify-between gap-4">
          <ViewSwitch isGridView={isGridView} onToggle={toggleView} />
          <TypeFilter
            types={sinnohTypes}
            value={selectedType}
            onChange={setSelectedType}
            labelsMap={TYPE_LABEL_ES}
          />
        </div>
      </div>

      {isGridView ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredData
            .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
            .map((pokemon: PokemonSimpleDetails) => (
              <Card key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredData
            .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
            .map((pokemon: PokemonSimpleDetails) => (
              <CardList key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
      )}
      {totalFiltered > pageSize && (
        <Pagination page={page} total={totalFiltered} pageSize={pageSize} onChange={goToPage} />
      )}
    </div>
  );
};

export default FavoritePage;
