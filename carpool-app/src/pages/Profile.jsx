// src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/users/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setProfile(res.data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <p className="text-center mt-20">Please login to view your profile</p>;

  return (
    <div className="px-6 md:px-12 pt-32 space-y-12">
      {profile && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <User className="w-16 h-16 text-teal-600" />
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-500">{profile.email}</p>
              {profile.phone && <p className="text-gray-500">Phone: {profile.phone}</p>}
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              to="/edit-profile"
              className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-xl text-white font-semibold shadow-md"
            >
              Edit Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
