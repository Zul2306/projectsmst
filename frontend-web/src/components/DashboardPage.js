import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import DiabetesPredictor from "./DiabetesPredictor";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "prediksi", icon: "📝", label: "Prediksi" },
    { id: "health", icon: "📈", label: "Health Summary" },
    { id: "education", icon: "📚", label: "Education" },
  ];

  const bloodSugarData = [
    { day: "S", value: 120 },
    { day: "M", value: 115 },
    { day: "T", value: 125 },
    { day: "W", value: 118 },
    { day: "T", value: 122 },
    { day: "F", value: 119 },
    { day: "S", value: 117 },
  ];

  const activityData = [
    { day: "S", value: 30 },
    { day: "M", value: 32 },
    { day: "T", value: 42 },
    { day: "W", value: 36 },
    { day: "T", value: 43 },
    { day: "F", value: 49 },
    { day: "S", value: 55 },
  ];

  return (
    <div className="page-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`health-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="user-profile-section">
            <div className="user-avatar-large">
              <span>👤</span>
            </div>
            <div className="user-details">
              <h3 className="user-name">Acel Rafael</h3>
              <p className="user-email">acelrafael03@gmail.com</p>
            </div>
            <button className="profile-arrow">›</button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-dashboard-content">
        {/* Header */}
        <header className="page-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="header-title">Dashboard</h1>
          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">⚙️</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Render Dashboard */}
          {activeMenu === "dashboard" && (
            <>
              <div className="dashboard-section">
                <div className="section-header">
                  <h2 className="section-title">Ringkasan Kesehatan Anda</h2>
                  <span className="section-date">26 Nov 2025</span>
                </div>

                <div className={`card-grid ${animateCards ? "animate" : ""}`}>
                  <div className="stat-card card-purple">
                    <div className="card-icon">🩸</div>
                    <div className="stat-value">130</div>
                    <div className="stat-label">Gula Darah</div>
                    <div className="stat-unit">mg/dL</div>
                    <div className="card-trend up">↑ 5%</div>
                  </div>

                  <div className="stat-card card-blue">
                    <div className="card-icon">⚖️</div>
                    <div className="stat-value">24.8</div>
                    <div className="stat-label">BMI</div>
                    <div className="stat-sublabel">Normal</div>
                    <div className="card-trend stable">→ 0%</div>
                  </div>

                  <div className="stat-card card-green">
                    <div className="card-icon">🏃</div>
                    <div className="stat-value">45</div>
                    <div className="stat-label">Aktivitas</div>
                    <div className="stat-unit">Min/hari</div>
                    <div className="card-trend up">↑ 12%</div>
                  </div>

                  <div className="stat-card card-orange">
                    <div className="card-icon">🔥</div>
                    <div className="stat-value">500</div>
                    <div className="stat-label">Kalori</div>
                    <div className="stat-unit">terbakar</div>
                    <div className="card-trend down">↓ 3%</div>
                  </div>
                </div>

                <div className="status-banner">
                  <div className="status-icon">✓</div>
                  <div className="status-content">
                    <div className="status-text">Status: Sehat</div>
                    <div className="status-subtext">
                      Pertahankan pola hidup sehat Anda!
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2 className="section-title">Health Tracking</h2>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">📊 Gula Darah</h3>
                    <div className="chart-legend">
                      <span className="legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: "#667eea" }}
                        ></span>
                        Minggu ini
                      </span>
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bloodSugarData}>
                        <defs>
                          <linearGradient
                            id="colorBlood"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#667eea"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#667eea"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#667eea"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorBlood)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">🏃 Aktivitas Fisik</h3>
                    <div className="chart-legend">
                      <span className="legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: "#f093fb" }}
                        ></span>
                        Minggu ini
                      </span>
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient
                            id="colorActivity"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#f093fb"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f5576c"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#f093fb"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorActivity)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Render Prediksi Page */}
          {activeMenu === "prediksi" && (
            <div className="predictor-container">
              <DiabetesPredictor />
            </div>
          )}

          {/* Render Health Summary Page */}
          {activeMenu === "health" && (
            <div className="dashboard-section">
              <h2 className="section-title">Health Summary</h2>
              <div className="chart-card">
                <p
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  Halaman Health Summary - Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Render Education Page */}
          {activeMenu === "education" && (
            <div className="dashboard-section">
              <h2 className="section-title">Education</h2>
              <div className="chart-card">
                <p
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  Halaman Education - Coming Soon
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
