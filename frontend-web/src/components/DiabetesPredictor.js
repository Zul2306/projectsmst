import React, { useState } from "react";
import { Activity, Heart, Droplet, Scale, TrendingUp } from "lucide-react";
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

    // Validasi input
    for (let key in formData) {
      if (formData[key] === "") {
        setError("Semua field harus diisi!");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        Pregnancies: parseFloat(formData.Pregnancies),
        Glucose: parseFloat(formData.Glucose),
        BloodPressure: parseFloat(formData.BloodPressure),
        BMI: parseFloat(formData.BMI),
        DiabetesPedigreeFunction: parseFloat(formData.DiabetesPedigreeFunction),
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan prediksi");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat melakukan prediksi");
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
            <Activity size={56} />
          </div>
          <h1 className="header-title">Prediksi Diabetes</h1>
          <p className="header-subtitle">
            Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko
            diabetes
          </p>
        </div>

        {/* Form Card */}
        <div className="diabetes-card">
          <div className="form-group">
            <label className="form-label">
              <Heart size={18} color="#ec4899" className="label-icon" />
              Jumlah Kehamilan
            </label>
            <input
              type="number"
              name="Pregnancies"
              value={formData.Pregnancies}
              onChange={handleChange}
              className="form-input"
              placeholder="Contoh: 2"
              step="1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Droplet size={18} color="#ef4444" className="label-icon" />
              Kadar Glukosa (mg/dL)
            </label>
            <input
              type="number"
              name="Glucose"
              value={formData.Glucose}
              onChange={handleChange}
              className="form-input"
              placeholder="Contoh: 150"
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <TrendingUp size={18} color="#3b82f6" className="label-icon" />
              Tekanan Darah (mm Hg)
            </label>
            <input
              type="number"
              name="BloodPressure"
              value={formData.BloodPressure}
              onChange={handleChange}
              className="form-input"
              placeholder="Contoh: 70"
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Scale size={18} color="#10b981" className="label-icon" />
              BMI (Body Mass Index)
            </label>
            <input
              type="number"
              name="BMI"
              value={formData.BMI}
              onChange={handleChange}
              className="form-input"
              placeholder="Contoh: 33.6"
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Activity size={18} color="#8b5cf6" className="label-icon" />
              Diabetes Pedigree Function
            </label>
            <input
              type="number"
              name="DiabetesPedigreeFunction"
              value={formData.DiabetesPedigreeFunction}
              onChange={handleChange}
              className="form-input"
              placeholder="Contoh: 0.3"
              step="0.001"
              min="0"
            />
            <p className="form-hint">
              Fungsi yang menunjukkan riwayat diabetes dalam keluarga
            </p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="button-group">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`btn-primary ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Memproses..." : "Prediksi Sekarang"}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div
            className={`result-card ${
              result.hasil_prediksi === "Diabetes"
                ? "result-diabetes"
                : "result-normal"
            }`}
          >
            <h2 className="result-title">Hasil Prediksi</h2>

            <div
              className={`result-badge ${
                result.hasil_prediksi === "Diabetes"
                  ? "badge-diabetes"
                  : "badge-normal"
              }`}
            >
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
              <h3 className="note-title">ℹ️ Catatan Penting:</h3>
              <ul className="note-list">
                <li className="note-item">
                  • Hasil ini adalah prediksi berbasis machine learning
                </li>
                <li className="note-item">
                  • Konsultasikan dengan dokter untuk diagnosis yang akurat
                </li>
                <li className="note-item">
                  • Lakukan pemeriksaan kesehatan rutin
                </li>
                <li className="note-item">
                  • Jaga pola makan dan olahraga teratur
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesPredictor;
