// src/pages/Home.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import StatsCounter from "../components/StatsCounter";
import SearchBar from "../components/SearchBar";


export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = () => {
    if (!from || !to) {
      alert("Please enter both origin and destination.");
      return;
    }
    // keep behavior same as existing app — don't change fetching
    alert(`Searching rides from ${from} to ${to}`);
  };

  // Solid, small icon URLs that should load
  const ICONS = {
    car: "https://cdn-icons-png.flaticon.com/512/743/743007.png",
    driver: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
    passenger: "https://cdn-icons-png.flaticon.com/512/3448/3448334.png",
    mapPin: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    star: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  };

  // small animation variants
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-gray-800">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-sky-800 leading-tight">
                Share rides. Save money. Connect Kenya. <span className="block text-teal-600">Every trip matters.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-gray-600">
                Find or offer rides across Nairobi, Mombasa, Kisumu and beyond — quick matching, verified drivers,
                friendly passengers, and safer trips for everyone.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <Link
                  to="/offer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg"
                >
                  Offer a Ride 🚗
                </Link>

                <Link
                  to="/find"
                  className="mt-3 sm:mt-0 inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 hover:bg-white bg-white text-gray-800 font-semibold shadow-sm"
                >
                  Find a Ride 🔎
                </Link>
              </div>

              <div className="mt-10">
                <div className="bg-white/80 dark:bg-gray-900/30 p-5 rounded-2xl shadow-md max-w-2xl">
                  <SearchBar from={from} to={to} setFrom={setFrom} setTo={setTo} onSearch={handleSearch} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="relative w-full h-80 md:h-96 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-sky-100 to-emerald-100 p-6">
                {/* Large spaced icons — arranged visually */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.img
                    src={ICONS.car}
                    alt="car"
                    className="absolute left-6 bottom-6 w-28 md:w-36"
                    animate={{ x: [0, 18, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.img
                    src={ICONS.driver}
                    alt="driver"
                    className="absolute top-8 left-20 w-20 md:w-24"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.img
                    src={ICONS.passenger}
                    alt="passenger"
                    className="absolute top-20 right-12 w-20 md:w-24"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="absolute right-6 top-6 bg-white/80 rounded-xl p-4 shadow-md w-40">
                    <h3 className="font-semibold text-sky-800">Popular Routes</h3>
                    <ul className="mt-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2"><img src={ICONS.mapPin} className="w-4" alt="pin" /> Nairobi → Mombasa</li>
                      <li className="flex items-center gap-2"><img src={ICONS.mapPin} className="w-4" alt="pin" /> Nairobi → Kisumu</li>
                      <li className="flex items-center gap-2"><img src={ICONS.mapPin} className="w-4" alt="pin" /> Nakuru → Eldoret</li>
                    </ul>
                  </div>
                </div>

                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="text-sky-800 font-bold text-2xl">Kenya-wide carpooling</h4>
                    <p className="mt-3 text-gray-600 max-w-xs mx-auto">Fast matching, safe profiles and door-to-door routes.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <motion.section className="py-24" variants={stagger} initial="hidden" animate="visible">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-sky-700 mb-6">What we offer</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-600 max-w-3xl">
            Tools for drivers and passengers — post routes, find nearby rides, view driver ratings, and chat securely.
          </motion.p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp}>
              <FeatureCard
                icon={ICONS.driver}
                title="Drivers"
                desc="Post trips, manage seats, earn on your routes."
                color="teal"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <FeatureCard
                icon={ICONS.passenger}
                title="Passengers"
                desc="Search rides, compare times, book instantly."
                color="sky"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <FeatureCard
                icon={ICONS.car}
                title="Smart Matching"
                desc="Route-based matching minimizes detours and time."
                color="green"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* DRIVERS SHOWCASE */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-sky-700 mb-6">Featured Drivers</h3>
          <p className="text-gray-600 mb-8 max-w-3xl">Verified drivers nearby — choose vehicles and profiles you trust.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alex Mwangi", rating: 4.9, route: "Nairobi → Mombasa", car: ICONS.car },
              { name: "Fatuma Noor", rating: 4.8, route: "Nairobi → Kisumu", car: ICONS.car },
              { name: "Peter Odhiambo", rating: 4.7, route: "Nakuru → Eldoret", car: ICONS.car },
            ].map((d, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-sky-50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <img src={d.car} alt="car" className="w-20 h-20 object-contain" />
                  <div>
                    <h4 className="font-semibold text-lg">{d.name}</h4>
                    <p className="text-sm text-gray-600">{d.route}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                      <img src={ICONS.star} alt="star" className="w-4" />
                      <span className="font-medium">{d.rating}</span>
                      <span className="text-gray-500">· 24 trips</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link to="/profile" className="px-4 py-2 rounded-lg bg-white border text-sm">View profile</Link>
                  <Link to="/book" className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm">Book a seat</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSENGERS SHOWCASE */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-sky-700 mb-6">Passengers & Community</h3>
          <p className="text-gray-600 mb-8">Passengers who regularly carpool and keep great reviews.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Grace", "Moses", "Sandra", "John"].map((p, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
                <img src={ICONS.passenger} alt="p" className="w-20 h-20 mb-3" />
                <strong>{p}</strong>
                <p className="text-sm text-gray-500 mt-1">Frequent rider</p>
                <div className="mt-3 text-xs text-gray-600">Joined 2023</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP ROUTES (iframe quick preview) */}
      <section className="py-28 bg-sky-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-bold text-sky-700 mb-4">Map & Routes — Kenya</h3>
              <p className="text-gray-600 mb-6">
                Quick preview of routes (interactive map available in ride details). This preview uses OpenStreetMap tiles for a lightweight
                in-page map without extra packages.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <img src={ICONS.mapPin} alt="" className="w-5 mt-1" />
                  Nairobi ↔ Mombasa — major intercity route
                </li>
                <li className="flex items-start gap-3">
                  <img src={ICONS.mapPin} alt="" className="w-5 mt-1" />
                  Nairobi ↔ Kisumu — frequent commuter corridor
                </li>
                <li className="flex items-start gap-3">
                  <img src={ICONS.mapPin} alt="" className="w-5 mt-1" />
                  Nakuru ↔ Eldoret — regional connectors
                </li>
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              {/* Use a small embedded OSM map centered on Kenya (no npm package required) */}
              <iframe
                title="kenya-map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=33.46%2C-1.46%2C40.23%2C4.92&layer=mapnik"
                className="w-full h-72 border-0"
                loading="lazy"
              />
              <div className="p-3 bg-white text-sm text-gray-600">Map data © OpenStreetMap contributors</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-sky-700 mb-6">What people say</h3>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">Real feedback from drivers and passengers who saved time and money using the app.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Saved 40% on fuel this month — friendly riders and great chats.", name: "Anne — Driver" },
              { text: "Quickly found a ride to Kisumu, on time and safe.", name: "Joseph — Passenger" },
              { text: "Verified drivers and transparent pricing make it easy.", name: "Lydia — Passenger" },
            ].map((t, i) => (
              <motion.blockquote key={i} whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-2xl shadow-sm text-left">
                <p className="text-gray-700">“{t.text}”</p>
                <footer className="mt-4 text-sm font-semibold text-sky-700">{t.name}</footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <StatsCounter />
        </div>
      </section>

      {/* CTA */}
      <footer className="py-20 bg-gradient-to-r from-emerald-100 via-sky-50 to-emerald-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-4xl font-extrabold text-sky-800 mb-4">Ready to ride with your community?</h4>
          <p className="text-gray-700 mb-8 max-w-3xl mx-auto">Offer a seat or join a driver — make travel affordable and friendly.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/offer" className="px-8 py-3 rounded-full bg-teal-600 text-white font-semibold shadow">Offer a Ride</Link>
            <Link to="/find" className="px-8 py-3 rounded-full bg-sky-600 text-white font-semibold shadow">Find a Ride</Link>
            <Link to="/download" className="px-8 py-3 rounded-full border border-gray-200 bg-white font-semibold">Get the App</Link>
          </div>

          <p className="mt-8 text-xs text-gray-500">© {new Date().getFullYear()} Carpool — Built for Kenyan commuters</p>
        </div>
      </footer>
    </div>
  );
}
