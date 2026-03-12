import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const userId = localStorage.getItem("user_id");
            const role = localStorage.getItem("user_role");

            const response = await axios.get(`${apiUrl}/api/orders`, {
                params: { user_id: userId, role: role }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil riwayat pesanan", error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            await axios.put(`${apiUrl}/api/orders/${id}/status`, { status: newStatus });
            alert(`Status pesanan #${id} diperbarui menjadi ${newStatus}`);
            fetchOrders();
        } catch (error) {
            alert("Gagal memperbarui status pesanan");
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus pesanan ini? Data yang dihapus tidak bisa dikembalikan.")) {
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            await axios.delete(`${apiUrl}/api/orders/${id}`);
            alert("Pesanan berhasil dihapus!");
            fetchOrders();
        } catch (error) {
            console.error("Gagal menghapus pesanan", error);
            alert("Terjadi kesalahan saat menghapus pesanan.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Diproses": return { bg: "#fff7e6", color: "#faad14", border: "#ffe58f" };
            case "Dikirim": return { bg: "#e6f7ff", color: "#1890ff", border: "#91d5ff" };
            case "Selesai": return { bg: "#f6ffed", color: "#52c41a", border: "#b7eb8f" };
            default: return { bg: "#f5f5f5", color: "#8c8c8c", border: "#d9d9d9" };
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ color: "var(--text-dark)", fontSize: "2rem", margin: "0 0 5px 0", fontWeight: "700" }}>Riwayat Pesanan 📋</h2>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>Lacak status pengiriman pesanan Anda</p>
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
                        }}
                    >
                        &larr; Kembali ke Dashboard
                    </button>
                </header>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>Memuat riwayat pesanan...</div>
                ) : orders.length === 0 ? (
                    <div style={{ background: "white", borderRadius: "20px", padding: "60px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                        <h3 style={{ color: "var(--text-dark)" }}>Belum ada pesanan</h3>
                        <p style={{ color: "var(--text-muted)" }}>Silakan lakukan pembelian di katalog.</p>
                        <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px", padding: "12px 24px", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Belanja Sekarang</button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {orders.map((order) => {
                            const style = getStatusStyle(order.status);
                            return (
                                <div key={order.id} style={{ background: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: `1px solid #f1f5f9` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                                        <div>
                                            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>ID PESANAN: #{order.id}</span>
                                            <h4 style={{ margin: "5px 0", fontSize: "1.2rem", color: "var(--text-dark)" }}>{order.customer_name}</h4>
                                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>{formatDate(order.created_at)}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{
                                                backgroundColor: style.bg,
                                                color: style.color,
                                                border: `1px solid ${style.border}`,
                                                padding: "6px 16px",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase"
                                            }}>
                                                {order.status}
                                            </span>
                                            <h3 style={{ margin: "10px 0 0 0", color: "var(--primary-color)", fontWeight: "800" }}>{order.total_amount}</h3>
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
                                        <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: "600", color: "var(--text-dark)" }}>Detail Pengiriman:</p>
                                        <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#475569" }}>📞 {order.phone}</p>
                                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>📍 {order.address}</p>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: "0.85rem", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", color: "var(--text-muted)" }}>
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            {localStorage.getItem("user_role") === "admin" && (
                                                <>
                                                    <button
                                                        onClick={() => deleteOrder(order.id)}
                                                        style={{
                                                            padding: "8px 16px",
                                                            backgroundColor: "#fee2e2",
                                                            color: "#dc2626",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            fontWeight: "600",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Hapus
                                                    </button>
                                                    {order.status === "Diproses" && (
                                                        <button onClick={() => updateStatus(order.id, "Dikirim")} style={{ padding: "8px 16px", backgroundColor: "#e0f2fe", color: "#0369a1", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Kirim Barang</button>
                                                    )}
                                                </>
                                            )}
                                            {order.status === "Dikirim" && (
                                                <button onClick={() => updateStatus(order.id, "Selesai")} style={{ padding: "8px 16px", backgroundColor: "#dcfce7", color: "#15803d", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Konfirmasi Sampai</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Orders;
