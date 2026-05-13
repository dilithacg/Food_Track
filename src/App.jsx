import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddRecipe from "./pages/admin/AddRecipe";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import RecipeList from "./pages/RecipeList";
// 1. Import the Shop Dashboard
import ShopDashboard from "./pages/shop/ShopDashboard";
import UserRequest from "./pages/UserRequest";
import MyOrders from "./pages/MyOrders";
import Analysis from "./pages/Analysis";
import AdminAddShop from "./pages/admin/AdminAddShop";
import FavoriteList from "./pages/FavoriteList";
import FoodScanner from "./pages/FoodScanner";
import SmartRecipe from "./pages/SmartRecipe";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/all-recipes" element={<RecipeList />} />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-recipe"
            element={
              <AdminRoute>
                <AddRecipe />
              </AdminRoute>
            }
          />
          <Route
            path="/AdminAddShop"
            element={
              <AdminRoute>
                <AdminAddShop />
              </AdminRoute>
            }
          />
          <Route
            path="/request-process"
            element={
              <ProtectedRoute>
                <UserRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorite-list"
            element={
              <ProtectedRoute>
                <FavoriteList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-scanner"
            element={
              <ProtectedRoute>
                <FoodScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-recipe"
            element={
              <ProtectedRoute>
                <SmartRecipe />
              </ProtectedRoute>
            }
          />

          {/* 2. Shop Protected Route */}
          <Route
            path="/shop-dashboard"
            element={
              <ProtectedRoute>
                {/* 
                   Note: Use ProtectedRoute for now, or create a ShopRoute.js 
                   to ensure ONLY users with role === 'shop' can enter.
                */}
                <ShopDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
