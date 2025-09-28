import { MapPin, Clock, Users } from "lucide-react";

export default function RideCard({ ride }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-[#00BFA6]" />
          <span>{ride.from}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-[#4FC3F7]" />
          <span>{ride.to}</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> {ride.time}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" /> {ride.seats} seats
        </div>
      </div>
    </div>
  );
}
