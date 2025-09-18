import { useRoutes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Home from './pages/home-page';
import Favorite from './pages/favorite-page';
import Detail from './pages/detail-page';

const App = () => {
  // Define el árbol de rutas de la aplicación. Usa `MainLayout` como layout raíz
  // y expone tres rutas: inicio, favoritos y detalle por `id`.
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'favorite', element: <Favorite /> },
        { path: 'pokemon/:id', element: <Detail /> },
      ],
    },
  ]);
};

export default App;
