// backend/routes/productRoutes.js

import express from 'express';
import { getProducts,getAllProducts } from '../controllers/productController.js'; // To be created next
import { 
  updateProduct, 
  getProductById ,
  createProduct,
  deleteProduct,
  // ... other imports
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
router.route('/all').get(protect, admin, getAllProducts); // New route for admin to get all products without pagination
router.route('/')
.get(getProducts)
.post(protect, admin, createProduct); // This handles your axios.post('/api/products')
// @desc    Fetch single product
// @route   GET /api/products/:id
router.route('/:id')
.get(getProductById)
.put(protect, admin, updateProduct,createProduct) // <--- Ensure this line exists!
.delete(protect, admin, deleteProduct);
// Add this new route

export default router;