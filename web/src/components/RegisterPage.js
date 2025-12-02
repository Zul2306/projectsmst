import React, { useState } from "react";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { API_BASE_URL } from "../api/Api";

export default function RegisterPage({ onNavigate, onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Semua field harus diisi");
      return;
    }

    const emailNorm = email.toLowerCase().trim();

    if (!emailNorm.endsWith("@gmail.com")) {
      setError("Email harus menggunakan domain @gmail.com");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: emailNorm,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Terjadi kesalahan");
        setLoading(false);
        return;
      }

      alert("Akun berhasil dibuat! Silakan login untuk melanjutkan.");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      setError("Tidak dapat terhubung ke server");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative Background Elements */}
      <div style={styles.decorativeCircle1} />
      <div style={styles.decorativeCircle2} />

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <div style={styles.iconBackground}>
              <FaUserPlus size={36} color="#FFFFFF" />
            </div>
          </div>

          <h1 style={styles.title}>Daftar Sekarang</h1>
          <p style={styles.subtitle}>
            Mulai perjalanan deteksi dini pra-diabetes Anda
          </p>
        </div>

        <form style={styles.form} onSubmit={handleRegister}>
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {/* Full Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaUser
                size={14}
                color="#4ECDC4"
                style={{ marginRight: "8px" }}
              />
              Nama Lengkap
            </label>
            <div style={styles.inputContainer}>
              <FaUser size={22} color="#4ECDC4" style={styles.inputIcon} />
              <input
                type="text"
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaEnvelope
                size={14}
                color="#4ECDC4"
                style={{ marginRight: "8px" }}
              />
              Email
            </label>
            <div style={styles.inputContainer}>
              <FaEnvelope size={22} color="#4ECDC4" style={styles.inputIcon} />
              <input
                type="email"
                style={styles.input}
                placeholder="contoh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaLock
                size={14}
                color="#4ECDC4"
                style={{ marginRight: "8px" }}
              />
              Password
            </label>
            <div style={styles.inputContainer}>
              <FaLock size={22} color="#4ECDC4" style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={styles.toggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash size={22} color="#4ECDC4" />
                ) : (
                  <FaEye size={22} color="#4ECDC4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaCheckCircle
                size={14}
                color="#4ECDC4"
                style={{ marginRight: "8px" }}
              />
              Konfirmasi Password
            </label>
            <div style={styles.inputContainer}>
              <FaShieldAlt size={22} color="#4ECDC4" style={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                style={styles.input}
                placeholder="Ulangi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                style={styles.toggleButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={22} color="#4ECDC4" />
                ) : (
                  <FaEye size={22} color="#4ECDC4" />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            style={{
              ...styles.registerButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(78, 205, 196, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(78, 205, 196, 0.3)";
            }}
          >
            <span style={styles.registerButtonText}>
              {loading ? "Membuat Akun..." : "Buat Akun"}
            </span>
            <FaCheckCircle size={22} color="#FFFFFF" />
          </button>

          {/* Info Card */}
          <div style={styles.infoCard}>
            <FaShieldAlt size={20} color="#2ECC71" />
            <p style={styles.infoText}>
              Data Anda aman dan terenkripsi dengan teknologi terkini
            </p>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>atau</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Login Link */}
          <div style={styles.loginContainer}>
            <p style={styles.loginText}>
              Sudah punya akun?{" "}
              <a href="/" style={styles.loginLink}>
                Masuk di sini
                <FaArrowRight size={14} style={{ marginLeft: "6px" }} />
              </a>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          background-color: #F0F9FF;
          -webkit-font-smoothing: antialiased;
        }

        input:focus {
          outline: none;
        }

        button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F0F9FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    backgroundColor: "#4ECDC4",
    opacity: 0.1,
    pointerEvents: "none",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: "-80px",
    left: "-80px",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    backgroundColor: "#95E1D3",
    opacity: 0.1,
    pointerEvents: "none",
  },
  content: {
    width: "100%",
    maxWidth: "500px",
    zIndex: 10,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
  },
  iconContainer: {
    marginBottom: "16px",
  },
  iconBackground: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4ECDC4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 12px rgba(78, 205, 196, 0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#7F8C8D",
    textAlign: "center",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  form: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px 24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderLeft: "4px solid #EF4444",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
  },
  errorText: {
    fontSize: "13px",
    color: "#991B1B",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: "10px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    border: "2px solid #E8F5F5",
    paddingLeft: "16px",
    paddingRight: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s",
  },
  inputIcon: {
    marginRight: "12px",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    height: "54px",
    fontSize: "15px",
    color: "#2C3E50",
    fontWeight: "500",
    border: "none",
    backgroundColor: "transparent",
    transition: "all 0.2s",
  },
  toggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#4ECDC4",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "16px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "8px",
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(78, 205, 196, 0.3)",
    transition: "all 0.2s",
  },
  registerButtonText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#E8F8F5",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "20px",
    gap: "12px",
    borderLeft: "4px solid #2ECC71",
  },
  infoText: {
    flex: 1,
    fontSize: "12px",
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: "18px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
    gap: "16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: "13px",
    color: "#95A5A6",
    fontWeight: "600",
  },
  loginContainer: {
    textAlign: "center",
  },
  loginText: {
    fontSize: "14px",
    color: "#7F8C8D",
    fontWeight: "500",
  },
  loginLink: {
    textDecoration: "none",
    color: "#4ECDC4",
    fontWeight: "800",
    cursor: "pointer",
    marginLeft: "6px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.2s",
    padding: 0,
    background: "none",
    border: "none",
  },
};
