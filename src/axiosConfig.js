// frontend/src/axiosConfig.js

import axios from 'axios';

// Get the port from your environment (5001, 5002, etc.)
const BACKEND_PORT = 5001; // <-- **CHANGE THIS TO YOUR CURRENT BACKEND PORT (E.G., 5002)**

const instance = axios.create({
    // Tell Axios to always send requests to the back-end server's full address
    baseURL: `http://localhost:${BACKEND_PORT}/api`, 
});

export default instance;