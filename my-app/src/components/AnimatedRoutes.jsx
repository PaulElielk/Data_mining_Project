import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from '../pages/HomePage';
import ListingPage from '../pages/ListingPage';
import ProductPage from '../pages/productPage';
import Dashboard from '../pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jumia" element={<ListingPage category="jumia" />} />
        <Route path="/cars" element={<ListingPage category="cars" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:category/product/:productId" element={<ProductPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;

