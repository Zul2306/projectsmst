import React, { useState } from "react";
import "./LoginPage.css";
import { API_BASE_URL } from "../api/Api";
import {
  FaTint,
  FaUserCircle,
  FaLock,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailNorm = email.toLowerCase().trim();

    if (!emailNorm.endsWith("@gmail.com")) {
      setError("Email harus menggunakan domain @gmail.com");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Email atau password salah.");
        return;
      }

      localStorage.setItem("token", data.access_token);
      alert("Login berhasil!");
      window.location.href = "/Dashboard";
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    }
  };

  return (
    <div className="login-container">
      <div className="decorative-circle1" />
      <div className="decorative-circle2" />

      <div className="login-content">
        <div className="left-section">
          <div className="icon-circle">
            <FaTint size={40} color="#fff" />
          </div>
          <h1>Prediksi Pra-Diabetes</h1>
          <p>Deteksi dini risiko pra-diabetes dengan kecerdasan buatan</p>

          <div className="stat-group">
            <span className="stat-card">
              <FaTint /> Gula Darah
            </span>
            <span className="stat-card">
              <FaUserShield /> BMI
            </span>
            <span className="stat-card">
              <FaArrowRight /> AI Prediksi
            </span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Masuk</h2>
          {error && <p className="error-box">{error}</p>}

          <div className="input-box">
            <label>Email</label>
            <div className="input-field">
              <FaUserCircle size={18} className="input-icon" />
              <input
                type="email"
                placeholder="contoh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-box">
            <label>Password</label>
            <div className="input-field">
              <FaLock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button className="login-btn" type="submit">
            Mulai Prediksi <FaArrowRight size={18} />
          </button>

          <div className="reminder-card">
            <FaUserShield />
            <p>
              Sistem AI kami dapat memprediksi risiko pra-diabetes berdasarkan
              data kesehatan Anda
            </p>
          </div>

          <div className="divider">
            <span></span> atau <span></span>
          </div>

          <div className="register-link">
            Pengguna baru? <a href="/register">Daftar Sekarang 🚀</a>
          </div>
        </form>
      </div>
    </div>
  );
}