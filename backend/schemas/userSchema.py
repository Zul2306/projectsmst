# backend/schemas/userSchema.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal

class UserCreate(BaseModel):
    name: str = Field(..., example="John Doe")
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # pengganti orm_mode=True

    id: int
    name: str
    email: EmailStr
    # ubah menjadi float agar desimal tidak hilang
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[Decimal] = None
    createdAt: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
