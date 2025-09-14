import { Outlet } from 'react-router-dom';
import Header from '../Components/header';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      <main className="flex-1 p-4">
        <Outlet /> {/* Renderiza las páginas */}
      </main>
      {/*<footer/>*/}
    </div>
  );
};

export default MainLayout;
