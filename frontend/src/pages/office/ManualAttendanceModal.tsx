import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onClose: () => void;
}

export const ManualAttendanceModal = ({ onClose }: Props) => {
  const { state, manualCheckIn, manualCheckOut, loading } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0]?._id || state.customers[0]?.id || "");
  const [action, setAction] = useState<"checkin" | "checkout">("checkin");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    if (!customerId) return;

    try {
      if (action === "checkin") {
        await manualCheckIn(customerId, time || undefined);
      } else {
        await manualCheckOut(customerId, time || undefined);
      }
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal title="Manual Check-in/out" onClose={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Manual Check-in/out</h2>

        <div className="space-y-4">
          <div>
            <Label>Customer</Label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border rounded p-2"
              disabled={loading}
            >
              {state.customers.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  Cabin {c.cabinNumber} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Action</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="checkin"
                  checked={action === "checkin"}
                  onChange={(e) =>
                    setAction(e.target.value as "checkin" | "checkout")
                  }
                  disabled={loading}
                  className="mr-2"
                />
                Check-in
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="checkout"
                  checked={action === "checkout"}
                  onChange={(e) =>
                    setAction(e.target.value as "checkin" | "checkout")
                  }
                  disabled={loading}
                  className="mr-2"
                />
                Check-out
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="time">Time (optional)</Label>
            <Input
              id="time"
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};