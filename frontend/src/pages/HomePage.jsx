import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import CountdownTimer from '../components/CountdownTimer';

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

  // 1. Fetch Products and Promotions
  useEffect(() => {
    const currentCat = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
    dispatch(listProducts(keyword, 1, currentCat));

    const fetchPromos = async () => {
      try {
        const { data } = await axios.get('/api/promotions');
        setPromotions(data);
      } catch (err) {
        // Fallback static data if API fails
        setPromotions([
          { _id: '1', title: 'Summer Tech Sale', subtitle: 'Up to 40% off on all Laptops', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/laptop' },
          { _id: '2', title: 'Smartwatch Deals', subtitle: 'Stay connected on the go', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/watch' },
          { _id: '3', title: 'Audio Experience', subtitle: 'Premium sound quality', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200', type: 'Slider', link: '/search/audio' }
        ]);
      }
    };
    fetchPromos();
  }, [dispatch, keyword, selectedCategory]);

  // 2. Auto-slide Logic
  const sliders = promotions.filter(p => p.type === 'Slider');
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
    <div style={pageStyle}>
      {/* --- HERO SECTION WITH DOT INDICATORS --- */}
      {!keyword && sliders.length > 0 && (
        <div style={heroWrapper}>
          {sliders.map((slide, index) => (
            <div
              key={slide._id}
              onClick={() => handleAdClick(slide.link)}
              style={{
                ...slideItem,
                opacity: index === currentSlide ? 1 : 0,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${slide.image})`,
                zIndex: index === currentSlide ? 1 : 0
              }}
            >
            {/*} <div style={heroText}>
                <h1 style={heroTitle}>{slide.title}</h1>
                <p style={heroSub}>{slide.subtitle}</p>
                <button style={heroBtn}>Explore Now</button>
              </div>
              /*/}
            </div>
            
          ))}

          {/* DOTS INDICATOR */}
          <div style={dotContainer}>
            {sliders.map((_, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                style={{
                  ...dotBase,
                  width: index === currentSlide ? '30px' : '8px',
                  backgroundColor: index === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={container}>
        {/* --- LIMITED DEALS --- */}
        {!keyword && promotions.filter(p => p.type === 'Deal').length > 0 && (
          <div style={dealsSection}>
            <h2 style={sectionTitle}>Limited Time Deals</h2>
            <div style={dealsGrid}>
              {promotions.filter(p => p.type === 'Deal').map(deal => (
                <div key={deal._id} style={dealCard} onClick={() => handleAdClick(deal.link)}>
                  <img src={deal.image} alt="deal" style={dealImg} />
                  <div style={{ flex: 1 }}>
                    <div style={dealHeader}>
                      <span style={dealBadge}>FLASH OFFER</span>
                      {deal.expiresAt && (
                        <div style={timerWrapper}>
                          <CountdownTimer targetDate={deal.expiresAt} />
                        </div>
                      )}
                    </div>
                    <h4 style={{ margin: '5px 0' }}>{deal.title}</h4>
                    <p style={dealSubText}>{deal.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CATEGORY FILTER BAR --- */}
        <div style={filterBar}>
          <h2 style={sectionTitle}>{keyword ? `Results for "${keyword}"` : 'Collections'}</h2>
          <div style={catGroup}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...catBtn,
                  color: selectedCategory === cat ? '#000' : '#888',
                  borderBottom: selectedCategory === cat ? '2px solid #000' : '2px solid transparent'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div style={center}><div className="spinner"></div></div>
        ) : error ? (
          <div style={center}><h3 style={{color: 'red'}}>{error}</h3></div>
        ) : (
          <>
            <div style={productGrid}>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div style={center}><h3>No items found.</h3></div>
              )}
            </div>

            {/* PAGINATION */}
            {pages > 1 && (
              <div style={paginationRow}>
                {[...Array(pages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    style={{
                      ...pagBtn,
                      backgroundColor: page === x + 1 ? '#000' : '#fff',
                      color: page === x + 1 ? '#fff' : '#000'
                    }}
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

// --- STYLES ---
const pageStyle = { backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Hubot Sans', sans-serif" };

const heroWrapper = { 
  position: 'relative', 
  height: '500px', 
  margin: '20px', 
  borderRadius: '30px', 
  overflow: 'hidden', 
  backgroundColor: '#111' 
};

const slideItem = { 
  position: 'absolute', 
  inset: 0, 
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  transition: 'opacity 1s ease-in-out', 
  display: 'flex', 
  alignItems: 'center', 
  padding: '0 80px' 
};


const dotContainer = { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 };
const dotBase = { height: '8px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.4s ease' };

const container = { maxWidth: '1300px', margin: '0 auto', padding: '40px 20px' };
const dealsSection = { marginBottom: '60px' };
const sectionTitle = { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' };
const dealsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' };
const dealCard = { display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '20px', cursor: 'pointer', border: '1px solid #f0f0f0' };
const dealImg = { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '15px' };
const dealHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const dealBadge = { fontSize: '10px', fontWeight: '900', color: '#ff4d4f', backgroundColor: '#fff1f0', padding: '4px 10px', borderRadius: '6px' };
const timerWrapper = { fontSize: '12px', fontWeight: 'bold' };
const dealSubText = { fontSize: '13px', color: '#666' };

const filterBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #eee' };
const catGroup = { display: 'flex', gap: '30px' };
const catBtn = { background: 'none', border: 'none', padding: '20px 0', cursor: 'pointer', fontWeight: '700', fontSize: '14px' };

const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' };
const center = { textAlign: 'center', padding: '100px 0' };
const paginationRow = { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px' };
const pagBtn = { width: '45px', height: '45px', border: '1px solid #eee', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

export default HomePage;