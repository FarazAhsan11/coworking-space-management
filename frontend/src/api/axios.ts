import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && !currentPath.startsWith('/office')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const customerAPI = {
  getAll: () => api.get('/customers'),
  getOne: (id: string) => api.get(`/customers/${id}`),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getToday: () => api.get('/orders/today'),
  create: (data: any) => api.post('/orders', data),
  complete: (id: string) => api.put(`/orders/${id}/complete`),
};

export const guestAPI = {
  getAll: () => api.get('/guests'),
  getToday: () => api.get('/guests/today'),
  create: (data: any) => api.post('/guests', data),
  complete: (id: string) => api.put(`/guests/${id}/complete`),
};

export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getToday: () => api.get('/attendance/today'),
  checkIn: (data: any) => api.post('/attendance/checkin', data),
  checkOut: (data: any) => api.post('/attendance/checkout', data),
};

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Office-Access': 'true', 
  },
});

export const officeAPI = {
  getAllCustomers: () => publicApi.get('/office/customers'),
  getTodayOrders: () => publicApi.get('/office/orders/today'),
  getAllOrders: () => publicApi.get('/office/orders'),
  getTodayGuests: () => publicApi.get('/office/guests/today'),
  getAllGuests: () => publicApi.get('/office/guests'),
  getTodayAttendance: () => publicApi.get('/office/attendance/today'),
  getAllAttendance: () => publicApi.get('/office/attendance'),
  createOrder: (data: any) => publicApi.post('/office/orders', data),
  completeOrder: (id: string) => publicApi.put(`/office/orders/${id}/complete`),
  createGuest: (data: any) => publicApi.post('/office/guests', data),
  completeGuest: (id: string) => publicApi.put(`/office/guests/${id}/complete`),
  checkIn: (data: any) => publicApi.post('/office/attendance/checkin', data),
  checkOut: (data: any) => publicApi.post('/office/attendance/checkout', data),
};

export default api;