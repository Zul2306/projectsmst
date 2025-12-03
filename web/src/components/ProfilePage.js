import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEdit,
  FaCheckCircle,
  FaTimes,
  FaSignOutAlt,
  FaHeartbeat,
  FaEnvelope,
  FaWeight,
  FaRulerVertical,
} from "react-icons/fa";
import { API_BASE_URL } from "../api/Api";

export default function ProfileScreen({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const t = localStorage.getItem("token");
        if (!t) {
          alert("Token tidak ditemukan, silakan login ulang.");
          onLogout && onLogout();
          return;
        }
        setToken(t);
        await fetchProfile(t);
      } catch (err) {
        console.log("load profile err", err);
        alert("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fetchProfile = async (t) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: t,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("fetchProfile err", data);
        alert(data.detail || "Gagal memuat profil");
        if (res.status === 401) onLogout && onLogout();
        return;
      }
      setProfile({
        name: data.name || "",
        email: data.email || "",
        weight: data.weight ? String(data.weight) : "",
        height: data.height ? String(data.height) : "",
      });
      setEditedProfile({
        name: data.name || "",
        weight: data.weight ? String(data.weight) : "",
        height: data.height ? String(data.height) : "",
      });
    } catch (err) {
      console.log("fetchProfile exception", err);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSubmit = async () => {
    if (!editedProfile.name.trim()) {
      alert("Nama tidak boleh kosong");
      return;
    }
    const weightNum = parseFloat(editedProfile.weight);
    const heightNum = parseFloat(editedProfile.height);
    if (!weightNum || weightNum <= 0) {
      alert("Berat badan harus lebih dari 0");
      return;
    }
    if (!heightNum || heightNum <= 0) {
      alert("Tinggi badan harus lebih dari 0");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: editedProfile.name,
          weight: weightNum,
          height: heightNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("update profile err", data);
        alert(data.detail || "Gagal mengupdate profil");
        if (res.status === 401) onLogout && onLogout();
        return;
      }

      setProfile({
        name: data.name || editedProfile.name,
        email: data.email || profile.email,
        weight: data.weight ? String(data.weight) : String(weightNum),
        height: data.height ? String(data.height) : String(heightNum),
      });
      setIsEditing(false);
      alert("Profile berhasil diupdate!");
    } catch (err) {
      console.log("submit exception", err);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height) / 100;
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return "-";
  };

  const getBMICategory = (bmi) => {
    if (bmi === "-") return { text: "-", color: "#7F8C8D" };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: "Underweight", color: "#F39C12" };
    if (bmiValue < 25) return { text: "Normal", color: "#2ECC71" };
    if (bmiValue < 30) return { text: "Overweight", color: "#F39C12" };
    return { text: "Obese", color: "#E74C3C" };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Memuat profil...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header with Avatar */}
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarLarge}>
              <FaUser size={52} color="#FFFFFF" />
            </div>
            <div style={styles.statusBadge}>
              <FaCheckCircle size={20} color="#2ECC71" />
            </div>
          </div>
          <h1 style={styles.headerName}>{profile.name}</h1>
          <p style={styles.headerEmail}>{profile.email}</p>
        </div>

        {/* BMI Card */}
        <div style={styles.bmiCard}>
          <div style={styles.bmiHeader}>
            <FaHeartbeat size={24} color="#4ECDC4" />
            <span style={styles.bmiLabel}>Body Mass Index (BMI)</span>
          </div>
          <div style={styles.bmiValue}>{bmi}</div>
          <div
            style={{
              ...styles.bmiCategory,
              backgroundColor: `${bmiCategory.color}15`,
            }}
          >
            <span
              style={{ ...styles.bmiCategoryText, color: bmiCategory.color }}
            >
              {bmiCategory.text}
            </span>
          </div>
          {bmi !== "-" && (
            <p style={styles.bmiHelper}>
              BMI dihitung dari berat dan tinggi badan Anda
            </p>
          )}
        </div>

        {/* Profile Information Card */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.formTitleContainer}>
              <FaUser size={22} color="#4ECDC4" />
              <h2 style={styles.formTitle}>Informasi Profil</h2>
            </div>
            {!isEditing && (
              <button style={styles.editButton} onClick={handleEdit}>
                <FaEdit size={18} color="#4ECDC4" />
                <span style={styles.editButtonText}>Edit</span>
              </button>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaUser
                size={12}
                color="#4ECDC4"
                style={{ marginRight: "6px" }}
              />
              NAMA LENGKAP
            </label>
            {isEditing ? (
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            ) : (
              <p style={styles.value}>{profile.name}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaEnvelope
                size={12}
                color="#4ECDC4"
                style={{ marginRight: "6px" }}
              />
              EMAIL
            </label>
            <p style={styles.value}>{profile.email}</p>
            <p style={styles.helperText}>Email tidak dapat diubah</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaWeight
                size={12}
                color="#4ECDC4"
                style={{ marginRight: "6px" }}
              />
              BERAT BADAN (KG)
            </label>
            {isEditing ? (
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  value={editedProfile.weight}
                  onChange={(e) => {
                    const fixed = e.target.value.replace(/,/g, ".");
                    setEditedProfile({ ...editedProfile, weight: fixed });
                  }}
                  placeholder="Contoh: 65.5"
                />
              </div>
            ) : (
              <p style={styles.value}>{profile.weight} kg</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaRulerVertical
                size={12}
                color="#4ECDC4"
                style={{ marginRight: "6px" }}
              />
              TINGGI BADAN (CM)
            </label>
            {isEditing ? (
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  value={editedProfile.height}
                  onChange={(e) => {
                    const fixed = e.target.value.replace(/,/g, ".");
                    setEditedProfile({ ...editedProfile, height: fixed });
                  }}
                  placeholder="Contoh: 170"
                />
              </div>
            ) : (
              <p style={styles.value}>{profile.height} cm</p>
            )}
          </div>

          {isEditing && (
            <div style={styles.actionButtons}>
              <button style={styles.cancelButton} onClick={handleCancel}>
                <FaTimes size={20} color="#7F8C8D" />
                <span style={styles.cancelButtonText}>Batal</span>
              </button>
              <button
                style={styles.submitButton}
                onClick={handleSubmit}
                disabled={saving}
              >
                <FaCheckCircle size={20} color="#FFFFFF" />
                <span style={styles.submitButtonText}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {!isEditing && (
          <button style={styles.logoutButton} onClick={onLogout}>
            <FaSignOutAlt size={22} color="#E74C3C" />
            <span style={styles.logoutText}>Keluar dari Akun</span>
          </button>
        )}

        <div style={{ height: "40px" }} />
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
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
    flex: 1,
    backgroundColor: "#F0F9FF",
    minHeight: "100vh",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  maxWidth: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 16px",
  },
  loadingContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    minHeight: "100vh",
    flexDirection: "column",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #E8F5F5",
    borderTop: "4px solid #4ECDC4",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#7F8C8D",
    fontWeight: "500",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "32px",
    paddingBottom: "32px",
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: "16px",
  },
  avatarLarge: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#4ECDC4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
  },
  statusBadge: {
    position: "absolute",
    bottom: "0",
    right: "0",
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  headerName: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: "4px",
  },
  headerEmail: {
    fontSize: "14px",
    color: "#7F8C8D",
    fontWeight: "500",
  },
  bmiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  bmiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  bmiLabel: {
    fontSize: "14px",
    color: "#7F8C8D",
    fontWeight: "600",
  },
  bmiValue: {
    fontSize: "56px",
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: "12px",
  },
  bmiCategory: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "20px",
    marginBottom: "8px",
  },
  bmiCategoryText: {
    fontSize: "15px",
    fontWeight: "700",
  },
  bmiHelper: {
    fontSize: "12px",
    color: "#95A5A6",
    fontStyle: "italic",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  formTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#2C3E50",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingLeft: "14px",
    paddingRight: "14px",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#E8F5F5",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  editButtonText: {
    color: "#4ECDC4",
    fontWeight: "700",
    fontSize: "14px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
  },
  value: {
    fontSize: "16px",
    color: "#2C3E50",
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: "12px",
    border: "2px solid #E8F5F5",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    color: "#2C3E50",
    fontWeight: "500",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "transparent",
    transition: "all 0.2s",
  },
  helperText: {
    fontSize: "11px",
    color: "#95A5A6",
    marginTop: "6px",
    fontStyle: "italic",
  },
  actionButtons: {
    display: "flex",
    marginTop: "12px",
    gap: "12px",
  },
  cancelButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#F0F9FF",
    padding: "16px",
    borderRadius: "14px",
    border: "2px solid #E0E0E0",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontWeight: "700",
    fontSize: "15px",
  },
  submitButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: "#4ECDC4",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
    transition: "all 0.2s",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: "15px",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#FFEBEE",
    padding: "18px",
    borderRadius: "16px",
    marginTop: "8px",
    border: "2px solid #FFCDD2",
    color: "#E74C3C",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
  },
  logoutText: {
    color: "#E74C3C",
    fontWeight: "700",
    fontSize: "16px",
  },
};
