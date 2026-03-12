import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await axios.get(`${apiUrl}/api/products/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil detail produk", err);
            setError("Produk tidak ditemukan atau terjadi kesalahan server.");
            setLoading(false);
        }
    };

    const increment = () => setQuantity(q => (product && q < (product.stok || 0) ? q + 1 : q));
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3ead2" }}>
                <h2 style={{ color: "var(--primary-color)" }}>Memuat...</h2>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3ead2" }}>
                <h2 style={{ color: "var(--danger)", marginBottom: "20px" }}>{error || "Produk tidak ditemukan"}</h2>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Kembali ke Katalog
                </button>
            </div>
        );
    }

    // Fallback values if not in DB
    const stok = product.stok !== undefined ? Number(product.stok) : 0;
    const deskripsi = product.deskripsi || "kartu ULTRA RARE hanya ada satu di dunia";
    const isOutOfStock = stok <= 0;

    return (
        <div style={{
            backgroundColor: "#f4ead3", // Light beige background
            minHeight: "100vh",
            padding: "40px 20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "transparent",
                        color: "#555",
                        border: "1px solid #cbb592",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        marginBottom: "20px",
                        transition: "all 0.2s ease"
                    }}
                >
                    &larr; Kembali
                </button>

                <div style={{
                    display: "flex",
                    gap: "40px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    padding: "20px"
                }}>

                    {/* Left Side: Image */}
                    <div style={{
                        flex: "1 1 400px",
                        backgroundColor: "#d1b38e", // Darker beige behind image
                        borderRadius: "16px",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img
                            src={product.image || "https://placehold.co/400x400?text=No+Image"}
                            alt={product.name}
                            style={{
                                width: "100%",
                                maxHeight: "450px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/400x400?text=No+Image";
                            }}
                        />
                    </div>

                    {/* Right Side: Details */}
                    <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "10px" }}>
                        <h1 style={{ fontSize: "2.5rem", color: "#333", margin: "0 0 10px 0", fontWeight: "700" }}>
                            {product.name}
                        </h1>

                        <p style={{ fontSize: "2rem", color: "#875f45", fontWeight: "bold", margin: "0 0 15px 0" }}>
                            {product.price}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <span style={{ fontSize: "1rem", color: "#555" }}>Stok: {stok}</span>
                            <span style={{
                                backgroundColor: isOutOfStock ? "#ff4d4f" : "#52c41a",
                                color: "white",
                                padding: "4px 16px",
                                borderRadius: "20px",
                                fontSize: "0.85rem",
                                fontWeight: "bold"
                            }}>
                                {isOutOfStock ? "STOK HABIS" : "TERSEDIA"}
                            </span>
                        </div>

                        <div style={{
                            backgroundColor: "#e8dcbe",
                            border: "1px solid #d1ba95",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "30px"
                        }}>
                            <h3 style={{ fontSize: "1.1rem", color: "#333", margin: "0 0 10px 0", fontWeight: "700" }}>Deskripsi:</h3>
                            <p style={{ color: "#555", lineHeight: "1.6", margin: 0, fontSize: "1rem" }}>
                                {deskripsi}
                            </p>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <h4 style={{ fontSize: "1rem", color: "#333", margin: "0 0 10px 0", fontWeight: "600" }}>Beli Produk</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                                <span style={{ fontSize: "0.95rem", color: "#555" }}>Jumlah:</span>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <button
                                        onClick={decrement}
                                        style={{
                                            width: "36px", height: "36px",
                                            backgroundColor: "white", border: "1px solid #ccc",
                                            borderRadius: "6px 0 0 6px", cursor: "pointer",
                                            fontSize: "1.2rem", color: "#555",
                                            display: "flex", justifyContent: "center", alignItems: "center"
                                        }}
                                    >-</button>
                                    <div style={{
                                        width: "48px", height: "36px",
                                        backgroundColor: "white", borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc",
                                        display: "flex", justifyContent: "center", alignItems: "center",
                                        fontSize: "1rem", color: "#333", fontWeight: "600"
                                    }}>
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={increment}
                                        style={{
                                            width: "36px", height: "36px",
                                            backgroundColor: "white", border: "1px solid #ccc",
                                            borderRadius: "0 6px 6px 0", cursor: "pointer",
                                            fontSize: "1.2rem", color: "#555",
                                            display: "flex", justifyContent: "center", alignItems: "center"
                                        }}
                                    >+</button>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (isOutOfStock) return;
                                    const cart = JSON.parse(localStorage.getItem("toko_cart")) || [];
                                    const existingItemIndex = cart.findIndex(item => item.id === product.id);

                                    const currentInCart = existingItemIndex > -1 ? cart[existingItemIndex].quantity : 0;
                                    const totalRequested = currentInCart + quantity;

                                    if (totalRequested > stok) {
                                        alert(`Maaf, stok tidak mencukupi. (Tersedia: ${stok}, Di Keranjang: ${currentInCart})`);
                                        return;
                                    }

                                    if (existingItemIndex > -1) {
                                        cart[existingItemIndex].quantity += quantity;
                                    } else {
                                        cart.push({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.image,
                                            quantity: quantity
                                        });
                                    }

                                    localStorage.setItem("toko_cart", JSON.stringify(cart));
                                    alert(`Berhasil menambahkan ${quantity} ${product.name} ke keranjang!`);
                                    navigate("/cart");
                                }}
                                disabled={isOutOfStock}
                                style={{
                                    backgroundColor: isOutOfStock ? "#d9d9d9" : "#a17a58",
                                    color: "white",
                                    border: "none",
                                    padding: "14px 0",
                                    borderRadius: "12px",
                                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    width: "100%",
                                    boxShadow: isOutOfStock ? "none" : "0 4px 15px rgba(161, 122, 88, 0.4)",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                    if (isOutOfStock) return;
                                    e.target.style.backgroundColor = "#875f45";
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(135, 95, 69, 0.5)";
                                }}
                                onMouseOut={(e) => {
                                    if (isOutOfStock) return;
                                    e.target.style.backgroundColor = "#a17a58";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(161, 122, 88, 0.4)";
                                }}
                            >
                                {isOutOfStock ? "Stok Habis" : "Beli Sekarang"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
