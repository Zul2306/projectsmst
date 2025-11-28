# backend/schemas/historySchema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HistoryItem(BaseModel):
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
        orm_mode = True
