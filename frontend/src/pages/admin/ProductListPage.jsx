import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listAllProducts, deleteProduct, createProduct } from '../../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants';
import { formatTaka } from '../../utils/currencyUtils';
import Swal from 'sweetalert2';
import '../../styles/ProductList.css';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');

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

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'ID copied to clipboard',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const deleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) dispatch(deleteProduct(id));
    });
  };

  const sortedProducts = products
    ? [...products].sort((a, b) => {
        if (sortOrder === 'lowPrice')  return a.price - b.price;
        if (sortOrder === 'highPrice') return b.price - a.price;
        if (sortOrder === 'name')      return a.name.localeCompare(b.name);
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    : [];

  return (
    <div className="prodlist-page">

      {/* ── Header ── */}
      <div className="prodlist-header">
        <div>
          <h1 className="prodlist-header-title">Inventory Management</h1>
          <p className="prodlist-header-sub">Manage your products, pricing, and stock levels.</p>
        </div>
        <button className="prodlist-create-btn" onClick={() => setShowCreateModal(true)}>
          <span className="prodlist-create-icon">+</span> Create Product
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="prodlist-toolbar">
        <div>
          <label className="prodlist-sort-label">Sort By:</label>
          <select className="prodlist-select" onChange={(e) => setSortOrder(e.target.value)}>
            <option value="latest">Latest Added</option>
            <option value="lowPrice">Price: Low to High</option>
            <option value="highPrice">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
        <div className="prodlist-total">
          Total Products: <strong>{products?.length || 0}</strong>
        </div>
      </div>

      {/* ── States ── */}
      {loading ? (
        <div className="prodlist-loading">Loading...</div>
      ) : error ? (
        <div className="prodlist-error">{error}</div>
      ) : (
        <div className="prodlist-table-container">
          <div className="prodlist-table-scroll">
            <table className="prodlist-table">
              <thead className="prodlist-thead">
                <tr>
                  <th className="prodlist-th">ID (Click to Copy)</th>
                  <th className="prodlist-th">Stock Status</th>
                  <th className="prodlist-th">Name & Brand</th>
                  <th className="prodlist-th">Price</th>
                  <th className="prodlist-th">Category</th>
                  <th className="prodlist-th prodlist-th--center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  // Inside your tbody mapping:
<tr key={product._id} className="prodlist-tr">
  <td className="prodlist-td prodlist-td--id" data-label="ID" onClick={() => copyToClipboard(product._id)}>
    {product._id.substring(0, 8)}...
  </td>
  
  <td className="prodlist-td" data-label="Status">
    <span className={`prodlist-badge ${product.countInStock > 0 ? 'prodlist-badge--instock' : 'prodlist-badge--outstock'}`}>
      {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
    </span>
  </td>
  
  <td className="prodlist-td" data-label="Product">
    <div className="prodlist-product-name">{product.name}</div>
    <div className="prodlist-brand">{product.brand}</div>
  </td>
  
  <td className="prodlist-td prodlist-td--price" data-label="Price">
    {formatTaka(product.price)}
  </td>
  
  <td className="prodlist-td" data-label="Category">
    <span className="prodlist-badge prodlist-badge--category">{product.category}</span>
  </td>
  
  <td className="prodlist-td prodlist-td--actions" data-label="Actions">
    <button className='Edit-btn' onClick={() => navigate(`/admin/product/${product._id}/edit`)}>Edit</button>
    <button className='delete-btn' onClick={() => deleteHandler(product._id)}>Delete</button>
  </td>
</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="prodlist-modal-overlay">
          <div className="prodlist-modal">
            <h3>Create New Product?</h3>
            <p>A sample product will be generated for you to customize.</p>
            <div className="prodlist-modal-btns">
              <button
                className="prodlist-cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="prodlist-confirm-btn"
                onClick={() => { dispatch(createProduct()); setShowCreateModal(false); }}
              >
                Yes, Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductListPage;