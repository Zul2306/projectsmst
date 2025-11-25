# backend/schemas/authSchema.py
from pydantic import BaseModel, EmailStr

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    password: str
