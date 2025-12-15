import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { PendingRequestCard } from "./components/PendingRequestCard";
import { ManualOrderModal } from "./ManualOrderModal";
import { ManualGuestModal } from "./ManualGuestModal";
import { ManualAttendanceModal } from "./ManualAttendanceModal";
import { StatsCard } from "./components/StatsCard";
import { DropdownMenu } from "./components/DropdownMenu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Dashboard = () => {
  const { state, fetchOfficeDashboardData, loading } = useApp();
  const navigate = useNavigate();
  const [modal, setModal] = useState<"order" | "guest" | "attendance" | null>(null);

  useEffect(() => {
    const isOfficeLoggedIn = sessionStorage.getItem("officeAuth");
    if (isOfficeLoggedIn !== "true") {
      toast.error("Please login to access office dashboard");
      navigate("/office-login", { replace: true });
      return;
    }

    fetchOfficeDashboardData();
    
    const interval = setInterval(() => {
      fetchOfficeDashboardData();
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("officeAuth");
    toast.success("Office Boy logged out");
    navigate("/office-login");
  };

  const pendingOrders = state.orders.filter((o) => o.status === "pending");
  const completedOrders = state.orders.filter((o) => o.status === "completed");
  const pendingGuests = state.guests.filter((g) => g.status === "pending");
  const completedGuests = state.guests.filter((g) => g.status === "completed");
  const pendingCount = pendingOrders.length + pendingGuests.length;
  const completedCount = completedOrders.length + completedGuests.length;

  const allPending = [...pendingOrders, ...pendingGuests].sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  const allCompleted = [...completedOrders, ...completedGuests].sort(
    (a, b) =>
      new Date(b.completedAt || 0).getTime() -
      new Date(a.completedAt || 0).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">🏢 Office Boy Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Manage all orders, guests, and attendance
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <DropdownMenu
                label="Manual Entry"
                items={[
                  {
                    label: "Add Chai/Coffee Order",
                    onClick: () => setModal("order"),
                  },
                  { label: "Add Guest Entry", onClick: () => setModal("guest") },
                  {
                    label: "Manual Check-in/out",
                    onClick: () => setModal("attendance"),
                  },
                ]}
              />
              <Button onClick={handleLogout} variant="outline" className="text-sm">
                Logout
              </Button>
            </div>
          </div>

          {loading && (
            <div className="text-center text-gray-600 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading dashboard...
            </div>
          )}

          {/* Pending Requests */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-600">
              🔴 PENDING REQUESTS ({pendingCount})
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {allPending.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 bg-gray-50 rounded text-sm sm:text-base">
                  No pending requests
                </p>
              ) : (
                allPending.map((request) => (
                  <PendingRequestCard
                    key={request._id || request.id}
                    request={request}
                  />
                ))
              )}
            </div>
          </div>

          {/* Completed Today */}
          <div className="mb-4 sm:mb-6 border-t pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-green-600">
               COMPLETED TODAY ({completedCount})
            </h2>
            <div className="space-y-2">
              {allCompleted.length === 0 ? (
                <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">No completed tasks yet</p>
              ) : (
                allCompleted.map((item) => {
                  const isOrder = "type" in item;
                  return (
                    <div
                      key={item._id || item.id}
                      className="text-xs sm:text-sm text-gray-700 bg-green-50 p-2 rounded wrap-break-word"
                    >
                      •{" "}
                      {isOrder
                        ? `${item.type.toUpperCase()} - Cabin ${item.cabinNumber} (${item.customerName})`
                        : `Guest - Cabin ${item.cabinNumber} (${item.customerName}) - ${item.guestName}`}{" "}
                      - {new Date(item.requestedAt).toLocaleTimeString()} ✓
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t pt-4 sm:pt-6">
            <StatsCard />
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "order" && (
        <ManualOrderModal onClose={() => setModal(null)} />
      )}
      {modal === "guest" && (
        <ManualGuestModal onClose={() => setModal(null)} />
      )}
      {modal === "attendance" && (
        <ManualAttendanceModal onClose={() => setModal(null)} />
      )}
    </div>
  );
};