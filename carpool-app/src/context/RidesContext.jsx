import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const RidesContext = createContext();

export const RidesProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  // Fetch all rides from backend
  const fetchRides = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data);
    } catch (err) {
      console.error("Failed to fetch rides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [token]);

  // Add a new ride locally and optionally backend
  const addRide = (ride) => {
    setRides((prev) => [ride, ...prev]);
  };

  return (
    <RidesContext.Provider value={{ rides, setRides, addRide, fetchRides, loading }}>
      {children}
    </RidesContext.Provider>
  );
};

export const useRides = () => useContext(RidesContext);
