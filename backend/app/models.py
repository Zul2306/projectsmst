# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL, func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # simpan hashed password
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    bmi = Column(DECIMAL(5,2), nullable=True)
    resetPasswordToken = Column(Text, nullable=True)
    resetTokenExpires = Column(DateTime, nullable=True)
    tokenLogin = Column(Text, nullable=True)
    tokenLoginExpires = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime, onupdate=func.now(), nullable=True)
    deletedAt = Column(DateTime, nullable=True)
