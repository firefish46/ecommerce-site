import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import CountdownTimer from '../components/CountdownTimer';
import '../styles/HomePage.css';

const HomePage = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promotions, setPromotions] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ['All', 'Electronics', 'Laptops', 'Watches', 'Accessories'];

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const fetchPromos = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/promotions');
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Promotion fetch failed, using fallbacks');
      setPromotions([
        { _id: '1', title: 'Summer Tech Sale', subtitle: 'Up to 40% off on all Laptops', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/laptop' },
        { _id: '2', title: 'Smartwatch Deals', subtitle: 'Stay connected on the go', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/watch' },
        { _id: '3', title: 'Audio Experience', subtitle: 'Premium sound quality', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/audio' },
      ]);
    }
  }, []);

  useEffect(() => {
    const currentCat = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
    dispatch(listProducts(keyword, 1, currentCat));
    fetchPromos();
  }, [dispatch, keyword, selectedCategory, fetchPromos]);

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
      {!keyword && sliders.length > 0 && (
        <div className="hero-wrapper">
          {sliders.map((slide, index) => (
            <div
              key={slide._id}
              onClick={() => handleAdClick(slide.link)}
              className="slide-item"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${slide.image})`,
                zIndex: index === currentSlide ? 1 : 0,
              }}
            />
          ))}

          {/* DOT INDICATORS */}
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
          <div className="center-state"><div className="spinner"></div></div>
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
                <div className="center-state"><h3>No items found.</h3></div>
              )}
            </div>

            {/* PAGINATION */}
            {pages > 1 && (
              <div className="pagination-row">
                {[...Array(pages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    className={`pag-btn ${page === x + 1 ? 'active' : ''}`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default HomePage;