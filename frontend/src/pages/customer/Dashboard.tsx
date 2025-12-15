import { useEffect } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { GuestModal } from "./GuestModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const { state, logout, placeOrder, checkIn, checkOut, loading, initializing, fetchDashboardData } = useApp();
  const user = state.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializing && !user) {
      navigate("/");
    }
  }, [user, navigate, initializing]);

  useEffect(() => {
    if (user && !initializing) {
      fetchDashboardData();
    }
  }, [user?._id, initializing]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleOrder = async (type: "chai" | "coffee") => {
    if (!user.isCheckedIn) {
      toast.error("Please check in first before ordering!");
      return;
    }
    
    if (user.todayChaiCoffeeUsed >= 1) return;
    
    try {
      await placeOrder(type);
    } catch (error) {
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
    } catch (error) {
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
    } catch (error) {
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userId = user._id || user.id;

  const getCustomerId = (item: any): string => {
    const customerField = item.customer || item.customerId;
    
    if (typeof customerField === 'object' && customerField !== null) {
      return String(customerField._id || customerField.id);
    }
    
    return String(customerField);
  };

  const todayOrders = state.orders.filter((o) => {
    const orderCustomerId = getCustomerId(o);
    return orderCustomerId === String(userId);
  });

  const todayGuests = state.guests.filter((g) => {
    const guestCustomerId = getCustomerId(g);
    return guestCustomerId === String(userId);
  });

  const todayAttendance = state.attendance.filter((a) => {
    const attendanceCustomerId = getCustomerId(a);
    return attendanceCustomerId === String(userId);
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Welcome, {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                  🏠 Cabin {user.cabinNumber}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
                  user.isCheckedIn 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.isCheckedIn ? "🟢 Checked In" : "⚫ Checked Out"}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Today's Chai/Coffee: <span className="font-semibold text-amber-600">{user.todayChaiCoffeeUsed}/1</span> used
              </p>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              Logout
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
            <Button
              onClick={() => handleOrder("chai")}
              disabled={!user.isCheckedIn || user.todayChaiCoffeeUsed >= 1 || loading}
              className={`h-32 sm:h-36 text-base sm:text-lg font-semibold transition-all duration-200 ${
                !user.isCheckedIn || user.todayChaiCoffeeUsed >= 1
                  ? 'bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">☕</div>
                <div className="font-bold">ORDER CHAI</div>
                {!user.isCheckedIn ? (
                  <div className="text-xs sm:text-sm mt-1 font-normal">Check in first</div>
                ) : user.todayChaiCoffeeUsed >= 1 ? (
                  <div className="text-xs sm:text-sm mt-1 font-normal">Already used today</div>
                ) : null}
              </div>
            </Button>

            <Button
              onClick={() => handleOrder("coffee")}
              disabled={!user.isCheckedIn || user.todayChaiCoffeeUsed >= 1 || loading}
              className={`h-32 sm:h-36 text-base sm:text-lg font-semibold transition-all duration-200 ${
                !user.isCheckedIn || user.todayChaiCoffeeUsed >= 1
                  ? 'bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-br from-amber-800 to-yellow-900 hover:from-amber-900 hover:to-yellow-950 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">☕</div>
                <div className="font-bold">ORDER COFFEE</div>
                {!user.isCheckedIn ? (
                  <div className="text-xs sm:text-sm mt-1 font-normal">Check in first</div>
                ) : user.todayChaiCoffeeUsed >= 1 ? (
                  <div className="text-xs sm:text-sm mt-1 font-normal">Already used today</div>
                ) : null}
              </div>
            </Button>

            <GuestModal disabled={!user.isCheckedIn} />

            {!user.isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                disabled={loading}
                className="h-32 sm:h-36 text-base sm:text-lg font-semibold bg-linear-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2">🏢</div>
                  <div className="font-bold">CHECK-IN</div>
                </div>
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={loading}
                className="h-32 sm:h-36 text-base sm:text-lg font-semibold bg-linear-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2">🚪</div>
                  <div className="font-bold">CHECK-OUT</div>
                </div>
              </Button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              📋 My Activity Today
            </h2>
            <div className="space-y-3">
              {todayAttendance.map((a) => (
                <div 
                  key={a._id || a.id} 
                  className="text-sm sm:text-base text-gray-700 bg-linear-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-green-700">✓ Check-in</span> at{" "}
                  <span className="font-medium">{new Date(a.checkInTime).toLocaleTimeString()}</span>
                  {a.checkOutTime && (
                    <>
                      {" → "}
                      <span className="font-semibold text-red-700">Check-out</span> at{" "}
                      <span className="font-medium">{new Date(a.checkOutTime).toLocaleTimeString()}</span>
                      <span className="ml-2 text-gray-600">
                        ({a.hoursSpent?.toFixed(2)} hours)
                      </span>
                    </>
                  )}
                </div>
              ))}
              
              {todayOrders.map((o) => (
                <div 
                  key={o._id || o.id} 
                  className={`text-sm sm:text-base text-gray-700 p-3 sm:p-4 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${
                    o.type === 'chai' 
                      ? 'bg-linear-to-r from-orange-50 to-amber-50 border-orange-500'
                      : 'bg-linear-to-r from-yellow-50 to-amber-50 border-amber-700'
                  }`}
                >
                  <span className={`font-semibold ${o.type === 'chai' ? 'text-orange-700' : 'text-amber-800'}`}>
                    ☕ {o.type === 'chai' ? 'Chai' : 'Coffee'}
                  </span>{" "}
                  ordered at <span className="font-medium">{new Date(o.requestedAt).toLocaleTimeString()}</span>
                  {" → "}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    o.status === "completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {o.status === "completed" ? "✓ Completed" : "⏳ Pending"}
                  </span>
                </div>
              ))}
              
              {todayGuests.map((g) => (
                <div 
                  key={g._id || g.id} 
                  className="text-sm sm:text-base text-gray-700 bg-linear-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-blue-700">👤 Guest:</span>{" "}
                  <span className="font-medium">{g.guestName}</span> at{" "}
                  <span className="font-medium">{new Date(g.expectedTime).toLocaleTimeString()}</span>
                  {" → "}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    g.status === "completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {g.status === "completed" ? "✓ Received" : "⏳ Waiting"}
                  </span>
                </div>
              ))}
              
              {todayAttendance.length === 0 &&
                todayOrders.length === 0 &&
                todayGuests.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-3 opacity-50">📭</div>
                    <p className="text-gray-500 italic text-sm sm:text-base">No activity yet today</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Check in to get started!</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}