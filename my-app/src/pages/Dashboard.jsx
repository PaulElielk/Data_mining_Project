import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import '../App.css';

const ACCOUNT = {
  name: 'Paul-Eliel KOUAME',
  dob: '24 Jan 2005',
  membership: 'Premium Member',
  location: "Abidjan, Côte d'Ivoire",
};

const readCollection = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to parse ${key}`, error);
    return [];
  }
};

function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const refreshData = () => {
    setFavorites(readCollection('favoriteProducts'));
    setHistory(readCollection('recentlyViewed'));
  };

  useEffect(() => {
    refreshData();
    // Refresh when component becomes visible (user navigates back to dashboard)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const stats = useMemo(
    () => ({
      favorites: favorites.length,
      history: history.length,
      categories: new Set(favorites.map((item) => item.category)).size || 0,
    }),
    [favorites, history]
  );

  return (
    <motion.div 
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header 
        className="dashboard-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <p className="dashboard-eyebrow">Personal console</p>
          <h1>Welcome back, {ACCOUNT.name.split(' ')[0]} 👋</h1>
          <p className="dashboard-subtitle">
            Review your saved favorites, browsing history, and account snapshot prepared for the presentation.
          </p>
        </div>
        <div className="dashboard-quick-links">
          <Link to="/jumia" className="dashboard-chip">Shop Jumia</Link>
          <Link to="/cars" className="dashboard-chip">Browse Cars</Link>
        </div>
      </motion.header>

      <motion.section 
        className="dashboard-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <article className="dashboard-card profile-card">
          <h2>Account Details</h2>
          <p className="profile-name">{ACCOUNT.name}</p>
          <dl>
            <div>
              <dt>Date of Birth</dt>
              <dd>{ACCOUNT.dob}</dd>
            </div>
            <div>
              <dt>Membership</dt>
              <dd>{ACCOUNT.membership}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{ACCOUNT.location}</dd>
            </div>
          </dl>
        </article>
        <article className="dashboard-card stats-card">
          <h2>Your Activity</h2>
          <ul>
            <li>
              <span>{stats.favorites}</span>
              <p>Favorite items</p>
            </li>
            <li>
              <span>{stats.history}</span>
              <p>Recently viewed</p>
            </li>
            <li>
              <span>{stats.categories}</span>
              <p>Categories saved</p>
            </li>
          </ul>
        </article>
      </motion.section>

      <motion.section 
        className="dashboard-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">Wishlist</p>
            <h2>Favorite Products</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={refreshData} 
              className="dashboard-chip subtle"
              style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
              title="Refresh data"
            >
              🔄 Refresh
            </button>
            <Link to="/jumia" className="dashboard-chip subtle">Add more</Link>
          </div>
        </div>
        {favorites.length ? (
          <div className="dashboard-product-grid">
            {favorites.map((item, index) => (
              <motion.div
                key={`${item.category}-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={item} category={item.category} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            You have no favorites yet. Tap the heart icon on a product to save it.
          </div>
        )}
      </motion.section>

      <motion.section 
        className="dashboard-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">History</p>
            <h2>Recently Viewed</h2>
          </div>
          <button 
            onClick={refreshData} 
            className="dashboard-chip subtle"
            style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </div>
        {history.length ? (
          <ol className="history-list">
            {history.map((item) => (
              <li key={`history-${item.category}-${item.id}`}>
                <div>
                  <p className="history-title">{item.name}</p>
                  <p className="history-meta">
                    {item.category.toUpperCase()} • FCFA {Number(item.price || 0).toLocaleString()}
                  </p>
                </div>
                <Link to={`/${item.category}/product/${item.id}`} className="history-link">
                  View item
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="dashboard-empty">
            Your browsing history will appear here once you explore products.
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Dashboard;
