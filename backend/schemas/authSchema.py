# backend/schemas/authSchema.py
from pydantic import BaseModel, EmailStr, validator
import re

PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
)

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    password: str

    @validator("email")
    def validate_email(cls, v):
        v = v.lower().strip()
        if not v.endswith("@gmail.com"):
            raise ValueError("Email harus @gmail.com")
        return v

    @validator("password")
    def validate_password(cls, v):
        if not PASSWORD_REGEX.match(v):
            raise ValueError("Password harus mengandung huruf besar, kecil, angka, simbol")
        return v
