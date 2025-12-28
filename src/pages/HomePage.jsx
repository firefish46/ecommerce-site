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

  useEffect(() => {
    const currentCat = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
    dispatch(listProducts(keyword, 1, currentCat));

    const fetchPromos = async () => {
      try {
        const { data } = await axios.get('/api/promotions');
        setPromotions(data);
      } catch (err) {
        setPromotions([
          { _id: '1', title: 'Summer Tech Sale', subtitle: 'Up to 40% off on all Laptops', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200', type: 'Slider', link: '/' },
          { _id: '2', title: 'Smartwatch Deals', subtitle: 'Stay connected on the go', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200', type: 'Slider', link: '/' }
        ]);
      }
    };
    fetchPromos();
  }, [dispatch, keyword, selectedCategory]);

  const sliders = promotions.filter(p => p.type === 'Slider');
  useEffect(() => {
    if (sliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
      }, 5000); // Set to 5s for better UX
      return () => clearInterval(interval);
    }
  }, [sliders]);

  const handlePageChange = (p) => {
    dispatch(listProducts(keyword, p, selectedCategory === 'All' ? '' : selectedCategory.toLowerCase()));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleAdClick = (targetLink) => {
    if (targetLink) {
      window.scrollTo(0, 0);
      navigate(targetLink);
    }
  };

  return (
    <div style={pageStyle}>
      {!keyword && sliders.length > 0 && (
        <div style={heroWrapper}>
          {sliders.map((slide, index) => (
            <div
              key={slide._id}
              onClick={() => handleAdClick(slide.link)}
              style={{
                ...slideItem,
                opacity: index === currentSlide ? 1 : 0,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                cursor: 'pointer',
                zIndex: index === currentSlide ? 1 : 0
              }}
            >
              <div style={heroText}></div>
            </div>
          ))}
        </div>
      )}

      <div style={container}>

        {/* --- 2. DEALS SECTION --- */}
{!keyword && promotions.filter(p => p.type === 'Deal').length > 0 && (
  <div style={dealsSection}>
    <h2 style={sectionTitle}>Limited Time Deals</h2>
    <div style={dealsGrid}>
      {promotions.filter(p => p.type === 'Deal').map(deal => (
        <div 
          key={deal._id} 
          style={dealCard}
          onClick={() => handleAdClick(deal.link)}
        >
          <img src={deal.image} alt="deal" style={dealImg} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '5px' }}>
              <span style={dealBadge}>FLASH OFFER</span>
              
              {/* IMPROVED LOGIC: Check if date exists and is valid */}
              {deal.expiresAt ? (
                <div style={timerWrapper}>
                  <small style={{color: '#666', marginRight: '4px'}}>Ends in:</small>
                  <CountdownTimer targetDate={deal.expiresAt} />
                </div>
              ) : (
                <small style={{color: '#ccc', fontSize: '10px'}}>No date set</small>
              )}
            </div>
            
            <h4 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{deal.title}</h4>
            <p style={dealSubText}>{deal.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        <div style={filterBar}>
          <h2 style={sectionTitle}>{keyword ? `Search Results: "${keyword}"` : 'Shop by Category'}</h2>
          <div style={catGroup}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...catBtn,
                  color: selectedCategory === cat ? '#0d76ff' : '#666',
                  borderBottom: selectedCategory === cat ? '2px solid #0d76ff' : '2px solid transparent'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

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
                <div style={center}><h3>No products found in this category.</h3></div>
              )}
            </div>

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
const pageStyle = { backgroundColor: '#fcfcfc', minHeight: '70vh'};
const heroWrapper = { position: 'relative', height: '420px', overflow: 'hidden', backgroundColor: '#000', borderRadius: '20px' };
const slideItem = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 0.8s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '20px' };
const heroText = { textAlign: 'center', maxWidth: '800px', padding: '0 20px' };
const timerWrapper = { display: 'flex', zIndex: 9999, position: 'relative' }; // Adjusted for cleaner look
const container = { maxWidth: '1240px', margin: '0 auto', padding: '50px 20px' };
const dealsSection = { marginBottom: '60px' };
const sectionTitle = { fontSize: '1.8rem', fontWeight: '800', marginBottom: '25px', letterSpacing: '-0.5px' };
const dealsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '25px' };
const dealCard = { display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '15px', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' };
const dealImg = { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' };
const dealBadge = { fontSize: '11px', backgroundColor: '#fff0f0', color: '#e74c3c', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' };
const dealSubText = { fontSize: '13px', color: '#888', margin: 0, lineHeight: '1.4' };
const filterBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' };
const catGroup = { display: 'flex', gap: '25px' };
const catBtn = { background: 'none', border: 'none', padding: '15px 0', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: '0.3s' };
const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '35px' };
const center = { textAlign: 'center', padding: '80px', width: '100%' };
const paginationRow = { display: 'flex', justifyContent: 'center', marginTop: '60px', gap: '12px' };
const pagBtn = { width: '45px', height: '45px', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };

export default HomePage;