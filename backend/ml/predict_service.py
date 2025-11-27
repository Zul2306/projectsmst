import os
import pickle
import numpy as np

# Path model dinamis, selalu benar meskipun dijalankan dari folder manapun
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

def predict_diabetes(data):
    # ubah data ke format array
    X_new = np.array([[ 
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.BMI,
        data.DiabetesPedigreeFunction
    ]])

    # probabilitas kelas 1 (diabetes)
    prob = model.predict_proba(X_new)[0][1]

    # prediksi binary 0/1
    pred = int(model.predict(X_new)[0])

    return {
        "prediction": pred,
        "probability": round(prob * 100, 2)
    }