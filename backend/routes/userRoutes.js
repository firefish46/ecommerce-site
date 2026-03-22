// backend/routes/userRoutes.js

import express from 'express';
import {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserById,   // ✅ NEW
  updateUser,    // ✅ NEW
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.route('/').post(registerUser).get(protect, admin, getUsers);

// ✅ /profile MUST come before /:id
// If /:id is defined first, Express matches 'profile' as the :id param → 404
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// /:id routes — always after named routes like /profile
router.route('/:id')
  .get(protect, admin, getUserById)   // ✅ UserEditPage fetch
  .put(protect, admin, updateUser)    // ✅ UserEditPage save
  .delete(protect, admin, deleteUser);

export default router;