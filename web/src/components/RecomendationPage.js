import React, { useState, useEffect } from "react";
import {
  Utensils,
  AlertTriangle,
  CheckCircle,
  Info,
  CheckCheck,
  Lightbulb,
  Droplet,
  Activity,
  Moon,
  Smile,
  RefreshCw,
} from "lucide-react";

// Ganti dengan API_BASE_URL Anda
import { API_BASE_URL } from "../api/Api";

export default function RecommendationPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    setLoading(true);
    setRecommendation(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda belum login. Silakan login untuk melihat rekomendasi.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/recommend/food`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert(
          "Token Anda tidak valid atau telah kadaluarsa. Silakan login kembali."
        );
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        setRecommendation(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        alert(`Gagal memuat rekomendasi. ${txt || ""}`);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Normalize response shape
      const normalized = {
        status: data.status ?? "success",
        prediction:
          typeof data.prediction !== "undefined" ? data.prediction : null,
        probability:
          typeof data.probability !== "undefined" ? data.probability : null,
        recommendations: Array.isArray(data.recommendations)
          ? data.recommendations
          : [],
        createdAt: data.createdAt ?? data.created_at ?? null,
      };

      setRecommendation(normalized);
    } catch (err) {
      console.log("loadRecommendation error", err);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendation();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const getStatusInfo = () => {
    if (!recommendation) return null;

    const isDiabetes =
      recommendation.prediction === 1 ||
      recommendation.prediction === "Diabetes";
    return {
      title: isDiabetes ? "Risiko Diabetes Terdeteksi" : "Kondisi Sehat",
      color: isDiabetes ? "#E74C3C" : "#2ECC71",
      icon: isDiabetes ? AlertTriangle : CheckCircle,
      message: isDiabetes
        ? "Berikut rekomendasi makanan untuk membantu mengontrol gula darah Anda"
        : "Berikut rekomendasi makanan untuk menjaga kesehatan Anda",
    };
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
          Memuat rekomendasi...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!recommendation || recommendation.recommendations.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 72px)",
          backgroundColor: "#F0F9FF",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Utensils size={64} color="#B8B8B8" />
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#2C3E50",
            marginBottom: "8px",
          }}
        >
          Belum Ada Rekomendasi
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#7F8C8D",
            textAlign: "center",
            marginBottom: "24px",
            lineHeight: "20px",
            maxWidth: "400px",
          }}
        >
          Lakukan prediksi terlebih dahulu untuk mendapatkan rekomendasi makanan
        </div>
        <button
          onClick={loadRecommendation}
          style={{
            backgroundColor: "#4ECDC4",
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "12px",
            border: "none",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#45b8ad";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4ECDC4";
          }}
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div
      style={{
        backgroundColor: "#F0F9FF",
        padding: "16px",
        minHeight: "100%",
      }}
    >
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
            <Utensils size={32} color="#FFFFFF" />
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#2C3E50",
              marginBottom: "8px",
            }}
          >
            Rekomendasi Makanan
          </div>
          <div style={{ fontSize: "14px", color: "#7F8C8D" }}>
            Berdasarkan hasil prediksi terakhir Anda
          </div>
        </div>

        {/* Status Card */}
        <div
          style={{
            backgroundColor: `${statusInfo.color}15`,
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
            borderLeft: `4px solid ${statusInfo.color}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "28px",
                backgroundColor: statusInfo.color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <StatusIcon size={28} color="#FFFFFF" />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: statusInfo.color,
                  marginBottom: "4px",
                }}
              >
                {statusInfo.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#2C3E50",
                  fontWeight: "600",
                  lineHeight: "18px",
                }}
              >
                {statusInfo.message}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, textAlign: "center", minWidth: "120px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Probabilitas
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: statusInfo.color,
                }}
              >
                {recommendation.probability !== null
                  ? `${recommendation.probability}%`
                  : "-"}
              </div>
            </div>
            <div
              style={{
                width: "1px",
                backgroundColor: "#E8F5F5",
              }}
            />
            <div style={{ flex: 1, textAlign: "center", minWidth: "120px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#7F8C8D",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Tanggal
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#2C3E50",
                }}
              >
                {formatDate(recommendation.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            backgroundColor: "#E8F5F5",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            borderLeft: "4px solid #3498DB",
          }}
        >
          <Info
            size={20}
            color="#3498DB"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <div
            style={{
              flex: 1,
              fontSize: "12px",
              color: "#2C3E50",
              fontWeight: "600",
              lineHeight: "18px",
            }}
          >
            Rekomendasi ini dibuat oleh AI berdasarkan kondisi kesehatan Anda.
            Konsultasikan dengan ahli gizi untuk panduan lebih detail.
          </div>
        </div>

        {/* Recommendations List */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <CheckCheck size={20} color="#4ECDC4" />
            <span
              style={{ fontSize: "16px", fontWeight: "800", color: "#2C3E50" }}
            >
              Menu yang Direkomendasikan
            </span>
          </div>

          {recommendation.recommendations.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
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
                  marginRight: "12px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#4ECDC4",
                  }}
                >
                  {index + 1}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#2C3E50",
                    fontWeight: "600",
                    lineHeight: "20px",
                  }}
                >
                  {item}
                </span>
              </div>
              <CheckCircle
                size={24}
                color="#2ECC71"
                style={{ marginLeft: "12px", flexShrink: 0 }}
              />
            </div>
          ))}
        </div>

        {/* Tips Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <Lightbulb size={22} color="#F39C12" />
            <span
              style={{ fontSize: "16px", fontWeight: "800", color: "#2C3E50" }}
            >
              Tips Penting
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#F0F9FF",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <Droplet size={16} color="#4ECDC4" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: "#2C3E50",
                  fontWeight: "600",
                  lineHeight: "18px",
                }}
              >
                Minum air putih minimal 8 gelas per hari
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#F0F9FF",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <Activity size={16} color="#2ECC71" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: "#2C3E50",
                  fontWeight: "600",
                  lineHeight: "18px",
                }}
              >
                Olahraga ringan 30 menit setiap hari
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#F0F9FF",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <Moon size={16} color="#9B59B6" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: "#2C3E50",
                  fontWeight: "600",
                  lineHeight: "18px",
                }}
              >
                Tidur yang cukup 7-8 jam per malam
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#F0F9FF",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <Smile size={16} color="#FF6B6B" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: "#2C3E50",
                  fontWeight: "600",
                  lineHeight: "18px",
                }}
              >
                Kelola stress dengan baik
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              padding: "16px",
              borderRadius: "14px",
              border: "2px solid #4ECDC4",
              fontSize: "15px",
              fontWeight: "800",
              color: "#4ECDC4",
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.6 : 1,
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.backgroundColor = "#E8F5F5";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
          >
            <RefreshCw
              size={20}
              style={{
                animation: refreshing ? "spin 1s linear infinite" : "none",
              }}
            />
            <span>
              {refreshing ? "Memperbarui..." : "Perbarui Rekomendasi"}
            </span>
          </button>
        </div>

        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}
