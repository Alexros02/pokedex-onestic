import logoPokedex from '../assets/logopokedex.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Home, Heart, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logoOnestic from '../assets/pokedexonestic.png';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:to-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo y título */}
          <div onClick={() => navigate('/')}
          className="cursor-pointer flex items-center space-x-2  sm:space-x-3">
            <img src={logoPokedex} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            <div className=" h-fit items-center   font-bold text-white flex items-center gap-2 justify-center">
              
              <img src={logoOnestic} alt="Logo" className=" inline sm:h-9   h-6" />
            </div>
          </div>

          {/* Botón hamburguesa solo para sm */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white hover:text-yellow-300 transition-colors duration-200 p-2"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Navegación horizontal para md y lg */}
          <nav className="hidden sm:flex space-x-4 md:space-x-6 lg:space-x-8">
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm md:text-base"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => navigate('/favorite')}
              className="cursor-pointer flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm md:text-base"
            >
              <Heart className="w-4 h-4" />
              <span>Favoritos</span>
            </button>

            {/* Switch de tema */}
            <button
              onClick={toggleTheme}
              className="cursor-pointer flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm md:text-base"
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="hidden md:inline">{isDarkMode ? 'Oscuro' : 'Claro'}</span>
            </button>
          </nav>
        </div>

        {/* Menú móvil solo para sm */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-blue-500 py-3">
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-left py-2 px-3 rounded hover:bg-blue-700"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </button>

              <button
                onClick={() => {
                  navigate('/favorite');
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-left py-2 px-3 rounded hover:bg-blue-700"
              >
                <Heart className="w-4 h-4" />
                <span>Favoritos</span>
              </button>


              {/* Switch de tema en menú móvil */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-left py-2 px-3 rounded hover:bg-blue-700"
                aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
