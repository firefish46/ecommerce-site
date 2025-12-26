import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Correct Redux hooks
import { useParams } from 'react-router-dom'; // Correct Router hook
import { listProducts } from '../actions/productActions'; // Import your action
import ProductCard from '../components/ProductCard'; // Correct component import

const HomePage = () => {
  const { keyword } = useParams(); 
  const dispatch = useDispatch();

  // 1. Get data from Redux Store instead of local state
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  // 2. Trigger the Redux Action when the page loads or keyword changes
  useEffect(() => {
    dispatch(listProducts(keyword)); 
  }, [dispatch, keyword]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Latest Products</h1>
      
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3 style={{ color: 'red' }}>Error: {error}</h3>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent:'space-around',
          gap: '30px' 
        }}>
          {/* 3. Render products from Redux state */}
          {products && products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;