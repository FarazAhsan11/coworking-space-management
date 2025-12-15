import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { appReducer, initialState } from "./AppReducer";
import type { AppState } from "./types";
import { authAPI, customerAPI, orderAPI, guestAPI, attendanceAPI, officeAPI } from "../api/axios";
import { toast } from "sonner";

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<any>;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchDashboardData: () => Promise<void>;
  fetchOfficeDashboardData: () => Promise<void>;
  placeOrder: (type: "chai" | "coffee") => Promise<void>;
  addGuest: (guestName: string, expectedTime: number) => Promise<void>;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  markOrderComplete: (orderId: string) => Promise<void>;
  markGuestComplete: (guestId: string) => Promise<void>;
  manualOrder: (customerId: string, type: "chai" | "coffee") => Promise<void>;
  manualGuest: (customerId: string, guestName: string, expectedTime: number) => Promise<void>;
  manualCheckIn: (customerId: string, checkInTime?: string) => Promise<void>;
  manualCheckOut: (customerId: string, checkOutTime?: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setInitializing(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setInitializing(true);
      const response = await authAPI.getMe();
      const customer = response.data.customer;
      
      console.log('User authenticated:', customer.name);
      dispatch({ type: "LOGIN", payload: customer });
      
      // Fetch dashboard data after successful auth
      await fetchDashboardDataSilent();
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    } finally {
      setInitializing(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      const { token, customer } = response.data;
      
      localStorage.setItem("token", token);
      console.log('Login successful:', customer.name);
      dispatch({ type: "LOGIN", payload: customer });
      
      await fetchDashboardDataSilent();
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const fetchDashboardDataSilent = async () => {
    try {
      console.log('Fetching customer dashboard data...');
      const [customersRes, ordersRes, guestsRes, attendanceRes] = await Promise.all([
        customerAPI.getAll(),
        orderAPI.getToday(),
        guestAPI.getToday(),
        attendanceAPI.getToday(),
      ]);

      console.log(' Dashboard data loaded:', {
        orders: ordersRes.data.orders.length,
        guests: guestsRes.data.guests.length,
        attendance: attendanceRes.data.attendance.length
      });

      dispatch({
        type: "SET_DASHBOARD_DATA",
        payload: {
          customers: customersRes.data.customers,
          orders: ordersRes.data.orders,
          guests: guestsRes.data.guests,
          attendance: attendanceRes.data.attendance,
        },
      });
    } catch (error: any) {
      console.error(" Failed to fetch dashboard data:", error);
    }
  };

  // Dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [customersRes, ordersRes, guestsRes, attendanceRes] = await Promise.all([
        customerAPI.getAll(),
        orderAPI.getToday(),
        guestAPI.getToday(),
        attendanceAPI.getToday(),
      ]);

      dispatch({
        type: "SET_DASHBOARD_DATA",
        payload: {
          customers: customersRes.data.customers,
          orders: ordersRes.data.orders,
          guests: guestsRes.data.guests,
          attendance: attendanceRes.data.attendance,
        },
      });
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficeDashboardData = async () => {
    try {
      setLoading(true);
      console.log(' Fetching office dashboard data...');
      
      const [customersRes, ordersRes, guestsRes, attendanceRes] = await Promise.all([
        officeAPI.getAllCustomers(),
        officeAPI.getTodayOrders(),
        officeAPI.getTodayGuests(),
        officeAPI.getTodayAttendance(),
      ]);

      console.log(' Office data loaded:', {
        customers: customersRes.data.customers?.length,
        orders: ordersRes.data.orders?.length,
        guests: guestsRes.data.guests?.length,
        attendance: attendanceRes.data.attendance?.length
      });

      dispatch({
        type: "SET_DASHBOARD_DATA",
        payload: {
          customers: customersRes.data.customers || [],
          orders: ordersRes.data.orders || [],
          guests: guestsRes.data.guests || [],
          attendance: attendanceRes.data.attendance || [],
        },
      });
    } catch (error: any) {
      console.error(" Failed to fetch office data:", error);
      toast.error("Failed to load office dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (type: "chai" | "coffee") => {
    if (!state.currentUser) return;

    try {
      const response = await orderAPI.create({
        customerId: state.currentUser.id || state.currentUser._id,
        type,
        addedBy: "customer",
      });

      dispatch({ type: "ADD_ORDER", payload: response.data.order });
      
      dispatch({
        type: "UPDATE_CURRENT_USER",
        payload: { todayChaiCoffeeUsed: state.currentUser.todayChaiCoffeeUsed + 1 },
      });

      toast.success("Order placed successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
      throw error;
    }
  };

  const addGuest = async (guestName: string, expectedTime: number) => {
    if (!state.currentUser) return;

    try {
      const response = await guestAPI.create({
        customerId: state.currentUser.id || state.currentUser._id,
        guestName,
        expectedTime,
        addedBy: "customer",
      });

      dispatch({ type: "ADD_GUEST", payload: response.data.guest });
      toast.success("Guest request submitted");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add guest";
      toast.error(message);
      throw error;
    }
  };

  const checkIn = async () => {
    if (!state.currentUser) return;

    try {
      const response = await attendanceAPI.checkIn({
        customerId: state.currentUser.id || state.currentUser._id,
        addedBy: "customer",
      });

      dispatch({ type: "ADD_ATTENDANCE", payload: response.data.attendance });
      dispatch({
        type: "UPDATE_CURRENT_USER",
        payload: {
          isCheckedIn: true,
          lastCheckIn: response.data.customer.lastCheckIn,
        },
      });

      toast.success("Checked in successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to check in";
      toast.error(message);
      throw error;
    }
  };

  const checkOut = async () => {
    if (!state.currentUser) return;

    try {
      const response = await attendanceAPI.checkOut({
        customerId: state.currentUser.id || state.currentUser._id,
        addedBy: "customer",
      });

      dispatch({
        type: "UPDATE_ATTENDANCE",
        payload: response.data.attendance,
      });
      dispatch({
        type: "UPDATE_CURRENT_USER",
        payload: {
          isCheckedIn: false,
          lastCheckOut: response.data.customer.lastCheckOut,
        },
      });

      toast.success("Checked out successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to check out";
      toast.error(message);
      throw error;
    }
  };

  const markOrderComplete = async (orderId: string) => {
    try {
      const response = await officeAPI.completeOrder(orderId);
      dispatch({
        type: "UPDATE_ORDER",
        payload: response.data.order,
      });
      toast.success("Order marked as complete");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to complete order";
      toast.error(message);
      throw error;
    }
  };

  const markGuestComplete = async (guestId: string) => {
    try {
      const response = await officeAPI.completeGuest(guestId);
      dispatch({
        type: "UPDATE_GUEST",
        payload: response.data.guest,
      });
      toast.success("Guest marked as received");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to complete guest";
      toast.error(message);
      throw error;
    }
  };

  const manualOrder = async (customerId: string, type: "chai" | "coffee") => {
    try {
      const response = await officeAPI.createOrder({
        customerId,
        type,
        addedBy: "office-boy",
      });

      dispatch({ type: "ADD_ORDER", payload: response.data.order });
      toast.success("Manual order added");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add order";
      toast.error(message);
      throw error;
    }
  };

  const manualGuest = async (customerId: string, guestName: string, expectedTime: number) => {
    try {
      const response = await officeAPI.createGuest({
        customerId,
        guestName,
        expectedTime,
        addedBy: "office-boy",
      });

      dispatch({ type: "ADD_GUEST", payload: response.data.guest });
      toast.success("Manual guest entry added");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add guest";
      toast.error(message);
      throw error;
    }
  };

  const manualCheckIn = async (customerId: string, checkInTime?: string) => {
    try {
      const response = await officeAPI.checkIn({
        customerId,
        addedBy: "office-boy",
        checkInTime,
      });

      dispatch({ type: "ADD_ATTENDANCE", payload: response.data.attendance });
      toast.success("Manual check-in added");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to check in";
      toast.error(message);
      throw error;
    }
  };

  const manualCheckOut = async (customerId: string, checkOutTime?: string) => {
    try {
      const response = await officeAPI.checkOut({
        customerId,
        addedBy: "office-boy",
        checkOutTime,
      });

      dispatch({
        type: "UPDATE_ATTENDANCE",
        payload: response.data.attendance,
      });
      toast.success("Manual check-out added");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to check out";
      toast.error(message);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        loading,
        initializing,
        login,
        logout,
        fetchDashboardData,
        fetchOfficeDashboardData,
        placeOrder,
        addGuest,
        checkIn,
        checkOut,
        markOrderComplete,
        markGuestComplete,
        manualOrder,
        manualGuest,
        manualCheckIn,
        manualCheckOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};