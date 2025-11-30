import { BrowserRouter, useLocation } from 'react-router-dom';  
import { createContext, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import NavbarHome from './components/Navbar home';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import './App.css';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Update body class based on current route and theme
    document.body.className = '';
    document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    if (location.pathname.startsWith('/jumia')) {
      document.body.classList.add('jumia-theme');
    } else if (location.pathname.startsWith('/cars')) {
      document.body.classList.add('cars-theme');
    } else if (location.pathname.startsWith('/dashboard')) {
      document.body.classList.add('default-bg');
    } else {
      document.body.classList.add('default-bg');
    }
  }, [location, theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  const isHomePage = location.pathname === '/';

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className="app-wrapper">
        {isHomePage ? <NavbarHome /> : <Navbar />}
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

function App() {  
  return (  
    <BrowserRouter>  
      <AppContent />
    </BrowserRouter>  
  );  
}  

export default App;
