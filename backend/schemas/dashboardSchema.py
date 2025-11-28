from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DashboardRecentPrediction(BaseModel):
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

class DashboardUserStats(BaseModel):
    total_predictions: int
    diabetes_count: int
    non_diabetes_count: int
    avg_probability: Optional[float] = None
    last_prediction: Optional[DashboardRecentPrediction] = None

class ChartDataPoint(BaseModel):
    date: str
    value: Optional[float] = None

class DashboardOut(BaseModel):
    user: DashboardUserStats
    recent_user_predictions: List[DashboardRecentPrediction] = []
    chart_data: List[ChartDataPoint] = []