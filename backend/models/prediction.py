# backend/models/prediction.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.db import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    pregnancies = Column(Float, nullable=True)
    glucose = Column(Float, nullable=True)
    blood_pressure = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    dpf = Column(Float, nullable=True)  # DiabetesPedigreeFunction
    prediction = Column(Integer, nullable=False)  # 0 or 1
    probability = Column(Float, nullable=False)   # percentage or 0..100
    createdAt = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", backref="predictions")
