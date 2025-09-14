import logoPokedex from '../assets/logopokedex.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <img src={logoPokedex} alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-white">Pokédex Onestic</h1>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
            >
              Inicio
            </button>

            <button
              onClick={() => navigate('/favorite')}
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
            >
              Favoritos
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
