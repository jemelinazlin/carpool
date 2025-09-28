import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import OfferRide from "./pages/OfferRide";
import FindRide from "./pages/FindRide";
import Profile from "./pages/Profile";
import RideDetails from "./pages/RideDetails";
import EditProfile from "./pages/Editprofile";
import Login from "./context/Login";
import Register from "./context/Register";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100 text-gray-800">
          {/* Sidebar fixed on the left */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col ml-64">
            <main className="flex-1 p-8">
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Protected route for offering rides */}
                <Route 
                  path="/offer" 
                  element={
                    <ProtectedRoute>
                      <OfferRide />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/find" element={<FindRide />} />
                
                {/* Protected route for profile */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
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
                
                <Route path="/ride/:id" element={<RideDetails />} />
                
                {/* Auth pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>

            {/* Footer always at the bottom */}
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
