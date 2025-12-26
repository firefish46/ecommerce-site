import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ display: 'flex' }}>
      <input
        type='text'
        placeholder='Search Products...'
        onChange={(e) => setKeyword(e.target.value)}
        style={{ fontFamily: 'Hubot Sans', padding: '5px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }}
      ></input>
      <button type='submit' style={{ fontFamily: 'Hubot Sans',   padding: '5px 15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '0 4px 4px 0' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBox;