import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("Access denied. Please log in again.");
          logout();
        }
      });
  }, [user, token, logout]);

  if (!user || !token)
    return (
      <p className="text-center mt-20 text-gray-900 dark:text-white">
        Please login to view your profile
      </p>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 md:px-12 pt-32 space-y-12">
      {profile && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto">
            <User className="w-16 h-16 text-teal-600 flex-shrink-0" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-500 dark:text-gray-300 break-words">{profile.email}</p>
              {profile.phone && <p className="text-gray-500 dark:text-gray-300">Phone: {profile.phone}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/edit-profile"
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-xl text-white font-semibold text-center"
            >
              Edit Profile
            </Link>
            <button
              onClick={logout}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
