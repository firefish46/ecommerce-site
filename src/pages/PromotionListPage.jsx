import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: promoData } = await axios.get('/api/promotions');
      const { data: prodData } = await axios.get('/api/products/all', config);
      setPromotions(promoData);
      setProductList(prodData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      Swal.fire('Error', 'Upload failed', 'error');
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
        const selectedProd = productList.find(p => p._id === selectedProductId);
        if (selectedProd) finalImage = selectedProd.image;
    }

    if (!finalImage) {
        return Swal.fire('Wait!', 'Please upload an image or select a product first', 'warning');
    }

    const finalLink = selectedProductId ? `/product/${selectedProductId}` : '/';
    const payload = { title, subtitle, image: finalImage, type, link: finalLink, expiresAt: expiresAt || null };

    const config = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      if (isEditing) {
        await axios.put(`/api/promotions/${currentId}`, payload, config);
      } else {
        await axios.post('/api/promotions', payload, config);
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
      text: "This promotion will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.delete(`/api/promotions/${id}`, config);
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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Marketing & Promotions</h1>
          <p style={subtitleStyle}>Create and manage homepage banners and flash deals.</p>
        </div>
        <button className='Edit-btn' onClick={() => { resetForm(); setShowModal(true); }} style={createBtnStyle}>
          + Create New Ad
        </button>
      </div>

      {loading ? (
        <div style={loadingStyle}>Loading Promotions...</div>
      ) : (
        <div style={cardWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={thStyle}>Preview</th>
                <th style={thStyle}>Campaign Title</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Expiry</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo._id} style={rowStyle}>
                  <td style={tdStyle}>
                    <img src={promo.image} alt="" style={previewImgStyle} />
                  </td>
                  <td style={tdStyle}>
                    <div style={campaignNameStyle}>{promo.title}</div>
                    <div style={campaignSubStyle}>{promo.subtitle}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={promo.type === 'Deal' ? dealBadge : sliderBadge}>
                      {promo.type === 'Deal' ? 'Flash Deal' : 'Hero Slider'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {promo.expiresAt ? (
                        <span style={dateStyle}>{new Date(promo.expiresAt).toLocaleDateString()}</span>
                    ) : (
                        <span style={{ color: '#ccc' }}>Permanent</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button className='Edit-btn' onClick={() => editHandler(promo)} style={editActionBtn}>Edit</button>
                    <button className='delete-btn' onClick={() => deleteHandler(promo._id)} style={deleteActionBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={modalOverlay}>
          <form style={modalContent} onSubmit={submitHandler}>
            <div style={modalHeader}>
                <h3 style={{ margin: 0 }}>{isEditing ? 'Update Campaign' : 'Launch New Campaign'}</h3>
                <button className='cancelbtn' type="button" onClick={resetForm} style={closeX}> <i class="fa-regular fa-circle-xmark"></i></button>
            </div>
            
            <div style={sampleBox}>
                <small style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Quick Templates:</small>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="button" onClick={() => applySample("FLASH SALE!", "Limited time discount")} style={sampleBtn}>Flash Sale</button>
                    <button type="button" onClick={() => applySample("NEW SEASON", "Check the latest arrivals")} style={sampleBtn}>New Season</button>
                </div>
            </div>

            <label style={labelStyle}>Campaign Title</label>
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Clearance" required />
            
            <label style={labelStyle}>Subtitle</label>
            <input style={input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Up to 50% Off" required />

            <div style={flexRow}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Ad Type</label>
                <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Slider">Hero Slider</option>
                  <option value="Deal">Flash Deal Card</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Link to Product</label>
                <select style={input} value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required>
                  <option value="">-- Select --</option>
                  {productList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <label style={labelStyle}>Expiration Date (Optional)</label>
            <input type="datetime-local" style={input} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />

            <label style={labelStyle}>Visual Asset</label>
            <div style={uploadContainer}>
                <input type="file" onChange={uploadFileHandler} style={{ fontSize: '12px', fontFamily: "'Hubot Sans', sans-serif" }} />
                {image && <span style={successText}>✓ Asset Ready</span>}
            </div>

            <div style={modalFooter}>
              <button className='button_submit' type="submit" disabled={uploading} style={saveBtn}>
                {uploading ? 'Uploading...' : isEditing ? 'Save Changes' : 'Create Promotion'}
              </button>
              <button className='cancelBtn' type="button" onClick={resetForm} style={secondaryBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Hubot Sans', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '28px', fontWeight: '800', margin: 0, color: '#1a1a1a' };
const subtitleStyle = { color: '#666', marginTop: '5px', fontSize: '14px' };
const createBtnStyle = { padding: '12px 24px', backgroundColor: '#81797998', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

const cardWrapper = { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRowStyle = { backgroundColor: '#fafafa', borderBottom: '1px solid #eee' };
const thStyle = { padding: '16px 20px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rowStyle = { borderBottom: '1px solid #f8f8f8' };
const tdStyle = { padding: '16px 20px', fontSize: '14px', verticalAlign: 'middle' };

const previewImgStyle = { width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' };
const campaignNameStyle = { fontWeight: '700', color: '#1a1a1a' };
const campaignSubStyle = { fontSize: '12px', color: '#888' };

const dealBadge = { padding: '4px 10px', backgroundColor: '#fff0f0', color: '#e74c3c', borderRadius: '6px', fontSize: '10px', fontWeight: '800' };
const sliderBadge = { padding: '4px 10px', backgroundColor: '#f0f5ff', color: '#0050b3', borderRadius: '6px', fontSize: '10px', fontWeight: '800' };
const dateStyle = { fontSize: '12px', color: '#555', fontWeight: '500' };

const editActionBtn = { background: 'none', color: '#0d76ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginRight: '15px' };
const deleteActionBtn = { background: 'none',  color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '480px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const closeX = { fontSize: '24px', cursor: 'pointer', color: '#db7474ff' };

const sampleBox = { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '10px', marginBottom: '20px' };
const sampleBtn = { fontSize: '11px', padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff' };

const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#444', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
const input = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', boxSizing: 'border-box', fontSize: '14px', fontFamily: "'Hubot Sans', sans-serif" };
const flexRow = { display: 'flex', gap: '15px' };

const uploadContainer = { border: '1px dashed #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const successText = { color: '#28a745', fontSize: '11px', fontWeight: 'bold' };

const modalFooter = { display: 'flex', gap: '12px', marginTop: '10px' };
const saveBtn = { flex: 2, padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', fontFamily: "'Hubot Sans', sans-serif" };
const secondaryBtn = { flex: 1, padding: '14px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const loadingStyle = { padding: '100px', textAlign: 'center', color: '#888' };

export default PromotionListPage;