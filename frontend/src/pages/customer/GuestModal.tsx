import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface GuestModalProps {
  disabled?: boolean;
}

export function GuestModal({ disabled = false }: GuestModalProps) {
  const { addGuest, loading } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [expectedTime, setExpectedTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      toast.error("Please enter guest name");
      return;
    }

    if (!expectedTime) {
      toast.error("Please select expected arrival time");
      return;
    }

    try {
      const timeInMs = new Date(expectedTime).getTime();
      await addGuest(guestName.trim(), timeInMs);
      setIsOpen(false);
      setGuestName("");
      setExpectedTime("");
    } catch (error) {
    }
  };

  const handleButtonClick = () => {
    if (disabled) {
      toast.error("Please check in first before adding guests!");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        disabled={loading}
        className={`h-32 sm:h-36 text-base sm:text-lg font-semibold transition-all duration-200 ${
          disabled
            ? 'bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-2">👤</div>
          <div className="font-bold">GUEST COMING</div>
          {disabled && <div className="text-xs sm:text-sm mt-1 font-normal">Check in first</div>}
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                👤 Add Guest
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="guestName" className="text-gray-700 font-medium">
                  Guest Name
                </Label>
                <Input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest name"
                  disabled={loading}
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="expectedTime" className="text-gray-700 font-medium">
                  Expected Arrival Time
                </Label>
                <Input
                  id="expectedTime"
                  type="datetime-local"
                  value={expectedTime}
                  onChange={(e) => setExpectedTime(e.target.value)}
                  disabled={loading}
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Guest"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}