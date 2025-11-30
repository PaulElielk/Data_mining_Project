import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';
import SmartSearchBar from './SmartSearchBar';
import { ThemeContext } from '../App';

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isJumia = location.pathname.startsWith('/jumia');
  const isCars = location.pathname.startsWith('/cars');
  
  return (
    <nav className={`navbar ${isJumia ? 'navbar-jumia' : isCars ? 'navbar-cars' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>Product Store</h2>
        </Link>
        <SmartSearchBar />
        <div className="navbar-links">
          <Link 
            to="/jumia" 
            className={`nav-link ${isJumia ? 'active jumia-active' : ''}`}
          >
            <span className="nav-icon">🛒</span>
            Jumia Products
          </Link>
          <Link 
            to="/cars" 
            className={`nav-link ${isCars ? 'active cars-active' : ''}`}
          >
            <span className="nav-icon">🚗</span>
            Cars
          </Link>
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">❤️</span>
            Dashboard
          </Link>
          <button
            type="button"
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

