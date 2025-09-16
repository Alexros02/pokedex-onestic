import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  fetchSinnohPokedex,
  getPokemonSimpleDetails,
  getPokemonFullDetails,
} from './services/pokedex-service.ts';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);

// Llamada no intrusiva para imprimir el Pokédex de Sinnoh en consola
fetchSinnohPokedex();

// Pruebas: detalles simples y completos del Pokémon con id 25
(async () => {
  try {
    const simple = await getPokemonSimpleDetails(25);
    console.log('[Simple 25]', simple);
    const full = await getPokemonFullDetails(25);
    console.log('[Completo 25]', full);
  } catch (e) {
    console.error('Error en pruebas de detalles para id 25:', e);
  }
})();
