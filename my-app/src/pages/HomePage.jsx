import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function HomePage() {
  const [jumia, setJumia] = useState([]);
  const [cars, setCars] = useState([]);
  const [jumiaLoading, setJumiaLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(true);
  const [jumiaError, setJumiaError] = useState(null);
  const [carsError, setCarsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategory = async (category, setter, setLoading, setError) => {
      setError(null);
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${category}`);
        if (isMounted) setter(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Failed to load ${category} data`, error);
        if (isMounted) setError(`Unable to load ${category} data right now. Please try again later.`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategory('jumia', setJumia, setJumiaLoading, setJumiaError);
    fetchCategory('cars', setCars, setCarsLoading, setCarsError);
    return () => { isMounted = false; };
  }, []);

  const renderPreview = ({ title, subtitle, category, items, loading, error, themeClass, dataSource }) => (
    <div className={`category-preview ${themeClass}`}>
      <div className="category-preview-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <small className="data-source">Source: {dataSource}</small>
        </div>
        <Link to={`/${category}`} className="view-all-link">
          View all {category === 'jumia' ? 'Jumia Products' : 'cars'} →
        </Link>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-indicator">Fetching {category} catalog…</p>
      ) : items.length ? (
        <div className="preview-grid">
          {items.slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item} category={category} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No {category} listings available right now.</p>
      )}
    </div>
  );

  return (
    <motion.div 
      className="homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="homepage-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to Product Store
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Your one-stop destination for the latest products from Jumia and premium cars.
            Discover top tech, quality items, and automotive excellence—all in one place.
          </motion.p>
        </div>
      </motion.div>
      <motion.div 
        className="homepage-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>About Us</h2>
          <p>
            Product Store is your trusted partner for finding great products with ease.
            We offer a curated selection of the latest and greatest from top brands and marketplaces, featuring
            both quality merchandise and your dream vehicles.
          </p>
          <motion.div 
            className="features-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              { icon: '✨', title: 'Quality Products', desc: 'Carefully selected premium products from trusted brands' },
              { icon: '💰', title: 'Competitive Prices', desc: 'Best prices guaranteed with transparent pricing' },
              { icon: '🚀', title: 'Latest Technology', desc: 'Stay ahead with the newest innovations and features' },
              { icon: '🛡️', title: 'Trusted Service', desc: 'Reliable service and support for all your needs' }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div 
          className="categories-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Explore Our Categories</h2>
          <p className="categories-subtitle">Choose a category to start browsing our collection</p>
          <div className="category-cards">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to="/jumia" className="category-card category-card-jumia">
                <div className="category-card-content">
                  <span className="category-card-icon">🛒</span>
                  <h3>Jumia Products</h3>
                  <p>Shop a wide array of top deals & everyday goods</p>
                  <ul className="category-features">
                    <li>Phones, accessories, electronics, fashion, and more</li>
                    <li>Popular household items and deals</li>
                    <li>Trusted Jumia merchant listings</li>
                  </ul>
                  <button className="category-button">Explore Jumia Products →</button>
                </div>
                <div className="category-card-overlay"></div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to="/cars" className="category-card category-card-cars">
                <div className="category-card-content">
                  <span className="category-card-icon">🚗</span>
                  <h3>Cars</h3>
                  <p>Find your perfect ride</p>
                  <ul className="category-features">
                    <li>Electric & hybrid vehicles</li>
                    <li>Luxury sedans & SUVs</li>
                    <li>High-performance models</li>
                    <li>Premium automotive brands</li>
                  </ul>
                  <button className="category-button">Explore Cars →</button>
                </div>
                <div className="category-card-overlay"></div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        {renderPreview({
          title: 'Latest Jumia Products',
          subtitle: 'Mapped from live Jumia listings with up-to-date pricing',
          category: 'jumia',
          items: jumia,
          loading: jumiaLoading,
          error: jumiaError,
          themeClass: 'category-preview-jumia',
          dataSource: 'Jumia'
        })}
        {renderPreview({
          title: 'Featured Cars',
          subtitle: 'Real vehicles curated from CoinAfrique marketplace feeds',
          category: 'cars',
          items: cars,
          loading: carsLoading,
          error: carsError,
          themeClass: 'category-preview-cars',
          dataSource: 'CoinAfrique'
        })}
      </motion.div>
    </motion.div>
  );
}

export default HomePage;

