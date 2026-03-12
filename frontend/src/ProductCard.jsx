import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: "none",
        borderRadius: "20px",
        padding: "20px",
        textAlign: "left",
        backgroundColor: "white",
        boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 15px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)"
      }}
    >
      <div style={{
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "14px",
        backgroundColor: "#f8fafc",
        marginBottom: "20px"
      }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {Number(product.stok) <= 0 && (
            <span style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#ff4d4f",
              color: "white",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              zIndex: 1
            }}>
              STOK HABIS
            </span>
          )}
          <img
            src={product.image || "https://placehold.co/200x200?text=No+Image"}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.08)" : "scale(1)"
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/200x200?text=No+Image";
            }}
          />
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "var(--text-dark)", fontWeight: "600" }}>{product.name}</h3>
        <p style={{ color: "var(--primary-color)", fontWeight: "700", fontSize: "1.25rem", margin: "0 0 20px 0" }}>{product.price}</p>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          style={{
            backgroundColor: isHovered ? "var(--primary-hover)" : "var(--primary-color)",
            color: "white",
            border: "none",
            padding: "14px",
            width: "100%",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(79, 70, 229, 0.3)" : "none"
          }}>
          Lihat Detail
        </button>
      </div>
    </div>
  );
};
export default ProductCard;