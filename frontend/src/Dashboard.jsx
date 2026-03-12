import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    const cart = JSON.parse(localStorage.getItem("toko_cart")) || [];
    setCartCount(cart.length);
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.get(`${apiUrl}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal mengambil data produk", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout Berhasil!");
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "30px 20px" }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--glass-bg)",
        padding: "20px 40px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        backdropFilter: "blur(12px)",
        marginBottom: "40px",
        maxWidth: "1200px",
        margin: "0 auto 40px"
      }}>
        <h2 style={{ color: "var(--primary-color)", margin: 0, fontWeight: "700" }}>Toko Gerabah 🚀</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => navigate("/master")}
            style={{
              backgroundColor: "var(--success)",
              color: "white",
              padding: "12px 24px",
              border: "none",
              cursor: "pointer",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Master Produk
          </button>
          <button
            onClick={() => navigate("/orders")}
            style={{
              backgroundColor: "#6366f1", // Indigo
              color: "white",
              padding: "12px 24px",
              border: "none",
              cursor: "pointer",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Riwayat Pesanan 📋
          </button>
          <button
            onClick={() => navigate("/cart")}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              padding: "12px 24px",
              border: "none",
              cursor: "pointer",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "transform 0.2s",
              position: "relative"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Keranjang 🛒
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-8px",
                backgroundColor: "var(--danger)", color: "white",
                borderRadius: "50%", padding: "4px 8px", fontSize: "0.75rem", fontWeight: "bold"
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--danger)",
              color: "white",
              padding: "12px 24px",
              border: "none",
              cursor: "pointer",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Keluar
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h3 style={{ color: "var(--text-dark)", marginBottom: "30px", fontSize: "1.5rem", fontWeight: "700" }}>Katalog Produk Terbaru</h3>
        {products.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px", background: "white", borderRadius: "20px" }}>Belum ada produk. Silakan tambahkan di Master Produk.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "30px"
          }}>
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;