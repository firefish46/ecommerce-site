import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';
import '../styles/ProductEditPage.css'; // Importing the separate CSS

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const productDetails = useSelector((state) => state.productDetails || {});
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate || {});
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate('/admin/productlist');
    } else {
      if (!product || !product.name || product._id !== productId) {
        dispatch(getProductDetails(productId));
      } else {
        setName(product.name || '');
        setPrice(product.price || 0);
        setImage(product.image || '');
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || '');
      }
    }
  }, [dispatch, productId, product, successUpdate, navigate]);

  // Helper to handle horizontal increment/decrement
  const handleStep = (setter, value, increment) => {
    const newValue = increment ? Number(value) + 1 : Number(value) - 1;
    if (newValue >= 0) setter(newValue);
  };
const uploadFileHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Optional: Prevent massive files (e.g., > 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("File is too large. Please upload an image under 5MB.");
    return;
  }

  const formData = new FormData();
  
  // REQUIRED: These must match your Cloudinary account exactly
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); 
  formData.append('cloud_name', 'dluiisncl');

  setUploading(true);

  try {
    // Direct POST request to Cloudinary's API
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dluiisncl/image/upload`,
      formData
    );

    // This URL is what gets saved to your MongoDB when you hit "Update Product"
    setImage(data.secure_url); 
    setUploading(false);
  } catch (error) {
    console.error("Cloudinary Error Details:", error.response?.data || error.message);
    setUploading(false);
    
    // Friendly error message for the Admin
    const errorMsg = error.response?.data?.error?.message || "Upload failed.";
    alert(`Error: ${errorMsg}. Ensure 'ml_default' is set to Unsigned.`);
  }
};
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ _id: productId, name, price, image, brand, category, countInStock, description }));
  };

  return (
    <div className="edit-page-container">
      <Link to='/admin/productlist' className="back-link">
        ← Back to Product List
      </Link>

      <h1 className="page-title">Edit Product</h1>

      {loadingUpdate && <p className="status-msg">Updating product...</p>}
      {errorUpdate && <p className="error-msg">{errorUpdate}</p>}

      {loading ? (
        <p className="status-msg">Loading Product Data...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : (
        <form onSubmit={submitHandler} className="edit-form">
          
          <div className="form-group">
            <label>Name</label>
            <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* HORIZONTAL PRICE INPUT */}
          <div className="form-group">
            <label>Price (৳)</label>
            <div className="horizontal-stepper">
              <button type="button" onClick={() => handleStep(setPrice, price, false)}>−</button>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Math.max(0, e.target.value))} 
              />
              <button type="button" onClick={() => handleStep(setPrice, price, true)}>+</button>
            </div>
          </div>

          <div className="form-group upload-section">
            <label>Product Image</label>
            <input className="form-input readonly-input" type="text" value={image} readOnly placeholder="URL will appear here" />
            <input type="file" onChange={uploadFileHandler} className="file-input" />
            {uploading && <p className="uploading-text">Uploading...</p>}
{!uploading && image && (
  <div className="preview-container">
    <img src={image} alt="preview" className="img-preview" />
    <button 
      type="button" 
      className="remove-img-btn"
      onClick={() => setImage('')}
    >
      <i className="fa-solid fa-trash"></i> Remove Image
    </button>
  </div>
)}
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input className="form-input" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="Laptops">Laptops</option>
              <option value="Watches">Watches</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* HORIZONTAL STOCK INPUT */}
          <div className="form-group">
            <label>Count In Stock</label>
            <div className="horizontal-stepper">
              <button type="button" onClick={() => handleStep(setCountInStock, countInStock, false)}>−</button>
              <input 
                type="number" 
                value={countInStock} 
                onChange={(e) => setCountInStock(Math.max(0, e.target.value))} 
              />
              <button type="button" onClick={() => handleStep(setCountInStock, countInStock, true)}>+</button>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-input text-area"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <button type="submit" className="submit-btn Edit-btn" disabled={uploading}>
            {uploading ? 'Processing...' : 'Update Product'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEditPage;