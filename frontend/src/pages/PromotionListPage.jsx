import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import '../styles/PromotionListPage.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const PromotionListPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('Slider');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      // FIX 1: use API_URL prefix so Vercel doesn't call itself
      const { data: promoData } = await axios.get(`${API_URL}/api/promotions`);
      const { data: prodData }  = await axios.get(`${API_URL}/api/products/all`, config);

      // FIX 2: guard both responses — API might return an object, null, etc.
      setPromotions(Array.isArray(promoData) ? promoData : []);
      setProductList(Array.isArray(prodData)  ? prodData  : []);
    } catch (error) {
      console.error('fetchData error:', error.message);
      // FIX 3: always reset to safe empty arrays on failure
      setPromotions([]);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const applySample = (t, s) => {
    setTitle(t);
    setSubtitle(s);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);
      setImage(data.image);
    } catch (error) {
      Swal.fire('Error', 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const editHandler = (promo) => {
    setIsEditing(true);
    setCurrentId(promo._id);
    setTitle(promo.title);
    setSubtitle(promo.subtitle);
    setImage(promo.image);
    setType(promo.type);
    setExpiresAt(promo.expiresAt ? promo.expiresAt.substring(0, 16) : '');
    const idFromLink = promo.link ? promo.link.replace('/product/', '') : '';
    setSelectedProductId(idFromLink);
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let finalImage = image;
    if (!finalImage && selectedProductId) {
      const selectedProd = productList.find((p) => p._id === selectedProductId);
      if (selectedProd) finalImage = selectedProd.image;
    }
    if (!finalImage) {
      return Swal.fire('Wait!', 'Please upload an image or select a product first', 'warning');
    }
    const finalLink = selectedProductId ? `/product/${selectedProductId}` : '/';
    const payload = { title, subtitle, image: finalImage, type, link: finalLink, expiresAt: expiresAt || null };
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/promotions/${currentId}`, payload, config);
      } else {
        await axios.post(`${API_URL}/api/promotions`, payload, config);
      }
      Swal.fire({ icon: 'success', title: 'Saved', showConfirmButton: false, timer: 1500 });
      resetForm();
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'Action failed', 'error');
    }
  };

  const deleteHandler = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This promotion will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.delete(`${API_URL}/api/promotions/${id}`, config);
          fetchData();
        } catch (error) {
          Swal.fire('Error', 'Delete failed', 'error');
        }
      }
    });
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setSubtitle('');
    setImage('');
    setSelectedProductId('');
    setExpiresAt('');
  };

  return (
    <div className="promo-container">

      {/* ── Header ── */}
      <div className="promo-header">
        <div>
          <h1 className="promo-title">Marketing & Promotions</h1>
          <p className="promo-subtitle">Create and manage homepage banners and flash deals.</p>
        </div>
        <button className="promo-create-btn" onClick={() => { resetForm(); setShowModal(true); }}>
          + Create New Ad
        </button>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="promo-loading">Loading Promotions...</div>
      ) : promotions.length === 0 ? (
        <div className="promo-empty">No promotions yet. Create your first ad!</div>
      ) : (
        <div className="promo-card-wrapper">
          <div className="promo-table-scroll">
            <table className="promo-table">
              <thead>
                <tr className="promo-header-row">
                  <th className="promo-th">Preview</th>
                  <th className="promo-th">Campaign Title</th>
                  <th className="promo-th">Type</th>
                  <th className="promo-th">Expiry</th>
                  <th className="promo-th promo-th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo._id} className="promo-row">
                    <td className="promo-td">
                      <img src={promo.image} alt="" className="promo-preview-img" />
                    </td>
                    <td className="promo-td">
                      <div className="promo-campaign-name">{promo.title}</div>
                      <div className="promo-campaign-sub">{promo.subtitle}</div>
                    </td>
                    <td className="promo-td">
                      <span className={`promo-badge ${promo.type === 'Deal' ? 'promo-badge--deal' : 'promo-badge--slider'}`}>
                        {promo.type === 'Deal' ? 'Flash Deal' : 'Hero Slider'}
                      </span>
                    </td>
                    <td className="promo-td">
                      {promo.expiresAt ? (
                        <span className="promo-date">{new Date(promo.expiresAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="promo-permanent">Permanent</span>
                      )}
                    </td>
                    <td className="promo-td promo-td--right">
                      <button className="promo-edit-btn" onClick={() => editHandler(promo)}>Edit</button>
                      <button className="promo-delete-btn" onClick={() => deleteHandler(promo._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="promo-modal-overlay">
          <form className="promo-modal" onSubmit={submitHandler}>

            <div className="promo-modal-header">
              <h3 className="promo-modal-title">
                {isEditing ? 'Update Campaign' : 'Launch New Campaign'}
              </h3>
              <button type="button" className="promo-modal-close" onClick={resetForm}>
                <i className="fa-regular fa-circle-xmark"></i>
              </button>
            </div>

            {/* Quick Templates */}
            <div className="promo-sample-box">
              <small className="promo-sample-label">Quick Templates:</small>
              <div className="promo-sample-btns">
                <button type="button" className="promo-sample-btn"
                  onClick={() => applySample('FLASH SALE!', 'Limited time discount')}>
                  Flash Sale
                </button>
                <button type="button" className="promo-sample-btn"
                  onClick={() => applySample('NEW SEASON', 'Check the latest arrivals')}>
                  New Season
                </button>
              </div>
            </div>

            <label className="promo-label">Campaign Title</label>
            <input className="promo-input" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Clearance" required />

            <label className="promo-label">Subtitle</label>
            <input className="promo-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Up to 50% Off" required />

            <div className="promo-flex-row">
              <div className="promo-flex-col">
                <label className="promo-label">Ad Type</label>
                <select className="promo-input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Slider">Hero Slider</option>
                  <option value="Deal">Flash Deal Card</option>
                </select>
              </div>
              <div className="promo-flex-col">
                <label className="promo-label">Link to Product</label>
                <select className="promo-input" value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)} required>
                  <option value="">-- Select --</option>
                  {productList.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="promo-label">Expiration Date (Optional)</label>
            <input type="datetime-local" className="promo-input" value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)} />

            <label className="promo-label">Visual Asset</label>
            <div className="promo-upload-box">
              <input type="file" onChange={uploadFileHandler} className="promo-file-input" />
              {image && <span className="promo-upload-success">✓ Asset Ready</span>}
            </div>

            <div className="promo-modal-footer">
              <button type="submit" className="promo-save-btn" disabled={uploading}>
                {uploading ? 'Uploading...' : isEditing ? 'Save Changes' : 'Create Promotion'}
              </button>
              <button type="button" className="promo-cancel-btn" onClick={resetForm}>Cancel</button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default PromotionListPage;