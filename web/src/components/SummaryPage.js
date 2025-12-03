import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Droplet,
  Heart,
  Activity,
  Clock,
  Calendar,
  PieChart,
  Stethoscope,
} from "lucide-react";

// Ganti dengan API_BASE_URL Anda
import { API_BASE_URL } from "../api/Api";

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        setSummary(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/summary/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        setSummary(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("Summary fetch error", err);
        alert(err.detail || "Gagal memuat ringkasan");
        setSummary(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      // normalisasi
      const normalized = {
        total_predictions: Number(data.total_predictions) || 0,
        diabetes_count: Number(data.diabetes_count) || 0,
        non_diabetes_count: Number(data.non_diabetes_count) || 0,
        avg_probability:
          data.avg_probability != null ? Number(data.avg_probability) : null,
        avg_glucose: data.avg_glucose != null ? Number(data.avg_glucose) : null,
        avg_blood_pressure:
          data.avg_blood_pressure != null
            ? Number(data.avg_blood_pressure)
            : null,
        latest: data.latest || null,
      };

      setSummary(normalized);
    } catch (e) {
      console.log("loadSummary exception", e);
      alert("Tidak dapat terhubung ke server");
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSummary();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  const getPercentage = (count, total) => {
    if (!total || total === 0) return "0.0";
    return ((count / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 72px)",
          backgroundColor: "#F0F9FF",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #E8F5F5",
            borderTop: "4px solid #4ECDC4",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            marginTop: "12px",
            fontSize: "14px",
            color: "#7F8C8D",
            fontWeight: "500",
          }}
        >
          Memuat ringkasan...
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 72px)",
          backgroundColor: "#F0F9FF",
        }}
      >
        <AlertTriangle size={64} color="#B8B8B8" />
        <div
          style={{
            marginTop: "16px",
            fontSize: "16px",
            fontWeight: "700",
            color: "#7F8C8D",
          }}
        >
          Tidak ada data
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F0F9FF",
        padding: "16px",
        minHeight: "100%",
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "28px",
            borderRadius: "20px",
            textAlign: "center",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "35px",
              backgroundColor: "#4ECDC4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
            }}
          >
            <BarChart3 size={32} color="#FFFFFF" />
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#2C3E50",
              marginBottom: "8px",
            }}
          >
            Ringkasan Kesehatan
          </div>
          <div style={{ fontSize: "14px", color: "#7F8C8D" }}>
            Overview data prediksi Anda
          </div>
        </div>

        {/* Total Predictions Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "24px",
            borderRadius: "20px",
            textAlign: "center",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "28px",
              backgroundColor: "#E8F5F5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 12px",
            }}
          >
            <FileText size={28} color="#4ECDC4" />
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#7F8C8D",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Total Prediksi
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "#2C3E50",
              marginBottom: "4px",
            }}
          >
            {summary.total_predictions}
          </div>
          <div style={{ fontSize: "12px", color: "#95A5A6" }}>
            Prediksi yang telah dilakukan
          </div>
        </div>

        {/* Prediction Breakdown */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "#2C3E50",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PieChart size={16} color="#4ECDC4" />
            <span>Breakdown Hasil</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: 1, textAlign: "center", minWidth: "140px" }}>
              <div style={{ marginBottom: "12px" }}>
                <CheckCircle
                  size={24}
                  color="#2ECC71"
                  style={{ margin: "0 auto" }}
                />
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#2C3E50",
                  marginBottom: "4px",
                }}
              >
                {summary.non_diabetes_count}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Tidak Diabetes
              </div>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#F0F9FF",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#2ECC71",
                  }}
                >
                  {getPercentage(
                    summary.non_diabetes_count,
                    summary.total_predictions
                  )}
                  %
                </span>
              </div>
            </div>

            <div
              style={{
                width: "1px",
                height: "80px",
                backgroundColor: "#E8F5F5",
              }}
            />

            <div style={{ flex: 1, textAlign: "center", minWidth: "140px" }}>
              <div style={{ marginBottom: "12px" }}>
                <AlertTriangle
                  size={24}
                  color="#E74C3C"
                  style={{ margin: "0 auto" }}
                />
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#2C3E50",
                  marginBottom: "4px",
                }}
              >
                {summary.diabetes_count}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Diabetes
              </div>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#F0F9FF",
                  padding: "4px 12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#E74C3C",
                  }}
                >
                  {getPercentage(
                    summary.diabetes_count,
                    summary.total_predictions
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Stats */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "#2C3E50",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Activity size={16} color="#4ECDC4" />
            <span>Rata-rata Indikator</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                backgroundColor: "#F0F9FF",
                padding: "16px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 8px",
                }}
              >
                <Droplet size={20} color="#E74C3C" />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Glukosa
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#2C3E50",
                  marginBottom: "2px",
                }}
              >
                {summary.avg_glucose != null
                  ? summary.avg_glucose.toFixed(1)
                  : "-"}
              </div>
              <div style={{ fontSize: "10px", color: "#95A5A6" }}>mg/dL</div>
            </div>

            <div
              style={{
                backgroundColor: "#F0F9FF",
                padding: "16px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 8px",
                }}
              >
                <Heart size={20} color="#FF6B6B" />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Tekanan Darah
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#2C3E50",
                  marginBottom: "2px",
                }}
              >
                {summary.avg_blood_pressure != null
                  ? summary.avg_blood_pressure.toFixed(1)
                  : "-"}
              </div>
              <div style={{ fontSize: "10px", color: "#95A5A6" }}>mmHg</div>
            </div>

            <div
              style={{
                backgroundColor: "#F0F9FF",
                padding: "16px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 8px",
                }}
              >
                <TrendingUp size={20} color="#3498DB" />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Probabilitas
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#2C3E50",
                  marginBottom: "2px",
                }}
              >
                {summary.avg_probability != null
                  ? summary.avg_probability.toFixed(1)
                  : "-"}
              </div>
              <div style={{ fontSize: "10px", color: "#95A5A6" }}>%</div>
            </div>

            <div
              style={{
                backgroundColor: "#F0F9FF",
                padding: "16px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 8px",
                }}
              >
                <Activity size={20} color="#9B59B6" />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Status
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "800",
                  color: summary.avg_probability > 50 ? "#E74C3C" : "#2ECC71",
                  marginBottom: "2px",
                }}
              >
                {summary.avg_probability > 50 ? "Risiko" : "Aman"}
              </div>
              <div style={{ fontSize: "10px", color: "#95A5A6" }}>
                Rata-rata
              </div>
            </div>
          </div>
        </div>

        {/* Latest Prediction */}
        {summary.latest && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "16px",
                  backgroundColor: "#E8F5F5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Clock size={20} color="#4ECDC4" />
              </div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "#2C3E50",
                }}
              >
                Prediksi Terakhir
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 0",
                }}
              >
                <Calendar size={16} color="#7F8C8D" />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#7F8C8D",
                    fontWeight: "600",
                  }}
                >
                  {formatDate(summary.latest.createdAt)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "14px",
                  backgroundColor:
                    summary.latest.prediction === 1 ? "#E74C3C" : "#2ECC71",
                }}
              >
                {summary.latest.prediction === 1 ? (
                  <AlertTriangle size={24} color="#FFFFFF" />
                ) : (
                  <CheckCircle size={24} color="#FFFFFF" />
                )}
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#FFFFFF",
                      marginBottom: "4px",
                    }}
                  >
                    {summary.latest.prediction === 1
                      ? "Diabetes"
                      : "Tidak Diabetes"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#FFFFFF",
                      opacity: 0.9,
                    }}
                  >
                    Probabilitas: {summary.latest.probability}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Recommendation */}
        <div
          style={{
            backgroundColor: "#E8F5F5",
            padding: "20px",
            borderRadius: "20px",
            borderLeft: "4px solid #3498DB",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <Stethoscope size={22} color="#3498DB" />
            <span
              style={{ fontSize: "16px", fontWeight: "800", color: "#2C3E50" }}
            >
              Rekomendasi
            </span>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#2C3E50",
              fontWeight: "600",
              lineHeight: "20px",
            }}
          >
            {summary.avg_probability > 50
              ? "⚠️ Probabilitas risiko tinggi. Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut."
              : "✅ Probabilitas risiko rendah. Tetap jaga pola hidup sehat dan lakukan pemeriksaan rutin."}
          </div>
        </div>

        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}
