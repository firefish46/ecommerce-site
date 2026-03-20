// backend/routes/userRoutes.js

import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';
import { getUsers, deleteUser } from '../controllers/userController.js'; // Must match!
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';
import { updateUserProfile } from '../controllers/userController.js';   // Must match!


const router = express.Router();

// The registration route is POST to /api/users
router.route('/').post(registerUser);

// The login route is POST to /api/users/login
router.post('/login', authUser);
router.route('/').get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);

// Example: Get all users (Admin only)
export default router;