### Pokédex Onestic (React + TypeScript + Vite)

Aplicación web que muestra el Pokédex de la región de Sinnoh (edición extendida/Platinum) utilizando la PokéAPI. Permite:

- Visualizar la lista de Pokémon de Sinnoh con paginación
- Cambiar entre vista de cuadrícula y lista
- Filtrar por tipos disponibles en Sinnoh
- Marcar Pokémon como favoritos (persistencia en `localStorage`)
- Ver detalles completos de cada Pokémon (habilidades, estadísticas, altura, etc.)
- Alternar tema claro/oscuro con preferencia persistida

La app está construida con React 19, TypeScript, Vite 7, React Router 7 y Tailwind CSS 4 (vía `@tailwindcss/vite`). Incluye pruebas con Vitest y Testing Library, y configuración para despliegue en Vercel.

---

### Demo/Despliegue

- Configuración de SPA en Vercel con `vercel.json` (rewrite a `/`).
- Alternativamente, existe `public/_redirects` para plataformas que soporten Netlify-style redirects.

---

### Requisitos

- Node.js 18 o superior
- npm 9+ (o pnpm/yarn si prefieres, adaptando comandos)

---

### Scripts

- `npm run dev`: inicia el servidor de desarrollo Vite
- `npm run build`: compila TypeScript y genera el build de producción
- `npm run preview`: sirve el build de producción localmente
- `npm run lint`: ejecuta ESLint
- `npm run test`: ejecuta Vitest en modo interactivo
- `npm run test:run`: ejecuta pruebas en modo CI
- `npm run test:coverage`: genera cobertura

---

### Instalación y uso

```bash
npm install
npm run dev
```

Visita `http://localhost:5173` (puerto por defecto de Vite).

Para construir y previsualizar producción:

```bash
npm run build
npm run preview
```

---

### Arquitectura y rutas

- `src/main.tsx`: monta la app con `BrowserRouter`, `ThemeProvider` y `FavoritesProvider`.
- `src/App.tsx`: declara rutas con `useRoutes` y un `MainLayout`.
  - `/`: Home (listado + filtros + paginación)
  - `/favorite`: Favoritos (listado de marcados)
  - `/pokemon/:id`: Detalle de un Pokémon
- `src/Layouts/MainLayout.tsx`: layout principal que incluye `Header` y `Outlet`.

---

### Contextos (añadidos importantes)

- `ThemeContext` (`src/contexts/ThemeContext.tsx`)

  - Estado: `isDarkMode`
  - Acción: `toggleTheme()`
  - Persistencia en `localStorage` (`theme`) y aplica clase `dark` al `documentElement`.
  - Respeta la preferencia del sistema si no hay dato guardado.

- `FavoritesContext` (`src/contexts/FavoritesContext.tsx`)
  - Estado: `favoriteIds: number[]`
  - Selectores/acciones: `isFavorite(id)`, `toggleFavorite(id)`
  - Persistencia en `localStorage` (clave `favorites`).

---

### Servicio de Pokédex (añadidos importantes)

Ubicación: `src/services/pokedex-service.ts`

- Región objetivo: Sinnoh extendida (PokéAPI `pokedex/6`).
- Funciones clave:
  - `fetchSinnohPokedex()`: imprime en consola el Pokédex de Sinnoh ("<id>. <nombre>")
  - `getPokemonArtworkUrl(id)`: URL del artwork oficial
  - `getPokemonSimpleDetails(id)`: detalles simples (id, nombre, tipos, color de tipo, peso, descripción)
  - `getPokemonFullDetails(id)`: detalles completos (lo anterior + habilidades traducidas/es, altura, stats)
  - `getPokemonPage(page, pageSize)`: paginación global (PokéAPI `/pokemon`)
  - `getSinnohGlobalIds()`: IDs globales de Pokémon presentes en Sinnoh (cache en memoria)
  - `getSinnohPokemonPage(page, pageSize)`: paginación restringida a Sinnoh
  - `getPokemonData(ids: number[])`: util para resolver varios simples en paralelo
  - `getSinnohTypeNames()`: tipos disponibles en Sinnoh (intersección tipos ↔ IDs Sinnoh)
  - `getSinnohIdsByType(typeName)`: IDs de Sinnoh que pertenecen a un tipo

Notas de implementación:

- Se normaliza la descripción de `species.flavor_text_entries` priorizando español, luego inglés, y colapsando espacios/saltos de línea.
- Se traducen nombres de habilidades a español cuando PokéAPI expone `names` localizados.
- Paginaciones calculan `safePage`, `safePageSize` y limitan rangos.

---

### Páginas y componentes

- Páginas

  - `Home` (`src/pages/home-page.tsx`):
    - Vista grid/list con `ViewSwitch` (persistencia de preferencia)
    - Filtro por tipos con `TypeFilter` y mapeo `TYPE_LABEL_ES`
    - Paginación con `Pagination`
    - Carga de datos desde `getSinnohPokemonPage` o, con filtro, `getSinnohIdsByType` + `getPokemonData`
  - `Favorite` (`src/pages/favorite-page.tsx`):
    - Lista derivada de `favoriteIds` desde contexto
    - Mismos controles de vista, filtro y paginación (local sobre el conjunto filtrado)
  - `Detail` (`src/pages/detail-page.tsx`):
    - Obtiene `PokemonFullDetails` por `:id`
    - Manejo de estados de carga y error

- Componentes
  - `Header`: navegación responsive, cambio de tema, acceso a favoritos
  - `Card` y `CardList`: tarjetas con estética glass y acentos por color de tipo
  - `FavButton`: marca/desmarca favoritos evitando propagación de eventos
  - `Pagination`: numeración adaptable y accesible
  - `TypeFilter`, `ViewSwitch`, `DetailCard` (UI de apoyo)

---

### Estilos y diseño

- Tailwind CSS 4 con `@tailwindcss/vite`.
- Modo oscuro basado en clase `dark` en `html`.
- Estética "glass" y halos con colores derivados del tipo (`generateAccentColors`).

---

### Accesibilidad

- Controles navegables por teclado (`role`, `tabIndex`, `onKeyDown` en elementos clicables).
- Etiquetas ARIA (`aria-label`, `aria-pressed`).
- Contrastes reforzados en modo oscuro y estados hover/focus.

---

### Pruebas

- Framework: Vitest + @testing-library/react + jsdom.
- Ubicación: `src/**/__tests__/*` (componentes, páginas, contextos, servicios, utils).
- Cobertura: `npm run test:coverage`.

---

### Despliegue en Vercel

- Archivo `vercel.json` con:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Esto asegura que las rutas del `BrowserRouter` funcionen como SPA. Para otras plataformas, `public/_redirects` contiene un catch-all equivalente.

---

### Decisiones y limitaciones

- Se usan datos en tiempo real desde PokéAPI (sin caché persistente más allá de memoria en `getSinnohGlobalIds`).
- Favoritos y preferencia de vista/tema en `localStorage` (por usuario/navegador).
- El listado principal está restringido a IDs de Sinnoh extendido para consistencia con los filtros.

---