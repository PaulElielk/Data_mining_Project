// ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function ProductPage() {
  const { productId, category } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dedupeRecommendations = (items) => {
    if (!Array.isArray(items)) return [];
    if (category !== 'jumia') return items;
    const seen = new Set();
    return items.filter((item) => {
      const key = String(
        item?.id ??
        item?.productId ??
        `${item?.name ?? ''}-${item?.price ?? ''}`
      );
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productRes, recommendationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products/${category}/${productId}`),
          axios.get(`${API_BASE_URL}/api/products/${category}/${productId}/recommendations`)
        ]);
        if (!isMounted) return;
        setProduct(productRes.data || null);
        const recommendations = Array.isArray(recommendationsRes.data)
          ? recommendationsRes.data
          : [];
        setRelatedItems(dedupeRecommendations(recommendations));
      } catch (err) {
        console.error('Failed to fetch product or recommendations:', err);
        if (isMounted) {
          setError('Unable to load this product right now.');
          setProduct(null);
          setRelatedItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    if (category && productId) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [productId, category]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      setRecentlyViewed(Array.isArray(stored) ? stored : []);
    } catch (error) {
      console.error('Failed to parse recently viewed list:', error);
      localStorage.removeItem('recentlyViewed');
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    if (!product || typeof window === 'undefined') return;

    const entry = {
      id: String(product.id || productId),
      category,
      name: product.name,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl,
    };

    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const filtered = stored.filter(
        (item) => !(item.id === entry.id && item.category === entry.category)
      );
      const updated = [entry, ...filtered].slice(0, 6);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentlyViewed(updated);
    } catch (error) {
      console.error('Failed to store recently viewed item:', error);
    }
  }, [product, productId, category]);

  useEffect(() => {
    if (!product || typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      const exists = stored.some(
        (item) => item.id === String(product.id || productId) && item.category === category
      );
      setIsFavorite(exists);
    } catch (error) {
      console.error('Failed to read favorites list:', error);
      setIsFavorite(false);
    }
  }, [product, productId, category]);

  const handleToggleFavorite = () => {
    if (!product || typeof window === 'undefined') return;
    const entry = {
      id: String(product.id || productId),
      category,
      name: product.name,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl,
    };

    try {
      const stored = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      const exists = stored.some(
        (item) => item.id === entry.id && item.category === entry.category
      );

      let updated;
      if (exists) {
        updated = stored.filter(
          (item) => !(item.id === entry.id && item.category === entry.category)
        );
      } else {
        updated = [entry, ...stored].slice(0, 30);
      }

      localStorage.setItem('favoriteProducts', JSON.stringify(updated));
      setIsFavorite(!exists);
    } catch (error) {
      console.error('Failed to update favorites list:', error);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="loading-state">
        {error || 'Product not found.'}
      </div>
    );
  }

  const recentlyViewedToShow = recentlyViewed.filter(
    (item) => item.id !== String(product.id || productId) || item.category !== category
  );

  const recommendationTitle = category === 'jumia' ? 'Users Also Bought With' : 'Recommended For You';

  return (
    <motion.div 
      className={`product-page product-page-${category}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className={`product-detail-container product-detail-${category}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Image section */}
        <motion.div 
          className="product-image product-image-featured"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.img 
            src={product.imageUrl} 
            alt={product.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        {/* Main info/price/specs section */}
        <motion.div 
          className="product-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {product.name}
          </motion.h2>
          <motion.p 
            className="product-desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {product.description}
          </motion.p>
          <div className="price-buy-row">
            <span className="price-tag">
              FCFA {Number(product.price || 0).toLocaleString()}
            </span>
            <button
              type="button"
              className={isFavorite ? 'favorite-toggle active' : 'favorite-toggle'}
              onClick={handleToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
          <div className="product-specs modern-specs">
            {product.brand && <p>🔰 <strong>Brand:</strong> <span className="spec-val">{product.brand}</span></p>}
            {product.storage && <p>💾 <strong>Storage:</strong> <span className="spec-val">{product.storage}</span></p>}
            {product.color && <p style={{color:'#7C3AED'}}>🎨 <strong>Color:</strong> <span className="spec-val">{product.color}</span></p>}
            {product.screenSize && <p>📱 <strong>Screen:</strong> <span className="spec-val">{product.screenSize}</span></p>}
            {product.battery && <p>🔋 <strong>Battery:</strong> <span className="spec-val">{product.battery}</span></p>}
            {product.engine && <p>🚗 <strong>Engine:</strong> <span className="spec-val">{product.engine}</span></p>}
            {product.range && <p>📏 <strong>Range:</strong> <span className="spec-val">{product.range}</span></p>}
            {product.acceleration && <p>⚡ <strong>Acceleration:</strong> <span className="spec-val">{product.acceleration}</span></p>}
            {category === 'cars' && (
              <>
                {product.model && <p><strong>Model: </strong>{product.model}</p>}
                {product.year && <p><strong>Year: </strong>{product.year}</p>}
                {product.location && <p><strong>Location: </strong>{product.location}</p>}
                {product.sellerName && <p><strong>Vendor: </strong>{product.sellerName}</p>}
              </>
            )}
            {category === 'jumia' && (
              <>
                {product.discount && <p style={{color:'#16A34A'}}>💸 <strong>Discount:</strong> <span className="spec-val">{product.discount}</span></p>}
                {product.reviewsRating && <p style={{color:'#EAB308'}}>⭐ <strong>Rating:</strong> <span className="spec-val">{product.reviewsRating}</span></p>}
                {product.reviewsCount && <p>💬 <strong>Reviews:</strong> <span className="spec-val">{product.reviewsCount}</span></p>}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
      <motion.h3 
        className="related-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {recommendationTitle}
      </motion.h3>
      <motion.div 
        className="related-items-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {relatedItems.length ? (
          relatedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <ProductCard product={item} category={category} />
            </motion.div>
          ))
        ) : (
          <p className="empty-state subtle">
            No recommendation data available for this item yet.
          </p>
        )}
      </motion.div>

      {recentlyViewedToShow.length > 0 && (
        <section className="recently-viewed-section">
          <h3 className="recently-viewed-title">Recently Viewed</h3>
          <div className="recently-viewed-grid">
            {recentlyViewedToShow.map((item) => (
              <ProductCard
                key={`${item.category}-${item.id}`}
                product={{ ...item, price: item.price }}
                category={item.category}
              />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

export default ProductPage;




