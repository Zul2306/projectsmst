# app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from schemas.input import PasienInput # Impor schema yang telah dibuat

app = FastAPI()

# --- Konfigurasi CORS (Penting untuk React.js) ---
# Memungkinkan frontend React.js (biasanya berjalan di port 3000) untuk mengakses API
origins = ["http://localhost:3000"] # Ganti dengan URL deployment React Anda
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Variabel Global Model ---
model_lr = None
scaler = None
FITUR_MODEL = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 
               'blood_glucose_level', 'gender_Male', 'gender_Other', 
               'smoking_history_current', 'smoking_history_ever', 
               'smoking_history_former', 'smoking_history_never', 
               'smoking_history_not current']
KOLOM_NUMERIK = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level']


# --- Lifecycle Hook: Memuat Model saat Aplikasi Dimulai ---
@app.on_event("startup")
async def load_model():
    """Memuat model dan scaler dari disk ke memori."""
    global model_lr, scaler
    try:
        model_lr = joblib.load("model/logistic_regression_model.pkl")
        scaler = joblib.load("model/standard_scaler.pkl")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memuat model: {e}")


# --- Endpoint Utama: Prediksi ---
@app.post("/predict")
def predict_diabetes(data: PasienInput):
    # 1. Konversi input ke DataFrame
    data_df = pd.DataFrame([data.dict()])
    
    # 2. Pra-pemrosesan: Encoding Kategorikal
    data_encoded = pd.get_dummies(data_df, columns=['gender', 'smoking_history'], drop_first=True)
    
    # 3. Pastikan semua fitur model ada (0 jika kategori tidak ada)
    for col in FITUR_MODEL:
        if col not in data_encoded.columns:
            data_encoded[col] = 0
            
    X_baru = data_encoded[FITUR_MODEL]
    
    # 4. Pra-pemrosesan: Scaling Numerik
    X_baru[KOLOM_NUMERIK] = scaler.transform(X_baru[KOLOM_NUMERIK])
    
    # 5. Prediksi
    probabilitas = model_lr.predict_proba(X_baru)[0][1]
    prediksi_kelas = model_lr.predict(X_baru)[0]
    
    # 6. Kembalikan Hasil
    return {
        "prediction": int(prediksi_kelas),
        "probability": float(probabilitas),
        "message": "Diabetes" if prediksi_kelas == 1 else "Non-Diabetes"
    }

# --- Endpoint Test (Opsional) ---
@app.get("/")
def home():
    return {"message": "Diabetes Prediction API is running."}