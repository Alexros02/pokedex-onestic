import { useRoutes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Home from './pages/home-page';
import Favorite from './pages/favorite-page';
import Detail from './pages/detail-page';
import TestComponentsPage from './pages/test-components-page';

const App = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'favorite', element: <Favorite /> },
        { path: '/pokemon/:id', element: <Detail /> },
        { path: 'test-components', element: <TestComponentsPage /> },
      ],
    },
  ]);

  return routes;
};

export default App;
