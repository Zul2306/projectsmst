# schemas/input.py
from pydantic import BaseModel

class PasienInput(BaseModel):
    # Nama harus sesuai dengan yang digunakan di frontend (React)
    age: float
    hypertension: int
    heart_disease: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: int
    gender: str
    smoking_history: str