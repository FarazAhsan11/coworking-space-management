import express from 'express';
import { getAllAttendance, getTodayAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllAttendance);
router.get('/today', protect, getTodayAttendance);
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);

export default router;