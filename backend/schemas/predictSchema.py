
from pydantic import BaseModel

class PredictInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    BMI: float
    DiabetesPedigreeFunction: float
