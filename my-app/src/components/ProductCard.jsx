// in src/components/ProductCard.jsx
import React from 'react';  
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';

function ProductCard({ product, category }) {  
  const confidenceScore = (() => {
    if (!product?.recommendationMeta) return null;
    const numeric = Number(product.recommendationMeta.confidence);
    if (!Number.isFinite(numeric)) return null;
    if (numeric <= 1) {
      return `${Math.round(numeric * 100)}% match`;
    }
    return `${numeric.toFixed(2)} confidence`;
  })();
  const shouldShowConfidence = category === 'cars' && confidenceScore;

  return (
    <motion.div 
      className="product-card"
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/${category}/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-card-media">
          {shouldShowConfidence && (
            <span className="recommendation-chip" aria-label="Recommendation confidence">
              {confidenceScore}
            </span>
          )}
          <motion.img 
            src={product.imageUrl} 
            alt={product.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="info">
          <h3>{product.name}</h3>
          {Number(product.price) > 0 && (
            <p className="price">FCFA {Number(product.price).toLocaleString()}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
