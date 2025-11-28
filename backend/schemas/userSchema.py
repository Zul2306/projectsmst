# backend/schemas/userSchema.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
import re

PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator("email")
    def validate_email(cls, v):
        v = v.lower().strip()
        if not v.endswith("@gmail.com"):
            raise ValueError("Email harus menggunakan @gmail.com")
        return v

    @validator("password")
    def validate_password(cls, v):
        if not PASSWORD_REGEX.match(v):
            raise ValueError(
                "Password harus mengandung huruf besar, kecil, angka, dan simbol"
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("email")
    def validate_email_login(cls, v):
        return v.lower().strip()

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
