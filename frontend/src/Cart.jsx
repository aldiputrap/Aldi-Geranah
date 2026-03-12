import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem("toko_cart")) || [];
        setCartItems(savedCart);
    };

    const removeFromCart = (indexToRemove) => {
        const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(updatedCart);
        localStorage.setItem("toko_cart", JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        if (window.confirm("Kosongkan keranjang?")) {
            setCartItems([]);
            localStorage.removeItem("toko_cart");
        }
    };

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

    // Format number back to Rupiah style
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        navigate("/checkout");
    };

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", margin: "0 0 5px 0", fontWeight: "700" }}>Keranjang Belanja 🛒</h2>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>{cartItems.length} produk di keranjang</p>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
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
                        onMouseOver={(e) => { e.target.style.backgroundColor = "#f8fafc"; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = "white"; }}
                    >
                        &larr; Lanjut Belanja
                    </button>
                </header>

                {cartItems.length === 0 ? (
                    <div style={{
                        background: "white", borderRadius: "20px", padding: "60px 20px",
                        textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                    }}>
                        <h3 style={{ color: "var(--text-dark)", marginBottom: "15px" }}>Keranjang masih kosong</h3>
                        <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Ayo cari produk impianmu di katalog!</p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            style={{
                                backgroundColor: "var(--primary-color)", color: "white",
                                padding: "12px 24px", border: "none", borderRadius: "10px",
                                fontWeight: "600", cursor: "pointer"
                            }}
                        >
                            Lihat Katalog
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "20px 0", borderBottom: index < cartItems.length - 1 ? "1px solid #f1f5f9" : "none"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                        <div style={{ width: "80px", height: "80px", borderRadius: "10px", backgroundColor: "#f8fafc", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <img
                                                src={item.image || "https://placehold.co/100x100?text=No+Image"}
                                                alt={item.name}
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: "0 0 5px 0", color: "var(--text-dark)", fontSize: "1.1rem" }}>{item.name}</h4>
                                            <p style={{ margin: 0, color: "var(--primary-color)", fontWeight: "600" }}>{item.price}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Kuantitas:</span>
                                            <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "var(--text-dark)", background: "#f1f5f9", padding: "4px 12px", borderRadius: "6px" }}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(index)}
                                            style={{
                                                background: "#fee2e2", color: "#ef4444",
                                                border: "none", padding: "8px 16px", borderRadius: "8px",
                                                cursor: "pointer", fontWeight: "600"
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: "white", borderRadius: "20px", padding: "30px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div>
                                <p style={{ color: "var(--text-muted)", margin: "0 0 5px 0", fontSize: "1rem" }}>Total Belanja</p>
                                <h3 style={{ color: "var(--text-dark)", margin: 0, fontSize: "1.8rem", fontWeight: "800" }}>
                                    {formatRupiah(calculateTotal())}
                                </h3>
                            </div>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <button
                                    onClick={clearCart}
                                    style={{
                                        backgroundColor: "transparent", color: "var(--text-muted)",
                                        padding: "14px 24px", border: "1px solid #e2e8f0", borderRadius: "12px",
                                        fontWeight: "600", cursor: "pointer"
                                    }}
                                >
                                    Kosongkan
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        backgroundColor: "#10b981", color: "white", // Success Green
                                        padding: "14px 32px", border: "none", borderRadius: "12px",
                                        fontWeight: "700", cursor: "pointer", fontSize: "1.1rem",
                                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                                    onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
