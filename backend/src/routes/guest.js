import express from 'express';
import { getAllGuests, getTodayGuests, createGuest, completeGuest } from '../controllers/guestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllGuests);
router.get('/today', protect, getTodayGuests);
router.post('/', protect, createGuest);
router.put('/:id/complete', protect, completeGuest);

export default router;