export interface Customer {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  cabinNumber: string;
  todayChaiCoffeeUsed: number;
  isCheckedIn: boolean;
  lastCheckIn?: string | Date;
  lastCheckOut?: string | Date;
}

export interface Order {
  _id?: string;
  id?: string;
  customer?: string;
  customerId?: string;
  customerName: string;
  cabinNumber: string;
  type: "chai" | "coffee";
  status: "pending" | "completed";
  requestedAt: string | Date | number;
  completedAt?: string | Date | number;
  addedBy: "customer" | "office-boy";
}

export interface GuestRequest {
  _id?: string;
  id?: string;
  customer?: string;
  customerId?: string;
  customerName: string;
  cabinNumber: string;
  guestName: string;
  expectedTime: string | Date | number;
  status: "pending" | "completed";
  requestedAt: string | Date | number;
  completedAt?: string | Date | number;
  addedBy: "customer" | "office-boy";
}

export interface AttendanceLog {
  _id?: string;
  id?: string;
  customer?: string;
  customerId?: string;
  customerName: string;
  cabinNumber: string;
  checkInTime: string | Date | number;
  checkOutTime?: string | Date | number;
  hoursSpent?: number;
  addedBy: "customer" | "office-boy";
}

export interface AppState {
  customers: Customer[];
  currentUser: Customer | null;
  orders: Order[];
  guests: GuestRequest[];
  attendance: AttendanceLog[];
}