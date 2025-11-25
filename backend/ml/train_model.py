
import os
import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

def train_model():
    try:
        # 1. Load dataset
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'diabetes.csv')
        data_path = os.path.abspath(data_path)
        df = pd.read_csv(data_path)

        # 2. Pilih fitur yang digunakan
        X = df[['Pregnancies', 'Glucose', 'BloodPressure', 'BMI', 'DiabetesPedigreeFunction']]
        y = df['Outcome']

        # 3. Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

        # 4. Train model
        model = LogisticRegression()
        model.fit(X_train, y_train)

        # 5. Simpan model ke folder yang sama dengan script ini
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        with open(model_path, "wb") as file:
            pickle.dump(model, file)

        print(f"Model berhasil dilatih dan disimpan ke {model_path}")
    except Exception as e:
        print(f"Terjadi error: {e}")

if __name__ == "__main__":
    train_model()
