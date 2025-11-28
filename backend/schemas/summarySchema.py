# backend/schemas/summarySchema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SummaryLatest(BaseModel):
    id: int
    prediction: int
    probability: float
    createdAt: datetime

    class Config:
        orm_mode = True

class SummaryOut(BaseModel):
    total_predictions: int
    diabetes_count: int
    non_diabetes_count: int
    avg_probability: Optional[float] = None
    avg_glucose: Optional[float] = None
    avg_blood_pressure: Optional[float] = None
    latest: Optional[SummaryLatest] = None
