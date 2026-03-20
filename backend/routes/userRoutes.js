// backend/routes/userRoutes.js

import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.post('/', registerUser);

// Private routes (logged-in user)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// NOTE: /profile must be defined BEFORE /:id
// otherwise Express matches "profile" as an :id param
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;