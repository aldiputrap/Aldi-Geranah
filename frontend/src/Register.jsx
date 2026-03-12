import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/auth/register`, { username, password });
      alert("Registrasi Berhasil! Silahkan Login.");
      navigate("/");
    } catch (error) {
      alert("Gagal Register: " + (error.response?.data?.message || "Error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Buat Akun Baru 🚀</h2>
        <p className="auth-subtitle">Daftar untuk mulai berbelanja produk berkualitas.</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-button" type="submit">Daftar Akun</button>
        </form>

        <p className="auth-link-text">
          Sudah punya akun? <a className="auth-link" href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Masuk di sini</a>
        </p>
      </div>
    </div>
  );
}
export default Register;