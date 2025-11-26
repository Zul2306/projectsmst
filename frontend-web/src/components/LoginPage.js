import React, { useState } from "react";
import "./LoginPage.css";
import { API_BASE_URL } from "../api/Api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Email atau password salah.");
        return;
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.access_token);

      alert("Login berhasil!");

      // Redirect ke halaman dashboard
      window.location.href = "/Dashboard";
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Selamat Datang</h1>
          <p>Silakan masuk ke akun Anda</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Masuk
          </button>
        </form>

        <div className="signup-link">
          <p>
            Belum punya akun? <a href="#">Daftar sekarang</a>
          </p>
        </div>
      </div>
    </div>
  );
}
