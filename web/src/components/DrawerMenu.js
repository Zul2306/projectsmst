import React from "react";
import {
  Grid,
  TrendingUp,
  Utensils,
  BarChart3,
  User,
  CheckCircle,
  ChevronRight,
  Info,
  LogOut,
  Droplet,
} from "lucide-react";

export default function DrawerMenu({
  onSelect,
  onClose,
  onLogout,
  currentScreen,
  user,
}) {
  const items = [
    {
      key: "Dashboard",
      label: "Dashboard",
      icon: Grid,
      description: "Ringkasan utama",
    },
    {
      key: "Prediction",
      label: "Prediksi",
      icon: TrendingUp,
      description: "Cek risiko diabetes",
    },
    {
      key: "Recommendation",
      label: "Rekomendasi",
      icon: Utensils,
      description: "Menu makanan sehat",
    },
    {
      key: "Summary",
      label: "Ringkasan",
      icon: BarChart3,
      description: "Statistik kesehatan",
    },
  ];

  return (
    <div
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "24px 16px",
          borderBottom: "1px solid #E8F5F5",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "30px",
            backgroundColor: "#4ECDC4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 12px",
            boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
          }}
        >
          <Droplet size={28} color="#FFFFFF" />
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#2C3E50",
            marginBottom: "4px",
          }}
        >
          Prediksi Pra-Diabetes
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#7F8C8D",
            fontWeight: "600",
          }}
        >
          Deteksi Dini dengan AI
        </div>
      </div>

      {/* Profile Card */}
      <button
        onClick={() => {
          onSelect && onSelect("Profile");
          onClose && onClose();
        }}
        style={{
          backgroundColor: "#E8F5F5",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          margin: "0 16px 24px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          transition: "transform 0.2s",
          width: "calc(100% - 32px)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "28px",
            backgroundColor: "#4ECDC4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(78, 205, 196, 0.3)",
          }}
        >
          <User size={32} color="#FFFFFF" />
        </div>

        <div
          style={{
            marginLeft: "12px",
            flex: 1,
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: "800",
              color: "#2C3E50",
              fontSize: "16px",
              marginBottom: "2px",
            }}
          >
            {user?.name || "User"}
          </div>
          <div
            style={{
              color: "#7F8C8D",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            {user?.email || "-"}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              padding: "3px 8px",
              borderRadius: "12px",
            }}
          >
            <CheckCircle size={12} color="#2ECC71" />
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#2ECC71",
              }}
            >
              Aktif
            </span>
          </div>
        </div>

        <ChevronRight size={22} color="#4ECDC4" />
      </button>

      {/* Menu Items */}
      <div style={{ padding: "0 16px", flex: 1 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#95A5A6",
            letterSpacing: "1px",
            marginBottom: "12px",
            marginLeft: "4px",
          }}
        >
          MENU UTAMA
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                onSelect && onSelect(item.key);
                onClose && onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "12px",
                borderRadius: "14px",
                marginBottom: "6px",
                position: "relative",
                border: "none",
                backgroundColor: isActive ? "#E8F5F5" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#F0F9FF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: isActive ? "#FFFFFF" : "#F0F9FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={22} color={isActive ? "#4ECDC4" : "#7F8C8D"} />
              </div>

              <div
                style={{
                  flex: 1,
                  marginLeft: "12px",
                }}
              >
                <div
                  style={{
                    color: isActive ? "#4ECDC4" : "#2C3E50",
                    fontSize: "15px",
                    fontWeight: isActive ? "800" : "600",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#95A5A6",
                  }}
                >
                  {item.description}
                </div>
              </div>

              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    right: "12px",
                    width: "4px",
                    height: "24px",
                    borderRadius: "2px",
                    backgroundColor: "#4ECDC4",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Info Section */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          backgroundColor: "#E8F5F5",
          padding: "14px",
          borderRadius: "12px",
          margin: "20px 16px 16px",
        }}
      >
        <Info
          size={18}
          color="#3498DB"
          style={{ flexShrink: 0, marginTop: "2px" }}
        />
        <div
          style={{
            flex: 1,
            fontSize: "11px",
            color: "#2C3E50",
            fontWeight: "600",
            lineHeight: "16px",
          }}
        >
          Pantau kesehatan Anda secara rutin untuk deteksi dini pra-diabetes
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: "0 16px 24px" }}>
        <button
          onClick={() => onLogout && onLogout()}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFEBEE",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid #FFCDD2",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFCDD2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFEBEE";
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "18px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "12px",
            }}
          >
            <LogOut size={20} color="#E74C3C" />
          </div>
          <span
            style={{
              color: "#E74C3C",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            Keluar dari Akun
          </span>
        </button>
      </div>
    </div>
  );
}
