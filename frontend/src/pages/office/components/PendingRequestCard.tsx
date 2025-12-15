import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import type { Order, GuestRequest } from "@/store/types";

interface Props {
  request: Order | GuestRequest;
}

export const PendingRequestCard = ({ request }: Props) => {
  const { markOrderComplete, markGuestComplete, loading } = useApp();

  const markComplete = async () => {
    try {
      if ("type" in request) {
        await markOrderComplete(request._id || request.id || "");
      } else {
        await markGuestComplete(request._id || request.id || "");
      }
    } catch (error) {
    }
  };

  const isOrder = "type" in request;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          {isOrder ? (
            <>
              <div className="font-bold">
                ☕ {request.type.toUpperCase()} - Cabin {request.cabinNumber} (
                {request.customerName})
              </div>
              <div className="text-sm text-gray-600">
                {new Date(request.requestedAt).toLocaleTimeString()}
              </div>
            </>
          ) : (
            <>
              <div className="font-bold">
                👤 GUEST - Cabin {request.cabinNumber} ({request.customerName})
              </div>
              <div className="text-sm text-gray-600">
                Guest: {request.guestName} @{" "}
                {new Date(request.expectedTime).toLocaleTimeString()}
              </div>
            </>
          )}
        </div>
        <Button onClick={markComplete} disabled={loading}>
          ✓ Mark Complete
        </Button>
      </div>
    </div>
  );
};