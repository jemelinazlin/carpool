import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Generate floating particles
  const particles = Array.from({ length: 10 });

  return (
    <footer className="relative bg-gradient-to-r from-teal-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-inner py-12 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Animated floating particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "10%", "0%"],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* About */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold mb-2">Carpool Connect</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect with drivers and passengers across Kenya. Safe, fast, and reliable rides.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" to="/">Home</Link>
          <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" to="/offer">Offer a Ride</Link>
          <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" to="/find">Find a Ride</Link>
          <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" to="/profile">Profile</Link>
        </motion.div>

        {/* Social & Newsletter */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-700 dark:text-gray-300"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          <div className="mt-2">
            <h3 className="text-sm font-semibold mb-1">Subscribe for updates</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-teal-400"
              />
              <motion.button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        &copy; 2025 Carpool Connect. All rights reserved.
      </motion.div>
    </footer>
  );
}
