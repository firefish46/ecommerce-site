// frontend/src/axiosConfig.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`  // production: from .env
  : 'http://localhost:5001/api';             // localhost fallback

const instance = axios.create({ baseURL });

export default instance;