import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("toko_cart")) || [];
        if (savedCart.length === 0) {
            alert("Keranjang kosong!");
            navigate("/dashboard");
        } else {
            setCartItems(savedCart);
        }
    }, [navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            let priceStr = String(item.price);
            if (priceStr.endsWith(".00") || priceStr.endsWith(",00")) {
                priceStr = priceStr.slice(0, -3);
            }
            priceStr = priceStr.replace(/[^0-9]/g, "");
            const numericPrice = parseInt(priceStr, 10) || 0;
            return total + (numericPrice * item.quantity);
        }, 0);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    const totalAmount = formatRupiah(calculateTotal());

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

            const payload = {
                ...formData,
                total_amount: totalAmount,
                items: cartItems
            };

            await axios.post(`${apiUrl}/api/orders`, payload);

            localStorage.removeItem("toko_cart");
            alert("🎉 Pesanan berhasil dibuat! Terima kasih telah berbelanja.");
            navigate("/orders");

        } catch (error) {
            console.error("Gagal melakukan checkout:", error);
            alert("Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", margin: "0 0 5px 0", fontWeight: "700" }}>Checkout 🚚</h2>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>Lengkapi data pengiriman Anda</p>
                    </div>
                    <button
                        onClick={() => navigate("/cart")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "white",
                            color: "var(--text-dark)",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "all 0.2s"
                        }}
                    >
                        &larr; Kembali ke Keranjang
                    </button>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>

                    {/* Ringkasan Pesanan */}
                    <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px", color: "var(--text-dark)" }}>Ringkasan Pesanan</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
                            {cartItems.map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>{item.quantity}x</span>
                                        <span style={{ color: "var(--text-muted)" }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px dashed #e2e8f0", paddingTop: "20px" }}>
                            <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-muted)" }}>Total Pembayaran:</span>
                            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>{totalAmount}</span>
                        </div>
                    </div>

                    {/* Form Pengiriman */}
                    <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        <h3 style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px", color: "var(--text-dark)" }}>Data Pengiriman</h3>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--text-dark)" }}>Nama Penerima</label>
                                <input
                                    type="text" name="customer_name"
                                    value={formData.customer_name} onChange={handleInputChange}
                                    required placeholder="Mis. Budi Santoso"
                                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "1rem" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--text-dark)" }}>Nomor HP/WhatsApp</label>
                                <input
                                    type="text" name="phone"
                                    value={formData.phone} onChange={handleInputChange}
                                    required placeholder="Mis. 081234567890"
                                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "1rem" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--text-dark)" }}>Alamat Pengiriman Lengkap</label>
                                <textarea
                                    name="address" rows="4"
                                    value={formData.address} onChange={handleInputChange}
                                    required placeholder="Nama jalan, Nomor rumah, RT/RW, Kelurahan, Kecamatan, Kota..."
                                    style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "1rem", resize: "vertical" }}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: isSubmitting ? "#9ca3af" : "var(--primary-color)",
                                    color: "white", padding: "16px", border: "none", borderRadius: "12px",
                                    fontWeight: "700", fontSize: "1.1rem", cursor: isSubmitting ? "not-allowed" : "pointer",
                                    marginTop: "10px", boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)"
                                }}
                            >
                                {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
