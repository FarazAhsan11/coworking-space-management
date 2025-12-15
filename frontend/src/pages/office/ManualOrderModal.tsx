import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  onClose: () => void;
}

export const ManualOrderModal = ({ onClose }: Props) => {
  const { state, manualOrder, loading } = useApp();
  const [customerId, setCustomerId] = useState(state.customers[0]?._id || state.customers[0]?.id || "");
  const [orderType, setOrderType] = useState<"chai" | "coffee">("chai");

  const handleSubmit = async () => {
    if (!customerId) return;

    try {
      await manualOrder(customerId, orderType);
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal title="Manual Order Entry" onClose={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Manual Order Entry</h2>

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
            <Label>Order Type</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="chai"
                  checked={orderType === "chai"}
                  onChange={(e) =>
                    setOrderType(e.target.value as "chai" | "coffee")
                  }
                  disabled={loading}
                  className="mr-2"
                />
                Chai
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="coffee"
                  checked={orderType === "coffee"}
                  onChange={(e) =>
                    setOrderType(e.target.value as "chai" | "coffee")
                  }
                  disabled={loading}
                  className="mr-2"
                />
                Coffee
              </label>
            </div>
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