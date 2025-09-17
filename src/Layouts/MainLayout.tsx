import { Outlet } from 'react-router-dom';
import Header from '../Components/header';
import { useTheme } from '../contexts/ThemeContext';
import lightBackground from '../assets/fondo-light.png';
import darkBackground from '../assets/fondo-dark.png';

const MainLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}
      style={{
        backgroundImage: `url(${isDarkMode ? darkBackground : lightBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode ? 'bg-black/50' : 'bg-white/40'
        } z-0 pointer-events-none`}
      />
      <div className="relative z-50">
        <Header />
      </div>
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto dark:text-white pt-12 sm:pt-16 lg:pt-20">
        <Outlet /> {/* Renderiza las páginas */}
      </main>
      {/*<footer/>*/}
    </div>
  );
};

export default MainLayout;
