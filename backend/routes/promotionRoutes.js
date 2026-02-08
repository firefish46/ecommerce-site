import express from 'express';
const router = express.Router();
import { 
  getPromotions, 
  createPromotion, 
  deletePromotion ,
  updatePromotion
} from '../controllers/promotionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion);

router.route('/:id')
    .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion);

export default router;