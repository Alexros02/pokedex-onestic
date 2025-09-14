import logoPokedex from '../assets/logopokedex.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src={logoPokedex} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              <span className="hidden sm:inline">Pokédex Onestic</span>
              <span className="sm:hidden">Pokédex</span>
            </h1>
          </div>

          {/* Botón hamburguesa solo para sm */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-white hover:text-yellow-300 transition-colors duration-200 p-2"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Navegación horizontal para md y lg */}
          <nav className="hidden sm:flex space-x-4 md:space-x-6 lg:space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Inicio
            </button>

            <button
              onClick={() => navigate('/favorite')}
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-sm md:text-base"
            >
              Favoritos
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
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-left py-2 px-3 rounded hover:bg-blue-700"
              >
                Inicio
              </button>

              <button
                onClick={() => {
                  navigate('/favorite');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium text-left py-2 px-3 rounded hover:bg-blue-700"
              >
                Favoritos
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
