# backend/schemas/predictSchema.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PredictInput(BaseModel):
    # field names match what ml.predict_service expects (capitalized),
    # alias = what mobile will send (lowercase / camelCase)
    Pregnancies: float = Field(..., alias="pregnancies")
    Glucose: float = Field(..., alias="glucose")
    BloodPressure: float = Field(..., alias="bloodPressure")
    BMI: float = Field(..., alias="bmi")
    DiabetesPedigreeFunction: float = Field(..., alias="dpf")

    class Config:
        # allow using aliases when parsing input JSON
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "pregnancies": 2,
                "glucose": 150,
                "bloodPressure": 90,
                "bmi": 35.0,
                "dpf": 0.3,
            }
        }

class PredictOut(BaseModel):
    id: int
    user_id: int
    pregnancies: Optional[float] = None
    glucose: Optional[float] = None
    blood_pressure: Optional[float] = None
    bmi: Optional[float] = None
    dpf: Optional[float] = None
    prediction: int
    probability: float
    createdAt: datetime

    class Config:
        from_attributes = True
