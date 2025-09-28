import { motion } from "framer-motion";
import FeatureCard from "../components/FeatureCard";
import StatsCounter from "../components/StatsCounter";
import SearchBar from "../components/SearchBar";
import { Car, User, MapPin, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = () => {
    alert(`Searching rides from ${from} to ${to}`);
  };

  const features = [
    { icon: <Car className="w-12 h-12 text-[#00BFA6]" />, title: "Drivers", desc: "Share trips & earn money." },
    { icon: <User className="w-12 h-12 text-[#4FC3F7]" />, title: "Passengers", desc: "Save costs & travel safely." },
    { icon: <MapPin className="w-12 h-12 text-[#00BFA6]" />, title: "Smart Matching", desc: "Rides matched efficiently." },
  ];

  const stats = [
    { value: 10000, label: "Rides Shared", icon: <Car /> },
    { value: 50000, label: "Happy Users", icon: <User /> },
    { value: 200, label: "CO₂ Saved", icon: <Leaf /> },
  ];

  return (
    <div className="px-6 md:px-12 pt-32">
      {/* Hero */}
      <motion.h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFA6] to-[#4FC3F7] text-center">
        Carpool Connect
      </motion.h1>
      <motion.p className="mt-6 text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto">
        Affordable. Eco-friendly. Smarter commuting. Share rides, save money, and protect the planet 🌍.
      </motion.p>

      {/* Search */}
      <motion.div className="mt-10">
        <SearchBar from={from} to={to} setFrom={setFrom} setTo={setTo} onSearch={handleSearch} />
      </motion.div>

      {/* Features */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 max-w-5xl mx-auto text-center">
        {stats.map((s, i) => (
          <StatsCounter key={i} target={s.value} label={s.label} icon={s.icon} />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div className="mt-16 flex flex-col md:flex-row gap-6 justify-center">
        <Link
          to="/offer"
          className="bg-[#00BFA6] hover:bg-[#00A392] px-10 py-4 rounded-3xl font-bold text-lg shadow-2xl transition transform hover:-translate-y-1"
        >
          Offer a Ride
        </Link>
        <Link
          to="/find"
          className="bg-[#4FC3F7] hover:bg-[#29B6F6] px-10 py-4 rounded-3xl font-bold text-lg shadow-2xl transition transform hover:-translate-y-1"
        >
          Find a Ride
        </Link>
      </motion.div>
    </div>
  );
}
