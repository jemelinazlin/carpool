import { Link, useLocation } from "react-router-dom";
import { Car, MapPin, User, Home } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Offer Ride", path: "/offer", icon: <MapPin className="w-5 h-5" /> },
    { name: "Find Ride", path: "/find", icon: <MapPin className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-50 shadow-xl border-r border-gray-200 flex flex-col justify-between">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <Car className="w-8 h-8 text-teal-500" />
        <span className="text-2xl font-bold text-gray-800">Carpool</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mt-10 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300
                ${isActive ? "bg-teal-500 text-white shadow-lg" : "text-gray-700 hover:bg-teal-100 hover:text-teal-600"}`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 text-gray-500 text-sm">
        &copy; 2025 Carpool Connect
      </div>
    </aside>
  );
}
