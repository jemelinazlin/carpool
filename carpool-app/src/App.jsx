import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import OfferRide from "./pages/OfferRide";
import FindRide from "./pages/FindRide";
import ProfileDashboard from "./pages/ProfileDashboard"; // ✅ Updated
import RideDetails from "./pages/RideDetails";
import EditProfile from "./pages/Editprofile"; // Keep this as a page

import Login from "./context/Login";
import Register from "./context/Register";

import { AuthProvider } from "./context/AuthContext";
import { RidesProvider } from "./context/RidesContext"; // ✅ Import rides context
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <RidesProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
              {/* Mobile Header */}
              <div className="md:hidden p-2 bg-white shadow flex items-center justify-between">
                <button
                  className="text-gray-800 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  ☰
                </button>
                <div className="font-bold text-lg">Carpool</div>
              </div>

              {/* Page Content */}
              <main className="flex-1 p-4 md:p-8 overflow-x-auto">
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route
                    path="/offer"
                    element={
                      <ProtectedRoute>
                        <OfferRide />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/find"
                    element={
                      <ProtectedRoute>
                        <FindRide />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/edit-profile"
                    element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ride/:id"
                    element={
                      <ProtectedRoute>
                        <RideDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </Router>
      </RidesProvider>
    </AuthProvider>
  );
}
