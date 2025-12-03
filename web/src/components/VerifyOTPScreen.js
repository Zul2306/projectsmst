import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEnvelopeOpen,
  FaShieldAlt,
  FaKeyboard,
  FaClock,
  FaCheckCircle,
  FaRedo,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { API_BASE_URL } from "../api/Api";

export default function VerifyOTPScreen({ email: propEmail, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email =
    propEmail || (location && location.state && location.state.email) || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Masukkan kode OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("Kode OTP harus 6 digit");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        setError("OTP salah atau expired");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        // navigate to ResetPassword page and pass email
        navigate("/ResetPassword", { state: { email } });
      }, 1500);
    } catch (error) {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Kode OTP baru telah dikirim ke email Anda");
        setOtp("");
      } else {
        setError("Gagal mengirim ulang kode");
      }
    } catch (error) {
      setError("Terjadi kesalahan koneksi");
    } finally {
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
              <FaEnvelopeOpen size={40} color="#FFFFFF" />
            </div>
            <div style={styles.securityBadge}>
              <FaShieldAlt size={16} color="#2ECC71" />
            </div>
          </div>

          <h1 style={styles.title}>Verifikasi OTP</h1>
          <p style={styles.subtitle}>
            Masukkan kode 6 digit yang telah dikirim ke
          </p>
          <p style={styles.email}>{email}</p>
        </div>

        <form style={styles.form} onSubmit={handleVerify}>
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {success && (
            <div style={styles.successBox}>
              <p style={styles.successText}>
                OTP terverifikasi! Mengalihkan ke halaman reset password...
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaKeyboard
                size={14}
                color="#4ECDC4"
                style={{ marginRight: "8px" }}
              />
              Kode OTP
            </label>
            <div style={styles.inputContainer}>
              <FaShieldAlt size={22} color="#4ECDC4" style={styles.inputIcon} />
              <input
                type="text"
                style={styles.input}
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                maxLength="6"
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Timer Info Card */}
          <div style={styles.infoCard}>
            <FaClock size={20} color="#F39C12" />
            <p style={styles.infoText}>
              Kode OTP berlaku selama 5 menit. Pastikan memasukkan kode dengan
              benar.
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            style={{
              ...styles.verifyButton,
              opacity: loading || success ? 0.6 : 1,
              cursor: loading || success ? "not-allowed" : "pointer",
            }}
            disabled={loading || success}
            onMouseEnter={(e) => {
              if (!loading && !success) {
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
            {loading || success ? (
              <FaSpinner
                size={20}
                color="#FFFFFF"
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <>
                <span style={styles.verifyButtonText}>Verifikasi Sekarang</span>
                <FaCheckCircle size={22} color="#FFFFFF" />
              </>
            )}
          </button>

          {/* Resend Link */}
          <div style={styles.resendContainer}>
            <p style={styles.resendText}>
              Tidak menerima kode?{" "}
              <button
                type="button"
                style={styles.resendLink}
                onClick={handleResend}
                disabled={loading}
              >
                <FaRedo size={14} style={{ marginRight: "6px" }} />
                Kirim Ulang
              </button>
            </p>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>atau</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Back Button */}
          <div style={styles.backContainer}>
            <button
              type="button"
              style={styles.backButton}
              onClick={() => navigate("/ForgotPassword")}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(78, 205, 196, 0.2)";
                  e.currentTarget.style.backgroundColor = "#F0F9FF";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              <FaArrowLeft size={20} color="#4ECDC4" />
              <span style={styles.backLink}>Ubah Email</span>
            </button>
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
          border-color: #4ECDC4;
          box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
        }

        button:focus {
          outline: none;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
    position: "relative",
    marginBottom: "20px",
  },
  iconBackground: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#4ECDC4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(78, 205, 196, 0.3)",
  },
  securityBadge: {
    position: "absolute",
    bottom: "-5px",
    right: "-5px",
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: "4px",
  },
  email: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#4ECDC4",
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px 24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginTop: "10px",
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
  successBox: {
    backgroundColor: "#DCFCE7",
    borderLeft: "4px solid #22C55E",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
  },
  successText: {
    fontSize: "13px",
    color: "#15803D",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "20px",
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
    fontSize: "20px",
    color: "#2C3E50",
    fontWeight: "700",
    letterSpacing: "12px",
    textAlign: "center",
    border: "none",
    backgroundColor: "transparent",
    transition: "all 0.2s",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
    gap: "12px",
    borderLeft: "4px solid #F39C12",
  },
  infoText: {
    flex: 1,
    fontSize: "12px",
    color: "#2C3E50",
    fontWeight: "600",
    lineHeight: "18px",
  },
  verifyButton: {
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
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(78, 205, 196, 0.3)",
    transition: "all 0.2s",
  },
  resendContainer: {
    marginTop: "24px",
    textAlign: "center",
  },
  resendText: {
    fontSize: "14px",
    color: "#7F8C8D",
    fontWeight: "500",
  },
  resendLink: {
    background: "none",
    border: "none",
    fontSize: "14px",
    color: "#4ECDC4",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "6px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.2s",
    padding: 0,
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
  backContainer: {
    display: "flex",
    justifyContent: "center",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "20px",
    paddingRight: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "25px",
    border: "2px solid #E8F5F5",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s",
  },
  backLink: {
    color: "#4ECDC4",
    fontWeight: "700",
    fontSize: "14px",
  },
};
