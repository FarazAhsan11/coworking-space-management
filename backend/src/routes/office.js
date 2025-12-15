import express from 'express';
import { getAllCustomers } from '../controllers/customerController.js';
import { getAllOrders, getTodayOrders, createOrder, completeOrder } from '../controllers/orderController.js';
import { getAllGuests, getTodayGuests, createGuest, completeGuest } from '../controllers/guestController.js';
import { getAllAttendance, getTodayAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/customers', getAllCustomers);


router.get('/orders', getAllOrders);
router.get('/orders/today', getTodayOrders);
router.post('/orders', createOrder);
router.put('/orders/:id/complete', completeOrder);

router.get('/guests', getAllGuests);
router.get('/guests/today', getTodayGuests);
router.post('/guests', createGuest);
router.put('/guests/:id/complete', completeGuest);


router.get('/attendance', getAllAttendance);
router.get('/attendance/today', getTodayAttendance);
router.post('/attendance/checkin', checkIn);
router.post('/attendance/checkout', checkOut);

export default router;