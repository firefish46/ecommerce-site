import express from 'express';
const router = express.Router();
import {getOrderById, addOrderItems, getOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getMyOrders } from '../controllers/orderController.js';

// .post(protect, addOrderItems) handles the Place Order button
// .get(protect, admin, getOrders) handles the Admin order list
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders); // Place this before /:id
router.route('/:id').get(protect, getOrderById);
export default router;
// This matches the GET request from your frontend
