import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {listAllProducts, listProducts, deleteProduct, createProduct } from '../../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants';
import { formatTaka } from '../../utils/currencyUtils';
import Swal from 'sweetalert2';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest'); // Sorting State

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const { success: successCreate, product: createdProduct } = productCreate;

  useEffect(() => {
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
      dispatch({ type: PRODUCT_CREATE_RESET });
    } else {
     dispatch(listAllProducts());
    }
  }, [dispatch, navigate, successDelete, successCreate, createdProduct]);

  // --- Functions ---
  
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'ID copied to clipboard',
      showConfirmButton: false,
      timer: 1500
    });
  };
const inStockBadge = {
  backgroundColor: '#e8f5e9',
  color: '#042b06ff',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  border: '1px solid #c8e6c9'
};

const outOfStockBadge = {
  backgroundColor: '#ffebee',
  color: '#c62828',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  border: '1px solid #ffcdd2'
};
  const deleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This item will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));
      }
    });
  };

  // --- Sorting Logic ---
  const sortedProducts = products ? [...products].sort((a, b) => {
    if (sortOrder === 'lowPrice') return a.price - b.price;
    if (sortOrder === 'highPrice') return b.price - a.price;
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return new Date(b.createdAt) - new Date(a.createdAt); // Latest default
  }) : [];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header Area */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Inventory Management</h1>
          <p style={{ color: '#7f8c8d' }}>Manage your products, pricing, and stock levels.</p>
        </div>
        <button className='Edit-btn' onClick={() => setShowCreateModal(true)} style={btnStyle}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Create Product
        </button>
      </div>

      {/* Toolbar: Sorting & Stats */}
      <div style={toolbarStyle}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort By:</label>
          <select style={selectStyle} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="latest">Latest Added</option>
            <option value="lowPrice">Price: Low to High</option>
            <option value="highPrice">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
        <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
          Total Products: <strong>{products?.length || 0}</strong>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th>ID (Click to Copy)</th>
                <th>STOCK STATUS</th>
                <th>NAME & BRAND</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product._id} style={trStyle}>
                  {/* ID Column: Faded and click-to-copy */}
                  <td onClick={() => copyToClipboard(product._id)} style={idColumnStyle}>
                    {product._id.substring(0, 8)}...
                  </td>
                  <td>
  {product.countInStock > 0 ? (
    <span style={inStockBadge}>
      {product.countInStock} In Stock
    </span>
  ) : (
    <span style={outOfStockBadge}>
      Out of Stock
    </span>
  )}
</td>
                  {/* Name & Brand Column */}
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#34495e' }}>{product.name}</div>
                    <div style={brandBadgeStyle}>{product.brand || 'No Brand'}</div>
                  </td>
                  
                  <td style={{ fontWeight: '600' }}>{formatTaka(product.price)}</td>
                  
                  <td><span style={categoryBadgeStyle}>{product.category}</span></td>
                  
                  <td style={{ textAlign: 'center' }}>
                    <button className='Edit-btn' onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                      Edit
                    </button>
                    <button className='delete-btn' onClick={() => deleteHandler(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CREATE MODAL (Same as your code) --- */}
      {showCreateModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Create New Product?</h3>
            <p>A sample product will be generated for you to customize.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowCreateModal(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={() => { dispatch(createProduct()); setShowCreateModal(false); }} style={confirmBtnStyle}>Yes, Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Updated Styles ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const toolbarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' };
const selectStyle = { fontFamily: 'Hubot Sans', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' };
const tableContainerStyle = { backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const theadStyle = { backgroundColor: '#f1f2f6', textAlign: 'left', borderBottom: '2px solid #ddd' };
const trStyle = { borderBottom: '1px solid #f1f1f1', transition: '0.2s' };

const idColumnStyle = { 
  fontSize: '11px', 
  color: '#bdc3c7', 
  cursor: 'pointer', 
  fontFamily: 'monospace',
  padding: '15px 10px'
};

const brandBadgeStyle = {
  fontSize: '11px',
  color: '#95a5a6',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const categoryBadgeStyle = {
  backgroundColor: '#e1f5fe',
  color: '#039be5',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const btnStyle = { padding: '10px 25px', backgroundColor: '#000000f5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', width: '400px' };
const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const confirmBtnStyle = { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default ProductListPage;