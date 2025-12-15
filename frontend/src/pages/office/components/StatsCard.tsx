import { useApp } from "@/store/AppContext";

export const StatsCard = () => {
  const { state } = useApp();

  const totalChai = state.orders.filter((o) => o.type === "chai").length;
  const totalCoffee = state.orders.filter((o) => o.type === "coffee").length;
  const guests = state.guests.length;
  const checkins = state.attendance.filter((a) => a.checkInTime).length;
  const inOffice = state.customers.filter((c) => c.isCheckedIn).length;

  const stats = [
    { label: "Total Chai", value: totalChai },
    { label: "Total Coffee", value: totalCoffee },
    { label: "Guests", value: guests },
    { label: "Check-ins", value: checkins },
    { label: "Currently In Office", value: inOffice },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">TODAY'S STATS</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};