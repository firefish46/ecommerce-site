import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';

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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ _id: productId, name, price, image, brand, category, countInStock, description }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to='/admin/productlist' style={{ textDecoration: 'none', color: '#0d76ff', fontWeight: 'bold' }}>
        ← Back to Product List
      </Link>

      <h1 style={{ margin: '20px 0' }}>Edit Product</h1>

      {loadingUpdate && <p>Updating product...</p>}
      {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}

      {loading ? (
        <p>Loading Product Data...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <form onSubmit={submitHandler} style={formStyle}>
          
          <div style={groupStyle}>
            <label>Name</label>
            <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={groupStyle}>
            <label>Price</label>
            <input style={inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div style={{ ...groupStyle, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px dashed #ccc' }}>
            <label style={{ fontWeight: 'bold' }}>Product Image</label>
            <input 
              style={{ ...inputStyle, marginBottom: '10px', backgroundColor: '#fff' }} 
              type="text" 
              value={image} 
              readOnly 
              placeholder="Cloudinary URL will appear here"
            />
            
            <input type="file" onChange={uploadFileHandler} style={{ fontSize: '14px' }} />

            {uploading && (
              <div style={loaderStyle}>
                <div className="spinner"></div> 
                <span>Uploading to Cloudinary...</span>
              </div>
            )}

            {!uploading && image && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Current Preview:</p>
                <img src={image} alt="preview" style={previewStyle} />
              </div>
            )}
          </div>

          <div style={groupStyle}>
            <label>Brand</label>
            <input style={inputStyle} type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>

          <div style={groupStyle}>
            <label>Category</label>
            <input style={inputStyle} type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div style={groupStyle}>
            <label>Count In Stock</label>
            <input style={inputStyle} type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          </div>

          <div style={groupStyle}>
            <label>Description</label>
            <textarea 
              style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <button type="submit" style={btnStyle} disabled={uploading}>
            {uploading ? 'Processing Image...' : 'Update Product'}
          </button>
        </form>
      )}
    </div>
  );
};

// --- Styles ---
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const groupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const loaderStyle = { display: 'flex', alignItems: 'center', marginTop: '10px', color: '#0d76ff', fontSize: '14px' };
const previewStyle = { width: '120px', height: '120px', objectFit: 'contain', borderRadius: '8px', border: '2px solid #eee', backgroundColor: '#fff' };
const btnStyle = { padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default ProductEditPage;