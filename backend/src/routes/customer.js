import express from 'express';
import { getAllCustomers, getCustomer, updateCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllCustomers);
router.get('/:id', protect, getCustomer);
router.put('/:id', protect, updateCustomer);

export default router;