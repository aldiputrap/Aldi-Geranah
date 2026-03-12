import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import MasterProduct from "./MasterProduct";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";

function App() {
  return (
    <Routes>
      {/* Jika buka halaman utama, lempar ke login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Rute Login */}
      <Route path="/login" element={<Login />} />

      {/* Rute Register */}
      <Route path="/register" element={<Register />} />

      {/* Rute Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Rute Master Product */}
      <Route path="/master" element={<MasterProduct />} />

      {/* Rute Product Detail */}
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Rute Keranjang */}
      <Route path="/cart" element={<Cart />} />

      {/* Rute Checkout */}
      <Route path="/checkout" element={<Checkout />} />

      {/* Rute Riwayat Pesanan */}
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}

export default App;