# backend/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL
from config.db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    bmi = Column(DECIMAL(5,2), nullable=True)
    resetPasswordToken = Column(Text, nullable=True)
    resetTokenExpires = Column(DateTime, nullable=True)
    tokenLogin = Column(Text, nullable=True)
    tokenLoginExpires = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = Column(DateTime, nullable=True)
    deletedAt = Column(DateTime, nullable=True)
