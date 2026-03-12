import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MasterProduct = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: null, name: "", price: "", image: "", stok: 0, deskripsi: "" });
    const navigate = useNavigate();
    const nameInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
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

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            if (form.id) {
                await axios.put(`${apiUrl}/api/products/${form.id}`, form);
                alert("Produk berhasil diupdate!");
            } else {
                await axios.post(`${apiUrl}/api/products`, form);
                alert("Produk berhasil ditambahkan!");
            }
            setForm({ id: null, name: "", price: "", image: "", stok: 0, deskripsi: "" });
            fetchProducts();
        } catch (error) {
            alert("Terjadi kesalahan saat menyimpan produk");
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
            if (nameInputRef.current) nameInputRef.current.focus();
        }, 300);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
                await axios.delete(`${apiUrl}/api/products/${id}`);
                alert("Produk berhasil dihapus!");
                fetchProducts();
            } catch (error) {
                alert("Terjadi kesalahan saat menghapus produk");
            }
        }
    };

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto", background: "white", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "20px", marginBottom: "30px" }}>
                    <h2 style={{ color: "var(--text-dark)", fontSize: "1.8rem", margin: 0 }}>Kelola Data Produk</h2>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "var(--bg-gradient)",
                            color: "var(--primary-color)",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "all 0.2s"
                        }}
                    >
                        ← Kembali ke Dashboard
                    </button>
                </header>

                <div style={{
                    background: "#f8fafc",
                    padding: "30px",
                    borderRadius: "16px",
                    marginBottom: "40px",
                    border: "1px solid #e2e8f0"
                }}>
                    <h3 style={{ marginBottom: "20px", color: "var(--primary-color)", fontSize: "1.2rem" }}>
                        {form.id ? "Edit Produk" : "✨ Tambah Produk Baru"}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>Nama Produk</label>
                            <input ref={nameInputRef} className="auth-input" type="text" name="name" value={form.name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>Harga</label>
                            <input className="auth-input" type="text" name="price" value={form.price} onChange={handleInputChange} placeholder="Mis. Rp 1.500.000" required />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>URL Gambar</label>
                            <input className="auth-input" type="text" name="image" value={form.image} onChange={handleInputChange} placeholder="https://..." required />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>Stok</label>
                            <input className="auth-input" type="number" name="stok" value={form.stok} onChange={handleInputChange} required />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--text-muted)" }}>Deskripsi Produk</label>
                            <textarea className="auth-input" name="deskripsi" value={form.deskripsi} onChange={handleInputChange} placeholder="Deskripsi lengkap tentang produk..." rows="3" style={{ resize: "vertical" }} required></textarea>
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button type="submit" style={{ padding: "12px 30px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}>
                                {form.id ? "Simpan Perubahan" : "Tambah Produk"}
                            </button>
                            {form.id && (
                                <button type="button" onClick={() => setForm({ id: null, name: "", price: "", image: "", stok: 0, deskripsi: "" })} style={{ padding: "12px 30px", backgroundColor: "#e2e8f0", color: "var(--text-dark)", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0", textAlign: "left" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "16px", color: "var(--text-muted)", fontWeight: "600", borderBottom: "2px solid #e2e8f0" }}>ID</th>
                                <th style={{ padding: "16px", color: "var(--text-muted)", fontWeight: "600", borderBottom: "2px solid #e2e8f0" }}>Produk Info</th>
                                <th style={{ padding: "16px", color: "var(--text-muted)", fontWeight: "600", borderBottom: "2px solid #e2e8f0" }}>Harga</th>
                                <th style={{ padding: "16px", color: "var(--text-muted)", fontWeight: "600", borderBottom: "2px solid #e2e8f0", textAlign: "center" }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Belum ada data produk terdaftar.</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} style={{ transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#f8fafc"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", fontWeight: "500" }}>#{p.id}</td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <img
                                                        src={p.image || "https://placehold.co/200x200?text=No+Image"}
                                                        alt={p.name}
                                                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://placehold.co/200x200?text=No+Image";
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", fontWeight: "600", color: "var(--success)" }}>{p.price}</td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                                            <button onClick={() => handleEdit(p)} style={{ padding: "8px 16px", backgroundColor: "#fef3c7", color: "#d97706", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontWeight: "600" }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ padding: "8px 16px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default MasterProduct;
