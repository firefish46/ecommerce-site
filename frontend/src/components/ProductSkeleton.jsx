// components/ProductSkeleton.jsx
import React from 'react';
import '../styles/ProductSkeleton.css';

const ProductSkeleton = () => {
  return (
    <div className="product-card-container skeleton-active">
      <div className="image-zoom-wrapper">
        <div className="skeleton-img shimmer"></div>
      </div>

      <div className="card-content">
        <div className="skeleton-title shimmer"></div>

        <div className="card-footer-row">
          <div className="price-container">
            <div className="skeleton-price shimmer"></div>
            <div className="skeleton-stock shimmer"></div>
          </div>

          <div className="skeleton-btn-circle shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;