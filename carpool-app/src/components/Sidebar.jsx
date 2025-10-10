// src/components/Sidebar.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, User, Car, X, Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const navItems = [
    { name: "Home", path: "/", icon: <Home /> },
    ...(user
      ? [
          { name: "Offer Ride", path: "/offer", icon: <MapPin /> },
          { name: "Find Ride", path: "/find", icon: <MapPin /> },
          { name: "Profile", path: "/profile", icon: <User /> },
        ]
      : []),
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-50 dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between z-30 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="p-6 flex items-center gap-2">
          <Car className="w-8 h-8 text-teal-500" />
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">Carpool</span>
          <button
            className="md:hidden ml-auto text-gray-800 dark:text-gray-100 hover:text-teal-500 transition"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-10 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-teal-500 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-700 hover:text-teal-600 dark:hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm md:text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 flex flex-col gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <span className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            &copy; 2025 Carpool Connect
          </span>
        </div>
      </aside>
    </>
  );
}
