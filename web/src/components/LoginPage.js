import React, { useState } from "react";
import { API_BASE_URL } from "../api/Api";
import {
  FaTint,
  FaUserCircle,
  FaLock,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = email.toLowerCase().trim().endsWith("@gmail.com");
  const isFormValid = email && password && isEmailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailNorm = email.toLowerCase().trim();

    if (!emailNorm.endsWith("@gmail.com")) {
      setError("Email harus menggunakan domain @gmail.com");
      setLoading(false);
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
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      setTimeout(() => {
        window.location.href = "/Dashboard";
      }, 500);
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F0F9FF",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          maxWidth: "1400px",
          width: "100%",
          alignItems: "center",
          height: "100vh",
          maxHeight: "100vh",
          overflowY: "hidden",
        }}
      >
        {/* Left Section - Brand & Features (Scrollable) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflowY: "auto",
            paddingRight: "16px",
            maxHeight: "100vh",
          }}
        >
          {/* Brand Section */}
          <div>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "35px",
                backgroundColor: "#4ECDC4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "16px",
                boxShadow: "0 8px 24px rgba(78, 205, 196, 0.3)",
              }}
            >
              <FaTint size={40} color="#FFFFFF" />
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#2C3E50",
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              Prediksi Pra-Diabetes
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#7F8C8D",
                lineHeight: "1.5",
                maxWidth: "400px",
              }}
            >
              Teknologi AI untuk deteksi dini risiko pra-diabetes. Lindungi
              kesehatan Anda dengan prediksi akurat.
            </p>
          </div>

          {/* Features Cards - Compact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#FFFFFF",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "#E8F5F5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <FaTint size={22} color="#4ECDC4" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#2C3E50",
                  }}
                >
                  Monitoring Real-Time
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#7F8C8D",
                  }}
                >
                  Pantau gula darah Anda
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#FFFFFF",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "#F0F9FF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <FaUserShield size={22} color="#2ECC71" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#2C3E50",
                  }}
                >
                  Analisis Komprehensif
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#7F8C8D",
                  }}
                >
                  Perhitungan BMI akurat
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#FFFFFF",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "#FFFAF0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <FaCheckCircle size={22} color="#F39C12" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#2C3E50",
                  }}
                >
                  Prediksi AI 95%+
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#7F8C8D",
                  }}
                >
                  Machine learning terdepan
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badge - Compact */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#E8F5F5",
              borderLeft: "4px solid #4ECDC4",
              padding: "14px 16px",
              borderRadius: "10px",
            }}
          >
            <FaUserShield size={20} color="#4ECDC4" style={{ flexShrink: 0 }} />
            <div
              style={{
                fontSize: "12px",
                color: "#2C3E50",
                fontWeight: "600",
              }}
            >
              Data Anda dilindungi dengan enkripsi tingkat enterprise.
            </div>
          </div>
        </div>

        {/* Right Section - Login Form (Fixed) */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "40px 36px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            height: "fit-content",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#2C3E50",
                marginBottom: "6px",
              }}
            >
              Masuk ke Akun
            </h2>
            <p style={{ fontSize: "13px", color: "#7F8C8D" }}>
              Mulai prediksi kesehatan Anda sekarang
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FEE2E2",
                borderLeft: "4px solid #EF4444",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#991B1B",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input - Larger */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                  marginBottom: "8px",
                }}
              >
                Email <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUserCircle
                  size={20}
                  color="#7F8C8D"
                  style={{
                    position: "absolute",
                    left: "18px",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 18px 16px 56px",
                    border:
                      emailTouched && !isEmailValid
                        ? "2px solid #EF4444"
                        : "2px solid #E8F5F5",
                    borderRadius: "12px",
                    fontSize: "15px",
                    color: "#2C3E50",
                    backgroundColor:
                      emailTouched && !isEmailValid ? "#FEF2F2" : "#F0F9FF",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4ECDC4";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(78, 205, 196, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    setEmailTouched(true);
                  }}
                  required
                />
                {emailTouched && isEmailValid && (
                  <FaCheckCircle
                    size={20}
                    color="#2ECC71"
                    style={{
                      position: "absolute",
                      right: "18px",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              {emailTouched && !isEmailValid && email && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: "#EF4444",
                    fontWeight: "600",
                  }}
                >
                  Email harus menggunakan @gmail.com
                </div>
              )}
            </div>

            {/* Password Input - Larger */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                  marginBottom: "8px",
                }}
              >
                Password <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaLock
                  size={20}
                  color="#7F8C8D"
                  style={{
                    position: "absolute",
                    left: "18px",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px 56px 16px 56px",
                    border: "2px solid #E8F5F5",
                    borderRadius: "12px",
                    fontSize: "15px",
                    color: "#2C3E50",
                    backgroundColor: "#F0F9FF",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4ECDC4";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(78, 205, 196, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    background: "none",
                    border: "none",
                    color: "#7F8C8D",
                    cursor: "pointer",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#4ECDC4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#7F8C8D";
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                fontSize: "12px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#2C3E50",
                  fontWeight: "600",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    cursor: "pointer",
                    width: "18px",
                    height: "18px",
                    accentColor: "#4ECDC4",
                  }}
                />
                <span>Ingat saya</span>
              </label>
              <a
                href="/ForgotPassword"
                style={{
                  color: "#4ECDC4",
                  textDecoration: "none",
                  fontWeight: "700",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#3BA39C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#4ECDC4";
                }}
              >
                Lupa password?
              </a>
            </div>

            {/* Login Button - Larger */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#4ECDC4",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "800",
                cursor: loading || !isFormValid ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s",
                opacity: loading || !isFormValid ? 0.6 : 1,
                boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading && isFormValid) {
                  e.currentTarget.style.backgroundColor = "#45B8AD";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(78, 205, 196, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4ECDC4";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(78, 205, 196, 0.3)";
              }}
            >
              {loading ? (
                <>
                  <FaSpinner
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Sedang Masuk...</span>
                </>
              ) : (
                <>
                  <span>Mulai Prediksi</span>
                  <FaArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "20px 0",
              color: "#7F8C8D",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#E8F5F5",
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: "600" }}>atau</span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#E8F5F5",
              }}
            />
          </div>

          {/* Register Link */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "12px",
                color: "#7F8C8D",
                marginBottom: "10px",
              }}
            >
              Belum punya akun?
            </p>
            <a
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: "#E8F5F5",
                color: "#4ECDC4",
                border: "2px solid #4ECDC4",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "13px",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4ECDC4";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(78, 205, 196, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#E8F5F5";
                e.currentTarget.style.color = "#4ECDC4";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>Daftar Sekarang</span>
              <FaArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1200px) {
          /* Tablet view */
        }

        @media (max-width: 768px) {
          /* Mobile view */
        }
      `}</style>
    </div>
  );
}
