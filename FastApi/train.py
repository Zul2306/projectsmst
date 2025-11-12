# train.py (Kode Lengkap)

import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, recall_score, precision_score

# --- 1. MUAT DAN PROSES DATA (Definisi X dan y) ---
# Asumsi file data berada di root proyek (E:\project-besar) atau di lokasi yang dapat diakses
try:
    # Menggunakan path relatif dari E:\project-besar\backend\train.py ke file CSV di root atau level yang sama
    # Jika CSV ada di E:\project-besar\, gunakan '../diabetes_prediction_dataset.csv'
    # Jika CSV ada di E:\project-besar\backend\, gunakan './diabetes_prediction_dataset.csv'
    # Kita asumsikan file CSV berada di E:\project-besar\
    data = pd.read_csv('diabetes_prediction_dataset.csv')
except FileNotFoundError:
    # Jika file tidak ditemukan di atas, cari di direktori yang sama
    data = pd.read_csv('diabetes_prediction_dataset.csv')


# One-Hot Encoding untuk kolom kategorikal
data = pd.get_dummies(data, columns=['gender', 'smoking_history'], drop_first=True)

# Definisikan Fitur dan Target
fitur = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 
         'blood_glucose_level', 'gender_Male', 'gender_Other', 
         'smoking_history_current', 'smoking_history_ever', 
         'smoking_history_former', 'smoking_history_never', 
         'smoking_history_not current']
target = 'diabetes' 

X = data[fitur]
y = data[target]

# --- 2. SCALING DATA (StandardScaler) ---
scaler = StandardScaler()
kolom_numerik = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level']
X[kolom_numerik] = scaler.fit_transform(X[kolom_numerik])

# --- 3. MEMBAGI DATA (Split) ---
# Di sinilah X_train dan y_train DIDEFINISIKAN!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# --- 4. PELATIHAN MODEL REGRESI LOGISTIK ---
model_lr = LogisticRegression(solver='liblinear', random_state=42)
model_lr.fit(X_train, y_train) # Sekarang X_train dan y_train sudah didefinisikan!

print("Model Regresi Logistik berhasil dilatih.")

# --- 5. EVALUASI MODEL (Opsional, tapi penting) ---
y_pred = model_lr.predict(X_test)
print(f"Akurasi: {accuracy_score(y_test, y_pred):.4f}")
print(f"Recall: {recall_score(y_test, y_pred):.4f}")
print(f"Presisi: {precision_score(y_test, y_pred):.4f}")


# --- 6. MENYIMPAN MODEL DAN SCALER ---
os.makedirs('model', exist_ok=True) 

joblib.dump(model_lr, 'model/logistic_regression_model.pkl')
joblib.dump(scaler, 'model/standard_scaler.pkl')

print("\nModel dan Scaler telah disimpan di folder 'model/' dan siap untuk deployment FastAPI.")