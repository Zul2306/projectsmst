import React, { useState } from "react";
import { Activity, Heart, Droplet, Scale, TrendingUp } from "lucide-react";
import { apiRequest } from "../api/Api";
import "./DiabetesPredictor.css";

const DiabetesPredictor = () => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    for (let key in formData) {
      if (formData[key] === "") {
        setError("Semua field harus diisi!");
        setLoading(false);
        return;
      }
    }

    try {
      // Sesuai alias FastAPI (PENTING)
      const payload = {
        pregnancies: parseFloat(formData.Pregnancies),
        glucose: parseFloat(formData.Glucose),
        bloodPressure: parseFloat(formData.BloodPressure),
        bmi: parseFloat(formData.BMI),
        dpf: parseFloat(formData.DiabetesPedigreeFunction),
      };

      // Kirim ke backend
      const data = await apiRequest("/predict", "POST", payload);

      // Convert hasil DB → tampilan UI
      setResult({
        hasil_prediksi: data.prediction === 1 ? "Diabetes" : "Tidak Diabetes",
        "probabilitas (%)": data.probability,
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      Pregnancies: "",
      Glucose: "",
      BloodPressure: "",
      BMI: "",
      DiabetesPedigreeFunction: "",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="diabetes-container">
      <div className="diabetes-wrapper">
        {/* Header */}
        <div className="diabetes-header">
          <div className="header-icon">
            <Activity size={40} />
          </div>
          <h1 className="header-title">Prediksi Diabetes</h1>
          <p className="header-subtitle">
            Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko
            diabetes
          </p>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="diabetes-main-content">
          {/* Form - Left Column */}
          <div className="diabetes-card">
            <div className="form-group">
              <label className="form-label">
                <Heart size={16} className="label-icon" />
                Jumlah Kehamilan
              </label>
              <input
                type="number"
                name="Pregnancies"
                value={formData.Pregnancies}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Droplet size={16} className="label-icon" />
                Glukosa (mg/dL)
              </label>
              <input
                type="number"
                name="Glucose"
                value={formData.Glucose}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 120"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <TrendingUp size={16} className="label-icon" />
                Tekanan Darah (mm Hg)
              </label>
              <input
                type="number"
                name="BloodPressure"
                value={formData.BloodPressure}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 80"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Scale size={16} className="label-icon" />
                BMI
              </label>
              <input
                type="number"
                name="BMI"
                value={formData.BMI}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 25.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Activity size={16} className="label-icon" />
                Diabetes Pedigree Function
              </label>
              <input
                type="number"
                name="DiabetesPedigreeFunction"
                value={formData.DiabetesPedigreeFunction}
                onChange={handleChange}
                className="form-input"
                placeholder="Contoh: 0.5"
              />
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="button-group">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Memproses..." : "Prediksi"}
              </button>
              <button onClick={handleReset} className="btn-secondary">
                Reset
              </button>
            </div>
          </div>

          {/* Result - Right Column */}
          {result ? (
            <div
              className={`result-card ${
                result.hasil_prediksi === "Diabetes"
                  ? "result-diabetes"
                  : "result-normal"
              }`}
            >
              <h2 className="result-title">Hasil Prediksi</h2>

              <div className="result-badge">
                <p className="result-text">{result.hasil_prediksi}</p>
              </div>

              <div className="probability-section">
                <p className="probability-label">Probabilitas:</p>
                <div className="probability-box">
                  <p className="probability-value">
                    {result["probabilitas (%)"]}%
                  </p>
                </div>
              </div>

              <div className="note-box">
                <h3 className="note-title">Catatan:</h3>
                <ul className="note-list">
                  <li>Hasil ini adalah prediksi AI</li>
                  <li>Periksa ke dokter untuk diagnosis pasti</li>
                  <li>Jaga pola hidup sehat</li>
                </ul>
              </div>
            </div>
          ) : (
            <div
              className="result-card result-normal"
              style={{
                background: "linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%)",
                border: "2px dashed #667eea",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  color: "#667eea",
                }}
              >
                <Activity
                  size={64}
                  style={{ marginBottom: "20px", opacity: 0.5 }}
                />
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "10px",
                    color: "#667eea",
                  }}
                >
                  Menunggu Prediksi
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    textAlign: "center",
                    maxWidth: "280px",
                  }}
                >
                  Isi formulir di sebelah kiri dan klik tombol "Prediksi" untuk
                  melihat hasil
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiabetesPredictor;
