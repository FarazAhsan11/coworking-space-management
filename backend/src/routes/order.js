import express from 'express';
import { getAllOrders, getTodayOrders, createOrder, completeOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllOrders);
router.get('/today', protect, getTodayOrders);
router.post('/', protect, createOrder);
router.put('/:id/complete', protect, completeOrder);

export default router;