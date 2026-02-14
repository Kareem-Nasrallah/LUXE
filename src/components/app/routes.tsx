import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminOffers from "@/pages/admin/AdminOffers";
import AdminLogin from "@/pages/auth/AdminLogin";
import SuccessCheckout from "../SuccessCheckout";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/checkout/success/:orderNumber"
          element={<SuccessCheckout />}
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="offers" element={<AdminOffers />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
