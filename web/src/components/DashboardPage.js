import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Heart,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  Settings,
  Droplet,
  Users,
  Zap,
} from "lucide-react";

import { API_BASE_URL } from "../api/Api";
import DrawerMenu from "./DrawerMenu";
import DiabetesPredictor from "./DiabetesPredictor";
import RecommendationPage from "./RecomendationPage";
import SummaryPage from "./SummaryPage";
import ProfilePage from "./ProfilePage";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [allChartData, setAllChartData] = useState({});
  const [selectedParam, setSelectedParam] = useState("glucose");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Dashboard");

  const parameters = [
    {
      label: "Jumlah Kehamilan",
      value: "pregnancies",
      color: "#9B59B6",
      icon: Users,
    },
    {
      label: "Kadar Glukosa",
      value: "glucose",
      color: "#E74C3C",
      icon: Droplet,
    },
    {
      label: "Tekanan Darah",
      value: "blood_pressure",
      color: "#3498DB",
      icon: Heart,
    },
    { label: "BMI", value: "bmi", color: "#2ECC71", icon: Activity },
    { label: "DPF", value: "dpf", color: "#F39C12", icon: Zap },
    {
      label: "Hasil Prediksi",
      value: "prediction",
      color: "#E67E22",
      icon: BarChart3,
    },
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        setDashboard(null);
        setLoading(false);
        return;
      }

      // Load data untuk semua parameter sekaligus
      const chartDataPromises = parameters.map((param) =>
        fetch(`${API_BASE_URL}/dashboard?chart_param=${param.value}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.ok) return res.json();
            return null;
          })
          .then((data) => ({
            param: param.value,
            data: data?.chart_data || [],
          }))
          .catch(() => ({ param: param.value, data: [] }))
      );

      const chartResults = await Promise.all(chartDataPromises);
      const chartDataMap = {};
      chartResults.forEach((result) => {
        chartDataMap[result.param] = result.data;
      });
      setAllChartData(chartDataMap);

      // Load dashboard info
      const res = await fetch(
        `${API_BASE_URL}/dashboard?chart_param=${selectedParam}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Sesi berakhir. Silakan login kembali.");
        setDashboard(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.log("Dashboard load failed:", res.status, text);
        alert("Gagal memuat dashboard dari server.");
        setDashboard(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.log("Error fetching dashboard:", err);
      alert("Tidak dapat terhubung ke server.");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const handleMenuSelect = (screenKey) => {
    setCurrentScreen(screenKey);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("id-ID", options);
    } catch (e) {
      return "-";
    }
  };

  const getSelectedParamInfo = () => {
    return parameters.find((p) => p.value === selectedParam) || parameters[1];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const chartPreds = dashboard?.recent_user_predictions
        ? [...dashboard.recent_user_predictions].slice(0, 5).reverse()
        : [];

      const index = allChartData[selectedParam]?.findIndex(
        (d) => d.date === label
      );
      const pred = chartPreds[index] || null;

      return (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #EDF3F3",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #F0F0F0",
              paddingBottom: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{ fontSize: "13px", fontWeight: "800", color: "#2C3E50" }}
            >
              {pred && pred.prediction !== undefined
                ? pred.prediction === 1
                  ? "Diabetes (Prediksi)"
                  : "Tidak Diabetes (Prediksi)"
                : "Data Titik"}
            </div>
            <div
              style={{ fontSize: "10px", color: "#95A5A6", marginTop: "4px" }}
            >
              {pred && pred.createdAt ? formatDate(pred.createdAt) : label}
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#7F8C8D" }}>
                Glukosa:
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                }}
              >
                {pred && pred.glucose != null ? pred.glucose : "-"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#7F8C8D" }}>BMI:</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                }}
              >
                {pred && pred.bmi != null ? pred.bmi : "-"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#7F8C8D" }}>BP:</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                }}
              >
                {pred && pred.blood_pressure != null
                  ? pred.blood_pressure
                  : "-"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#7F8C8D" }}>Prob.:</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2C3E50",
                }}
              >
                {pred && pred.probability != null
                  ? `${pred.probability}%`
                  : payload[0]?.value || "-"}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const currentChartData = allChartData[selectedParam] || [];

    if (currentChartData.length === 0) {
      return (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <BarChart3 size={48} color="#B8B8B8" style={{ margin: "0 auto" }} />
          <div
            style={{
              fontSize: "14px",
              color: "#7F8C8D",
              fontWeight: "600",
              marginTop: "12px",
            }}
          >
            Tidak ada data untuk ditampilkan
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#95A5A6",
              fontWeight: "500",
              marginTop: "4px",
            }}
          >
            Lakukan prediksi untuk melihat grafik
          </div>
        </div>
      );
    }

    const paramInfo = getSelectedParamInfo();
    const Icon = paramInfo.icon;

    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentChartData}>
            <CartesianGrid strokeDasharray="0" stroke="#E8F5F5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#7F8C8D" }}
              stroke="#E8F5F5"
            />
            <YAxis tick={{ fontSize: 11, fill: "#7F8C8D" }} stroke="#E8F5F5" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={paramInfo.color}
              strokeWidth={3}
              dot={{
                fill: "#FFFFFF",
                stroke: paramInfo.color,
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #E8F5F5",
            gap: "8px",
            fontSize: "11px",
            color: "#7F8C8D",
          }}
        >
          <Icon size={16} color={paramInfo.color} />
          <span>Sumbu X: Tanggal Prediksi</span>
          <span style={{ color: "#B8B8B8" }}>•</span>
          <span>Sumbu Y: {paramInfo.label}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
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
          Memuat dashboard...
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
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

  const { user = {}, recent_user_predictions = [] } = dashboard;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F0F9FF",
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Drawer Menu Mobile/Desktop */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DrawerMenu
              onSelect={handleMenuSelect}
              onClose={() => setDrawerOpen(false)}
              onLogout={handleLogout}
              currentScreen={currentScreen}
              user={dashboard?.user || {}}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Hamburger Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{
              position: "fixed",
              top: "16px",
              left: "16px",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#4ECDC4",
              border: "none",
              cursor: "pointer",
              color: "#FFFFFF",
              fontSize: "20px",
              zIndex: 100,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ☰
          </button>

          {/* Conditional Screen Rendering */}
          {currentScreen === "Dashboard" && (
            <>
              {/* Welcome Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "800",
                      color: "#2C3E50",
                      marginBottom: "6px",
                    }}
                  >
                    Selamat Datang! 👋
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#7F8C8D",
                      fontWeight: "500",
                    }}
                  >
                    Pantau kesehatan Anda dengan mudah
                  </div>
                </div>
                <Heart size={56} color="#4ECDC4" />
              </div>

              {/* User Stats */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  marginTop: "8px",
                }}
              >
                <User size={20} color="#4ECDC4" />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#2C3E50",
                  }}
                >
                  Statistik Anda
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    textAlign: "center",
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
                      margin: "0 auto 12px",
                    }}
                  >
                    <FileText size={24} color="#4ECDC4" />
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#2C3E50",
                      marginBottom: "4px",
                    }}
                  >
                    {user.total_predictions ?? 0}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7F8C8D",
                      fontWeight: "600",
                    }}
                  >
                    Total Prediksi
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    textAlign: "center",
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
                      margin: "0 auto 12px",
                    }}
                  >
                    <CheckCircle size={24} color="#2ECC71" />
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#2C3E50",
                      marginBottom: "4px",
                    }}
                  >
                    {user.non_diabetes_count ?? 0}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7F8C8D",
                      fontWeight: "600",
                    }}
                  >
                    Negatif
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    textAlign: "center",
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
                      margin: "0 auto 12px",
                    }}
                  >
                    <AlertTriangle size={24} color="#E74C3C" />
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#2C3E50",
                      marginBottom: "4px",
                    }}
                  >
                    {user.diabetes_count ?? 0}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7F8C8D",
                      fontWeight: "600",
                    }}
                  >
                    Positif
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    textAlign: "center",
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
                      margin: "0 auto 12px",
                    }}
                  >
                    <TrendingUp size={24} color="#3498DB" />
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#2C3E50",
                      marginBottom: "4px",
                    }}
                  >
                    {user.avg_probability
                      ? `${Number(user.avg_probability).toFixed(1)}%`
                      : "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7F8C8D",
                      fontWeight: "600",
                    }}
                  >
                    Rata-rata
                  </div>
                </div>
              </div>

              {/* Last Prediction */}
              {user.last_prediction && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <Activity size={20} color="#4ECDC4" />
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
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "24px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "12px",
                          backgroundColor:
                            user.last_prediction.prediction === 1
                              ? "#E74C3C"
                              : "#2ECC71",
                        }}
                      >
                        {user.last_prediction.prediction === 1 ? (
                          <AlertTriangle size={20} color="#FFFFFF" />
                        ) : (
                          <CheckCircle size={20} color="#FFFFFF" />
                        )}
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        >
                          {user.last_prediction.prediction === 1
                            ? "Diabetes"
                            : "Tidak Diabetes"}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#95A5A6",
                          fontWeight: "600",
                        }}
                      >
                        {formatDate(user.last_prediction.createdAt)}
                      </span>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        padding: "16px 0",
                        borderBottom: "1px solid #E8F5F5",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#7F8C8D",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                      >
                        Probabilitas
                      </div>
                      <div
                        style={{
                          fontSize: "36px",
                          fontWeight: "800",
                          color:
                            user.last_prediction.prediction === 1
                              ? "#E74C3C"
                              : "#2ECC71",
                        }}
                      >
                        {user.last_prediction.probability}%
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: "#F0F9FF",
                          padding: "12px",
                          borderRadius: "12px",
                          textAlign: "center",
                        }}
                      >
                        <Droplet
                          size={16}
                          color="#E74C3C"
                          style={{ margin: "0 auto" }}
                        />
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7F8C8D",
                            fontWeight: "600",
                            marginTop: "6px",
                            marginBottom: "4px",
                          }}
                        >
                          Glukosa
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            color: "#2C3E50",
                            fontWeight: "800",
                          }}
                        >
                          {user.last_prediction.glucose}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: "#F0F9FF",
                          padding: "12px",
                          borderRadius: "12px",
                          textAlign: "center",
                        }}
                      >
                        <Activity
                          size={16}
                          color="#95E1D3"
                          style={{ margin: "0 auto" }}
                        />
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#7F8C8D",
                            fontWeight: "600",
                            marginTop: "6px",
                            marginBottom: "4px",
                          }}
                        >
                          BMI
                        </div>
                        <div
                          style={{
                            fontSize: "18px",
                            color: "#2C3E50",
                            fontWeight: "800",
                          }}
                        >
                          {user.last_prediction.bmi}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Parameter Filter */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  marginTop: "8px",
                }}
              >
                <Settings size={20} color="#4ECDC4" />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#2C3E50",
                  }}
                >
                  Filter Parameter Grafik
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  marginBottom: "24px",
                  paddingBottom: "8px",
                }}
              >
                {parameters.map((param) => {
                  const Icon = param.icon;
                  return (
                    <button
                      key={param.value}
                      onClick={() => setSelectedParam(param.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        borderRadius: "20px",
                        backgroundColor:
                          selectedParam === param.value
                            ? param.color
                            : "#FFFFFF",
                        border: `2px solid ${
                          selectedParam === param.value
                            ? param.color
                            : "#E8F5F5"
                        }`,
                        color:
                          selectedParam === param.value ? "#FFFFFF" : "#7F8C8D",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Icon size={16} />
                      {param.label}
                    </button>
                  );
                })}
              </div>

              {/* Chart */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  marginTop: "8px",
                }}
              >
                <BarChart3 size={20} color="#4ECDC4" />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#2C3E50",
                  }}
                >
                  Grafik {getSelectedParamInfo().label}
                </span>
              </div>

              {renderChart()}

              {/* Recent Predictions */}
              {recent_user_predictions.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      marginTop: "24px",
                    }}
                  >
                    <Clock size={20} color="#4ECDC4" />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#2C3E50",
                      }}
                    >
                      Riwayat Terbaru (5 Terakhir)
                    </span>
                  </div>

                  {recent_user_predictions.map((pred) => (
                    <div
                      key={pred.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        padding: "14px",
                        marginBottom: "8px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "12px",
                            backgroundColor:
                              pred.prediction === 1 ? "#E74C3C" : "#2ECC71",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {pred.prediction === 1 ? (
                            <AlertTriangle size={14} color="#FFFFFF" />
                          ) : (
                            <CheckCircle size={14} color="#FFFFFF" />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "800",
                            color: "#2C3E50",
                          }}
                        >
                          {pred.probability}%
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#95A5A6",
                          fontWeight: "500",
                        }}
                      >
                        {formatDate(pred.createdAt)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {currentScreen === "Prediction" && <DiabetesPredictor />}

          {currentScreen === "Recommendation" && <RecommendationPage />}

          {currentScreen === "Summary" && <SummaryPage />}

          {currentScreen === "Profile" && <ProfilePage onLogout={handleLogout} />}

          <div style={{ height: "40px" }} />
        </div>
      </div>
    </div>
  );
}
