// src/components/Sidebar.jsx
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Home, MapPin, User, Car, X, Moon, Sun, Bell } from "lucide-react";
import { motion } from "framer-motion";

// Wrap Link with motion
const MotionLink = motion(Link);

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();

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
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-teal-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between z-30 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Logo & Profile */}
        <div className="p-6 flex flex-col items-center md:items-start gap-4 relative">
          <div className="flex items-center gap-2 w-full">
            <Car className="w-8 h-8 text-teal-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Carpool
            </span>
            <button
              className="md:hidden ml-auto text-gray-800 dark:text-gray-100 hover:text-teal-500 transition"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {user && (
            <motion.div
              className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-3 w-full shadow-lg"
              whileHover={{ scale: 1.03 }}
            >
              <User className="w-12 h-12 text-teal-500" />
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  {user.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs">
                    3 Rides
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                    2 Bookings
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 mt-8 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <MotionLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-semibold cursor-pointer ${
                  isActive
                    ? "bg-teal-500 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-700 hover:text-teal-600 dark:hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm md:text-base">{item.name}</span>
                </div>
                {item.name === "Find Ride" && (
                  <Bell className="w-4 h-4 text-red-500 animate-pulse" />
                )}
              </MotionLink>
            );
          })}
        </nav>

        {/* Footer & Extras */}
        <div className="p-6 flex flex-col gap-4">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition shadow"
            whileHover={{ scale: 1.02 }}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.button>

          <motion.div className="flex flex-col gap-2 text-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; 2025 Carpool Connect
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              Version 1.0.0
            </span>
            <Link
              to="/support"
              className="text-teal-600 dark:text-teal-400 text-xs hover:underline"
            >
              Support & Feedback
            </Link>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
