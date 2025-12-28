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

  // --- QUICK TEXT SAMPLES ---
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
    
    // 1. Determine the Image (Manual upload OR Product image)
    let finalImage = image;
    if (!finalImage && selectedProductId) {
        const selectedProd = productList.find(p => p._id === selectedProductId);
        if (selectedProd) finalImage = selectedProd.image;
    }

    if (!finalImage) {
        return Swal.fire('Wait!', 'Please upload an image or select a product first', 'warning');
    }

    const finalLink = selectedProductId ? `/product/${selectedProductId}` : '/';
    
    // 2. Prepare the payload
    const payload = { 
      title, 
      subtitle, 
      image: finalImage, 
      type, 
      link: finalLink, 
      expiresAt: expiresAt || null // Ensure empty string becomes null for the DB
    };

    // DEBUG: Open your browser console (F12) and check this log!
    console.log("SENDING TO BACKEND:", payload);

    const config = {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      if (isEditing) {
        await axios.put(`/api/promotions/${currentId}`, payload, config);
      } else {
        await axios.post('/api/promotions', payload, config);
      }
      Swal.fire('Success', 'Promotion saved!', 'success');
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error.response ? error.response.data : error);
      Swal.fire('Error', 'Action failed', 'error');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this promotion?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/promotions/${id}`, config);
        fetchData();
      } catch (error) {
        Swal.fire('Error', 'Delete failed', 'error');
      }
    }
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
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Ad Management</h2>
        <button onClick={() => { resetForm(); setShowModal(true); }} style={addBtn}>+ Create Ad</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={thStyle}>PREVIEW</th>
              <th style={thStyle}>TITLE</th>
              <th style={thStyle}>TYPE</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}><img src={promo.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td style={tdStyle}>{promo.title}</td>
                <td style={tdStyle}>{promo.type}</td>
                <td style={tdStyle}>
                  <button onClick={() => editHandler(promo)} style={editBtn}>Edit</button>
                  <button onClick={() => deleteHandler(promo._id)} style={delBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div style={modalOverlay}>
          <form style={modalContent} onSubmit={submitHandler}>
            <h3>{isEditing ? 'Edit Ad' : 'New Ad'}</h3>
            
            <div style={{ marginBottom: '10px' }}>
                <small style={{color: '#888'}}>Quick Fill Samples:</small><br/>
                <button type="button" onClick={() => applySample("FLASH SALE!", "Up to 50% discount today only")} style={sampleBtn}>Flash</button>
                <button type="button" onClick={() => applySample("NEW ARRIVAL", "Check out our latest tech stock")} style={sampleBtn}>New</button>
                <button type="button" onClick={() => applySample("PREMIUM CHOICE", "Handpicked products for you")} style={sampleBtn}>Premium</button>
            </div>

            <label style={labelStyle}>Title</label>
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <label style={labelStyle}>Subtitle</label>
            <input style={input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Type</label>
                <select style={input} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Slider">Hero Slider</option>
                  <option value="Deal">Flash Deal Card</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Linked Product</label>
                <select style={input} value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required>
                  <option value="">-- Choose Product --</option>
                  {productList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <label style={labelStyle}>End Date (Optional for Deals)</label>
            <input type="datetime-local" style={input} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />

            <label style={labelStyle}>Custom Banner (Optional - If empty, uses product image)</label>
            <input type="file" onChange={uploadFileHandler} style={{ fontSize: '12px' }} />
            {image && <p style={{fontSize: '10px', color: 'green'}}>✓ Image uploaded</p>}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" disabled={uploading} style={saveBtn}>Save Promotion</button>
              <button type="button" onClick={resetForm} style={cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Styles (including new sampleBtn)
const sampleBtn = { fontSize: '10px', padding: '4px 8px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', background: '#f9f9f9' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '12px', textAlign: 'left', fontSize: '13px' };
const tdStyle = { padding: '12px', fontSize: '14px' };
const addBtn = { padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const editBtn = { marginRight: '10px', color: '#007bff', border: 'none', background: 'none', cursor: 'pointer' };
const delBtn = { color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '450px' };
const input = { padding: '10px', border: '1px solid #ddd', borderRadius: '6px', width: '100%', marginBottom: '10px' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#666' };
const saveBtn = { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', flex: 1, cursor: 'pointer' };
const cancelBtn = { padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', flex: 1, cursor: 'pointer' };

export default PromotionListPage;