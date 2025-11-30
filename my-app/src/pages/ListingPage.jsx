import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import '../App.css';

function ListingPage({ category }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('none');
    const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const itemsPerPage = 24;
    const showReviewsSort = category === 'jumia';

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on category change
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${category}`);
                const data = Array.isArray(response.data) ? response.data : [];
                setProducts(data);
                if (data.length) {
                    const numericPrices = data
                      .map((item) => Number(item.price) || 0)
                      .filter((value) => Number.isFinite(value));
                    const minPrice = numericPrices.length ? Math.min(...numericPrices) : 0;
                    const maxPrice = numericPrices.length ? Math.max(...numericPrices) : 0;
                    setPriceBounds({ min: minPrice, max: maxPrice });
                    setPriceRange({ min: minPrice, max: maxPrice });
                } else {
                    setPriceBounds({ min: 0, max: 0 });
                    setPriceRange({ min: 0, max: 0 });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        if (category) {
            fetchProducts();
        }
    }, [category]);

    useEffect(() => {
      if (!products.length) {
        setPriceBounds({ min: 0, max: 0 });
        setPriceRange({ min: 0, max: 0 });
      }
    }, [products]);

    useEffect(() => {
      if (!showReviewsSort && sortOption === 'reviews') {
        setSortOption('none');
      }
    }, [showReviewsSort, sortOption]);

    const formatCurrency = (value) =>
      `FCFA ${Number(value || 0).toLocaleString('fr-FR')}`;

    const handlePriceRangeChange = (type, value) => {
      const numeric = Number(value);
      setPriceRange((prev) => {
        if (type === 'min') {
          const nextMin = Math.min(numeric, prev.max - 1);
          return { ...prev, min: Math.max(priceBounds.min, nextMin) };
        }
        const nextMax = Math.max(numeric, prev.min + 1);
        return { ...prev, max: Math.min(priceBounds.max, nextMax) };
      });
      setCurrentPage(1);
    };

    const resetFilters = () => {
      setSortOption('none');
      setPriceRange({ ...priceBounds });
      setCurrentPage(1);
    };

    const filteredProducts = useMemo(() => {
      if (!products.length) return [];
      return products.filter((item) => {
        const price = Number(item.price) || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }, [products, priceRange]);

    const sortedProducts = useMemo(() => {
      const sorted = [...filteredProducts];
      if (sortOption === 'price-asc') {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortOption === 'price-desc') {
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (showReviewsSort && sortOption === 'reviews') {
        sorted.sort(
          (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
        );
      }
      return sorted;
    }, [filteredProducts, sortOption, showReviewsSort]);
    
    let categoryTitle;
    let categoryIcon;
    let subtitle;
    if (category === 'jumia') {
      categoryTitle = 'Jumia Products';
      categoryIcon = '🛒';
      subtitle = 'Shop a wide range of deals, tech, and daily essentials from Jumia';
    } else if (category === 'cars') {
      categoryTitle = 'Cars';
      categoryIcon = '🚗';
      subtitle = 'Find your perfect ride with our premium selection';
    } else {
      categoryTitle = category;
      categoryIcon = '';
      subtitle = '';
    }
    // Pagination
    const pageCount = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const goToPage = (page) => setCurrentPage(page);
    // Smart Pagination range logic
    let pages = [];
    if (pageCount <= 5) {
      pages = Array.from({length: pageCount}, (_, idx) => idx + 1);
    } else {
      const minPage = Math.max(2, currentPage - 1);
      const maxPage = Math.min(pageCount - 1, currentPage + 1);
      pages = [1];
      if (minPage > 2) pages.push('...');
      for (let i = minPage; i <= maxPage; i++) pages.push(i);
      if (maxPage < pageCount - 1) pages.push('...');
      pages.push(pageCount);
    }
    return (
        <motion.div 
          className={`listing-page listing-page-${category}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="category-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="category-icon">{categoryIcon}</span>
            <h1>{categoryTitle}</h1>
            <p className="category-subtitle">{subtitle}</p>
          </motion.div>
          <motion.div 
            className="listing-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <aside className="filters-sidebar" aria-label="Sorting and filters">
              <div className="filter-section">
                <h3 className="filter-title">Sort By</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="sort"
                      value="none"
                      checked={sortOption === 'none'}
                      onChange={() => setSortOption('none')}
                    />
                    Default order
                  </label>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="sort"
                      value="price-asc"
                      checked={sortOption === 'price-asc'}
                      onChange={() => setSortOption('price-asc')}
                    />
                    Price: Low to High
                  </label>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="sort"
                      value="price-desc"
                      checked={sortOption === 'price-desc'}
                      onChange={() => setSortOption('price-desc')}
                    />
                    Price: High to Low
                  </label>
                  {showReviewsSort && (
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="sort"
                        value="reviews"
                        checked={sortOption === 'reviews'}
                        onChange={() => setSortOption('reviews')}
                      />
                      Reviews count
                    </label>
                  )}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Price Range</h3>
                <div className="price-range-values">
                  <span>{formatCurrency(priceRange.min)}</span>
                  <span>{formatCurrency(priceRange.max)}</span>
                </div>
                <div className="slider-group">
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="price-slider"
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="price-slider"
                  />
                </div>
              </div>

              <button className="reset-filters" onClick={resetFilters}>
                Reset filters
              </button>
            </aside>
            <div className="product-section">
              <div className="product-grid">
                {paginatedProducts.length ? (
                  paginatedProducts.map((prod, index) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <ProductCard product={prod} category={category} />
                    </motion.div>
                  ))
                ) : (
                  <p className="empty-state">
                    No items match your filters. Try adjusting the price range or sorting options.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          {/* Improved Pagination Controls */}
          {pageCount > 1 && (
            <div className="pagination" style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', margin: '2em 0' }}>
              <button className="pag-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
              {pages.map((num, idx) => typeof num === 'string'
                ? <span key={idx} style={{padding: '0 8px', fontWeight: 'bold'}}>…</span>
                : (
                  <button
                    key={num}
                    className={num === currentPage ? 'pag-btn active' : 'pag-btn'}
                    onClick={() => goToPage(num)}
                    disabled={num === currentPage}
                    aria-current={num === currentPage ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ))}
              <button className="pag-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>&raquo;</button>
            </div>
          )}

          <style>{`
            .pag-btn {
              background: #f2f2f2;
              border: none;
              border-radius: 3px;
              padding: 6px 12px;
              margin: 0 2px;
              cursor: pointer;
              font-weight: 500;
              transition: background 0.15s;
            }
            .pag-btn.active, .pag-btn:disabled[aria-current='page'] {
              background: #1976d2;
              color: #fff;
              cursor: default;
            }
            .pag-btn:disabled:not(.active) {
              opacity: 0.5;
              cursor: default;
            }
          `}</style>
        </motion.div>
      );
}
export default ListingPage;
