import React from 'react';
import logoPokedex from '../assets/logopokedex.png';

const Header = () => {
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
            <a
              href="#inicio"
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
            >
              Inicio
            </a>
            
            <a
              href="#favoritos"
              className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
            >
              Favoritos
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
