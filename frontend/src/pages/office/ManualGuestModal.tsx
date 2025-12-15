import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
}

export const ManualGuestModal = ({ onClose }: Props) => {
  const { state, manualGuest, loading } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0]?._id || state.customers[0]?.id || "");
  const [guestName, setGuestName] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    if (!customerId) {
      toast.error("Please select a customer.");
      return;
    }

    if (!guestName.trim()) {
      toast.error("Guest name is required.");
      return;
    }

    if (!time) {
      toast.error("Please select a time.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const expected = new Date();
    expected.setHours(hours, minutes, 0, 0);

    const expectedTime = expected.getTime();

    if (expectedTime < now.getTime()) {
      toast.error("Time cannot be in the past.");
      return;
    }

    try {
      await manualGuest(customerId, guestName, expectedTime);
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal title="Manual Guest Entry" onClose={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Manual Guest Entry</h2>

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
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
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