import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      alert("Login Berhasil!");
      navigate("/dashboard");
    } catch (error) {
      alert("Gagal Login: " + (error.response?.data?.message || "Server mati"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Selamat Datang 👋</h2>
        <p className="auth-subtitle">Masuk untuk melanjutkan ke dashboard.</p>

        <form onSubmit={handleLogin}>
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
          <button className="auth-button" type="submit">Log in</button>
        </form>

        <p className="auth-link-text">
          Belum punya akun? <a className="auth-link" href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Daftar sekarang</a>
        </p>
      </div>
    </div>
  );
}
export default Login;