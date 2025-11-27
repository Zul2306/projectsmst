# backend/schemas/recommendSchema.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RecommendOut(BaseModel):
    status: str
    prediction: Optional[int] = None
    probability: Optional[float] = None
    recommendations: List[str] = []
    createdAt: Optional[datetime] = None

    class Config:
        orm_mode = True