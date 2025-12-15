import type { AppState } from "./types";

export const initialState: AppState = {
  customers: [],
  currentUser: null,
  orders: [],
  guests: [],
  attendance: [],
};

export function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };

    case "LOGOUT":
      return { ...state, currentUser: null };

    case "SET_DASHBOARD_DATA":
      return {
        ...state,
        customers: action.payload.customers,
        orders: action.payload.orders,
        guests: action.payload.guests,
        attendance: action.payload.attendance,
      };

    case "UPDATE_CURRENT_USER":
      return {
        ...state,
        currentUser: state.currentUser
          ? { ...state.currentUser, ...action.payload }
          : null,
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id || o._id === action.payload._id
            ? action.payload
            : o
        ),
      };

    case "ADD_GUEST":
      return {
        ...state,
        guests: [action.payload, ...state.guests],
      };

    case "UPDATE_GUEST":
      return {
        ...state,
        guests: state.guests.map((g) =>
          g.id === action.payload.id || g._id === action.payload._id
            ? action.payload
            : g
        ),
      };

    case "ADD_ATTENDANCE":
      return {
        ...state,
        attendance: [action.payload, ...state.attendance],
      };

    case "UPDATE_ATTENDANCE":
      return {
        ...state,
        attendance: state.attendance.map((a) =>
          a.id === action.payload.id || a._id === action.payload._id
            ? action.payload
            : a
        ),
      };

    default:
      return state;
  }
}