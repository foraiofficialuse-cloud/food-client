import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getMeAPI } from '@/lib/api';
import { useEffect } from 'react';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminVerifyUsers from '@/pages/admin/VerifyUsers';
import AdminUsers from '@/pages/admin/Users';
import AdminAllOrders from '@/pages/admin/AllOrders';

// Hotel Pages
import HotelDashboard from '@/pages/hotel/Dashboard';
import HotelUploadFood from '@/pages/hotel/UploadFood';
import HotelMyListings from '@/pages/hotel/MyListings';
import HotelIncomingRequests from '@/pages/hotel/IncomingRequests';

// NGO Pages
import NGODashboard from '@/pages/ngo/Dashboard';
import NGOAvailableFood from '@/pages/ngo/AvailableFood';
import NGOMyRequests from '@/pages/ngo/MyRequests';
import NGOFoodServed from '@/pages/ngo/FoodServed';

function App() {
  const { user, token, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Keep auth state in sync after admin approval/rejection changes.
    const syncProfile = async () => {
      try {
        const res = await getMeAPI();
        setUser(res.data.user, token);
      } catch {
        logout();
      }
    };

    syncProfile();
    const intervalId = window.setInterval(syncProfile, 30000);
    return () => window.clearInterval(intervalId);
  }, [token, setUser, logout]);

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={getDashboardPath()} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={getDashboardPath()} /> : <Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="verify-users" element={<AdminVerifyUsers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminAllOrders />} />
        </Route>

        {/* Hotel Routes */}
        <Route path="/hotel" element={<ProtectedRoute role="hotel" />}>
          <Route path="dashboard" element={<HotelDashboard />} />
          <Route path="upload-food" element={<HotelUploadFood />} />
          <Route path="my-listings" element={<HotelMyListings />} />
          <Route path="requests" element={<HotelIncomingRequests />} />
        </Route>

        {/* NGO Routes */}
        <Route path="/ngo" element={<ProtectedRoute role="ngo" />}>
          <Route path="dashboard" element={<NGODashboard />} />
          <Route path="available-food" element={<NGOAvailableFood />} />
          <Route path="my-requests" element={<NGOMyRequests />} />
          <Route path="food-served" element={<NGOFoodServed />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;