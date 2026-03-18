import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';

const HomeScreen = () => {
    console.log("HELLO! HomeScreen is trying to render...");
  const [selectedCategory, setSelectedCategory] = useState('All');

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  // DEBUG: Check what the server is sending back
  console.log('Current Page:', page, 'Total Pages:', pages, 'Products:', products);

  useEffect(() => {
    dispatch(listProducts('', 1, selectedCategory === 'All' ? '' : selectedCategory));
  }, [dispatch, selectedCategory]);
    const categoryBarStyles = { display: 'flex', justifyContent: 'center', marginBottom: '20px' };
  return (
  <div style={{ padding: '20px' }}>
    {/* 1. CATEGORY BAR: This should always show */}
    <div style={categoryBarStyles}>
      {['All', 'Electronics', 'Laptops', 'Watches'].map((cat) => (
        <button 
          key={cat} 
          onClick={() => setSelectedCategory(cat)}
          style={{
             padding: '10px 20px',
             margin: '5px',
             backgroundColor: selectedCategory === cat ? '#000' : '#fff',
             color: selectedCategory === cat ? '#fff' : '#000',
             cursor: 'pointer',
             borderRadius: '5px'
          }}
        >
          {cat}
        </button>
      ))}
    </div>

    {loading ? (
      <h2>Loading...</h2>
    ) : error ? (
      <h3 style={{ color: 'red' }}>{error}</h3>
    ) : (
      <>
        {/* 2. PRODUCT GRID: Added safety check products && products.length */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <h3>No Products Found</h3>
          )}
        </div>

        {/* 3. PAGINATION: Check if pages exists */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          {pages > 0 && [...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => dispatch(listProducts('', x + 1, selectedCategory === 'All' ? '' : selectedCategory))}
              style={{
                margin: '0 5px',
                padding: '10px',
                backgroundColor: page === x + 1 ? '#000' : '#fff',
                color: page === x + 1 ? '#fff' : '#000'
              }}
            >
              {x + 1}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);
};

export default HomeScreen;