import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import jumiaRaw from '../jumia_products.json';
import coinAfriqueRaw from '../coin_afrique_cars.json';

const MAX_RESULTS = 8;

const extractTableData = (raw, tableName) => {
  if (!Array.isArray(raw)) return [];
  const tableEntry = raw.find(
    (entry) => entry?.type === 'table' && entry?.name === tableName
  );
  return Array.isArray(tableEntry?.data) ? tableEntry.data : [];
};

const parsePrice = (value) => {
  if (value === null || value === undefined) return null;
  const numeric = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
};

const normalizeJumiaData = () => {
  const rows = extractTableData(jumiaRaw, 'jumia_products');
  return rows.map((item) => {
    const title = item.brand_name || item.product_name || 'Produit Jumia';
    const subtitle = item.product_name || item.brand_name || '';
    const extraParts = [
      item.discount ? `${item.discount} off` : null,
      item.reviews_rating ? `⭐ ${item.reviews_rating}` : null,
      item.reviews_count ? `${item.reviews_count} avis` : null,
    ].filter(Boolean);

    return {
      id: String(item.jumia_product_id),
      category: 'jumia',
      title,
      subtitle,
      description: item.product_name || '',
      brand: item.brand_name || 'Jumia',
      extra: extraParts.join(' · ') || null,
      price: parsePrice(item.Price),
      categoryValue: item.brand_name || 'Autres',
      imageUrl: item.image_url,
    };
  });
};

const normalizeCoinAfriqueData = () => {
  const rows = extractTableData(coinAfriqueRaw, 'coin_afrique_cars');
  return rows.map((item) => {
    const title = [item.brand, item.model].filter(Boolean).join(' ').trim() || 'Annonce CoinAfrique';
    const subtitleParts = [
      item.location,
      item.year ? `Année ${item.year}` : null,
    ].filter(Boolean);

    return {
      id: String(item.coin_afrique_id),
      category: 'cars',
      title,
      subtitle: subtitleParts.join(' · '),
      description: item.model || '',
      brand: item.brand || 'Autres',
      extra: item.seller_name || null,
      price: parsePrice(item.Price),
      categoryValue: item.brand || 'Autres',
      imageUrl: item.image_url,
    };
  });
};

const JUMIA_DATA = normalizeJumiaData();
const COIN_AFRIQUE_DATA = normalizeCoinAfriqueData();

const DATA_SOURCES = {
  jumia: {
    label: 'Jumia',
    placeholder: 'Search Jumia deals…',
    searchKeys: ['title', 'subtitle', 'brand', 'extra'],
    data: JUMIA_DATA,
  },
  cars: {
    label: 'CoinAfrique Cars',
    placeholder: 'Search cars, sellers, locations…',
    searchKeys: ['title', 'subtitle', 'brand', 'extra'],
    data: COIN_AFRIQUE_DATA,
  },
};

const highlightMatch = (text = '', matches = []) => {
  if (!matches.length || !text) return text;

  const ranges = matches.flatMap((match) => match.indices);
  if (!ranges.length) return text;

  const sortedRanges = ranges
    .map(([start, end]) => [Math.max(0, start), Math.min(text.length - 1, end)])
    .sort((a, b) => a[0] - b[0]);

  const segments = [];
  let lastIndex = 0;

  sortedRanges.forEach(([start, end], idx) => {
    const safeStart = Math.max(start, lastIndex);
    if (safeStart > lastIndex) {
      segments.push(text.slice(lastIndex, safeStart));
    }
    segments.push(
      <mark className="search-highlight" key={`${safeStart}-${end}-${idx}`}>
        {text.slice(safeStart, end + 1)}
      </mark>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
};

const formatPrice = (value) => {
  if (value === null || value === undefined) return null;
  return `XOF ${Number(value).toLocaleString('fr-FR')}`;
};

const SmartSearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [activeSource, setActiveSource] = useState('jumia');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setResults([]);
      setActiveIdx(-1);
    }
  }, [query]);

  const currentConfig = DATA_SOURCES[activeSource];
  const fuse = useMemo(() => {
    if (!currentConfig.data.length) return null;
    return new Fuse(currentConfig.data, {
      keys: currentConfig.searchKeys,
      includeMatches: true,
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [currentConfig]);

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setActiveIdx(-1);
      return;
    }
    const searchResults = fuse.search(query).slice(0, MAX_RESULTS);
    setResults(searchResults);
    setActiveIdx(searchResults.length ? 0 : -1);
  }, [query, fuse]);

  const handleSelect = (item) => {
    if (!item) return;
    onSelect && onSelect(item);
    if (item.category && item.id) {
      navigate(`/${item.category}/product/${item.id}`);
    }
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const handleKeyDown = (event) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIdx((idx) => Math.min(idx + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIdx((idx) => Math.max(idx - 1, 0));
    } else if (event.key === 'Enter' && results[activeIdx]) {
      event.preventDefault();
      handleSelect(results[activeIdx].item);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const hasResultsPanel = isOpen && query.trim().length > 0;

  return (
    <div className="smart-search-bar" ref={wrapperRef}>
      <div className="smart-search-inner">
        <div className="search-controls">
          <div className="dataset-toggle" role="tablist" aria-label="Data source">
            {Object.entries(DATA_SOURCES).map(([key, config]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeSource === key}
                className={`dataset-option ${activeSource === key ? 'active' : ''}`}
                onClick={() => setActiveSource(key)}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <div className="search-field-wrapper">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder={currentConfig.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            autoComplete="off"
            spellCheck="false"
            aria-expanded={hasResultsPanel}
            aria-activedescendant={
              activeIdx >= 0 && results[activeIdx]
                ? `search-option-${results[activeIdx].item.id}`
                : undefined
            }
            aria-controls="smart-search-results"
          />
          <button
            type="button"
            className={`clear-search ${query ? 'visible' : ''}`}
            onClick={() => setQuery('')}
            aria-label="Clear search"
            disabled={!query}
          >
            ×
          </button>
        </div>
      </div>

      {hasResultsPanel && (
        <div className="smart-search-results" id="smart-search-results">
          {results.length === 0 ? (
            <p className="search-feedback">No matches found.</p>
          ) : (
            <ul className="search-results-list" role="listbox">
              {results.map((res, idx) => (
                <li
                  key={res.item.id}
                  id={`search-option-${res.item.id}`}
                  role="option"
                  aria-selected={idx === activeIdx}
                  className={`search-result-item ${idx === activeIdx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseDown={() => handleSelect(res.item)}
                >
                  <div className="search-result-title">
                    {highlightMatch(
                      res.item.title,
                      res.matches?.filter((match) => match.key === 'title') || []
                    )}
                  </div>
                  <div className="search-result-desc">
                    {highlightMatch(
                      res.item.subtitle,
                      res.matches?.filter((match) => match.key === 'subtitle') || []
                    )}
                  </div>
                  <div className="search-result-meta">
                    {res.item.brand && <span>{res.item.brand}</span>}
                    {res.item.extra && <span>{res.item.extra}</span>}
                    {res.item.price !== null && (
                      <span>{formatPrice(res.item.price)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
