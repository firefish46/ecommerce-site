import React, { useEffect, useState } from 'react'; // Added useState here
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listProducts, deleteProduct, createProduct } from '../../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants';
// Correct way to go up two levels to find the utils folder
import { formatTaka } from '../../utils/currencyUtils';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const { success: successCreate, product: createdProduct } = productCreate;

  useEffect(() => {
    // Only reset and navigate if creation was successful
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
      dispatch({ type: PRODUCT_CREATE_RESET });
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, navigate, successDelete, successCreate, createdProduct]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inventory Management</h1>
        {/* Changed this to open the modal instead of creating directly */}
        <button onClick={() => setShowCreateModal(true)} style={btnStyle}>
          + Create Product
        </button>
      </div>

      {loadingDelete && <p>Deleting...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading Products...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{product._id}</td>
                  <td>{product.name}</td>
                 <td>{formatTaka(product.price)}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      style={{ color: 'red', marginLeft: '10px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {showCreateModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Create New Product?</h3>
            <p>This will create a sample product that you can then edit.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowCreateModal(false)} style={cancelBtnStyle}>
                Cancel
              </button>
              <button
                onClick={() => {
                  createProductHandler();
                  setShowCreateModal(false);
                }}
                style={confirmBtnStyle}
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

// --- Styles ---
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  width: '400px',
};

const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const confirmBtnStyle = { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default ProductListPage;