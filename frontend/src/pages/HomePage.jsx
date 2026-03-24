import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import CountdownTimer from '../components/CountdownTimer';
import '../styles/HomePage.css';
import ProductSkeleton from '../components/ProductSkeleton';
// Picks up REACT_APP_API_URL on Vercel; falls back to '' (proxy) on localhost
const API_URL = process.env.REACT_APP_API_URL || '';

const HomePage = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promotions, setPromotions] = useState([]);
  const [promosLoading, setPromosLoading] = useState(true); // prevents hero flicker
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ['All', 'Electronics', 'Laptops', 'Watches', 'Accessories'];

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const fetchPromos = useCallback(async () => {
    setPromosLoading(true);
    try {
      // API_URL is '' on localhost (uses CRA proxy) and the full backend URL on Vercel
      const { data } = await axios.get(`${API_URL}/api/promotions`);
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Promotion fetch failed:', err.message);
      // Fallback sliders so hero is never empty on network failure
      setPromotions([
        { _id: '1', title: 'Summer Tech Sale',   subtitle: 'Up to 40% off on all Laptops', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/laptop' },
        { _id: '2', title: 'Smartwatch Deals',   subtitle: 'Stay connected on the go',     image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/watch'  },
        { _id: '3', title: 'Audio Experience',   subtitle: 'Premium sound quality',        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/audio'  },
      ]);
    } finally {
      setPromosLoading(false);
    }
  }, []);

 // Inside HomePage.jsx

// 1. Add a state to track the current page locally
//const [currentPage, setCurrentPage] = useState(1);

// 1. Separate Effect for Promotions (Runs only once on mount)
useEffect(() => {
  fetchPromos();
}, [fetchPromos]); // Removed keyword/category from here

// 2. Effect for Products (Runs when category or search changes)
useEffect(() => {
  //setCurrentPage(1);
  const currentCat = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
  dispatch(listProducts(keyword, 1, currentCat));
  // fetchPromos(); <-- REMOVE THIS LINE FROM HERE
}, [dispatch, keyword, selectedCategory]);

/* 3. Create the "Load More" handler
const loadMoreHandler = () => {
  const nextPage = currentPage + 1;
  const currentCat = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
  
  // Note: You will need to update your Redux action to APPEND 
  // but for now, this will fetch the next set
  dispatch(listProducts(keyword, nextPage, currentCat));
  setCurrentPage(nextPage);
};
*/
  const sliders = useMemo(() => {
    if (!Array.isArray(promotions)) return [];
    return promotions.filter((p) => p.type === 'Slider');
  }, [promotions]);

  useEffect(() => {
    if (sliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliders]);

  const handlePageChange = (p) => {
    dispatch(listProducts(keyword, p, selectedCategory === 'All' ? '' : selectedCategory.toLowerCase()));
    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  const handleAdClick = (targetLink) => {
    if (targetLink) {
      window.scrollTo(0, 0);
      navigate(targetLink);
    }
  };
return (
    <div className="home-page">

      {/* --- HERO SLIDER --- */}
      {!keyword && (
        promosLoading ? (
          <div className="hero-wrapper hero-skeleton" />
        ) : sliders.length > 0 ? (
          <div className="hero-wrapper">
            {sliders.map((slide, index) => (
              <div
                key={slide._id}
                onClick={() => handleAdClick(slide.link)}
                className="slide-item"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  backgroundImage: `linear-gradient(rgba(209, 238, 130, 0.21), rgba(224, 163, 163, 0.16)), url(${slide.image})`,
                  zIndex: index === currentSlide ? 1 : 0,
                }}
              />
            ))}

            <div className="dot-container">
              {sliders.map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                  className="dot"
                  style={{
                    width: index === currentSlide ? '30px' : '8px',
                    backgroundColor: index === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>
        ) : null
      )}

      <div className="home-container">

        {/* --- LIMITED DEALS --- */}
        {!keyword && promotions.filter((p) => p.type === 'Deal').length > 0 && (
          <div className="deals-section">
            <h2 className="section-title">Limited Time Deals</h2>
            <div className="deals-grid">
              {promotions.filter((p) => p.type === 'Deal').map((deal) => (
                <div key={deal._id} className="deal-card" onClick={() => handleAdClick(deal.link)}>
                  <img src={deal.image} alt="deal" className="deal-img" />
                  <div className="deal-body">
                    <div className="deal-header">
                      <span className="deal-badge">FLASH OFFER</span>
                      {deal.expiresAt && (
                        <div className="deal-timer">
                          <CountdownTimer targetDate={deal.expiresAt} />
                        </div>
                      )}
                    </div>
                    <h4 className="deal-title">{deal.title}</h4>
                    <p className="deal-subtitle">{deal.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CATEGORY FILTER BAR --- */}
        <div className="filter-bar">
          <h2 className="section-title">
            {keyword ? `Results for "${keyword}"` : 'Collections'}
          </h2>
          <div className="cat-group">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
      {loading ? (
<div className="product-grid">
    {[...Array(4)].map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
  ) : error ? (
          <div className="center-state"><h3 style={{ color: 'red' }}>{error}</h3></div>
        ) : (
          <>
          
            <div className="product-grid">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                /* EMPTY STATE: Shown when category has no items */
                <div className="no-items-container">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <h3>No products found</h3>
                  <p>We couldn't find any items in the "{selectedCategory}" category.</p>
                  <button onClick={() => setSelectedCategory('All')} className="back-btn">
                    Browse All Products
                  </button>
                </div>
              )}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {/* Logic: Only show if there is more than 1 page AND items exist */}
            {pages > 1 && products.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-wrapper">
                  
                  {/* PREVIOUS BUTTON */}
                  <button 
                    className="pag-nav-btn" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={loading || page === 1}
                  >
                    <i className="fa-solid fa-arrow-left"></i> Previous
                  </button>

                  {/* PAGE NUMBERS */}
                  <div className="page-numbers">
                    {[...Array(pages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => handlePageChange(x + 1)}
                        className={`page-num ${page === x + 1 ? 'active' : ''}`}
                      >
                        {x + 1}
                      </button>
                    ))}
                  </div>

                  {/* NEXT BUTTON */}
                  <button 
                    className="pag-nav-btn" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={loading || page === pages}
                  >
                    Next <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <p className="page-info">Showing page {page} of {pages}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;