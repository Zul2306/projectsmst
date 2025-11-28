# backend/routes/authRoute.py

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from argon2 import PasswordHasher, exceptions as argon2_exceptions
from fastapi.security import APIKeyHeader
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from fastapi_mail import MessageSchema
from dotenv import load_dotenv
import os
import jwt
import random

from config.db import SessionLocal
from models.user import User as UserModel
from schemas.userSchema import UserCreate, UserLogin, UserOut, Token
from schemas.authSchema import ForgotPasswordSchema, VerifyOTPSchema, ResetPasswordSchema

from config.mail import fm

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

ph = PasswordHasher()

JWT_SECRET = os.getenv("JWT_SECRET", "secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# REGISTER
# ==============================
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # normalize email to lowercase
    email_norm = user_in.email.lower().strip()

    existing = db.query(UserModel).filter(UserModel.email == email_norm).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = ph.hash(user_in.password)
    new_user = UserModel(
        name=user_in.name,
        email=email_norm,
        password=hashed,
        createdAt=datetime.now(tz=ZoneInfo("Asia/Jakarta")),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# ==============================
# LOGIN
# ==============================
@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    # normalize email
    email_norm = payload.email.lower().strip()

    user = db.query(UserModel).filter(UserModel.email == email_norm).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    try:
        ph.verify(user.password, payload.password)
    except argon2_exceptions.VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # buat token dengan exp (UTC)
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": expire
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}


# ==============================
# AUTH MIDDLEWARE
# ==============================
def get_current_user(
    authorization: str = Depends(api_key_header),
    db: Session = Depends(get_db),
) -> UserModel:

    if not authorization:
        raise HTTPException(401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "").strip()

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(401, detail="Invalid token")

    user = db.get(UserModel, int(user_id))
    if not user:
        raise HTTPException(401, detail="User not found")

    return user


@router.get("/me", response_model=UserOut)
def read_me(current_user: UserModel = Depends(get_current_user)):
    return current_user


# ==============================
# SEND OTP RESET PASSWORD
# ==============================
@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(404, detail="Email not registered")

    otp = f"{random.randint(100000, 999999)}"

    now_jakarta = datetime.now(tz=ZoneInfo("Asia/Jakarta"))
    user.resetPasswordToken = otp
    user.resetTokenExpires = now_jakarta + timedelta(minutes=10)
    db.commit()

    message = MessageSchema(
        subject="Kode Reset Password",
        recipients=[email],
        body=f"Kode OTP reset password Anda adalah: {otp}",
        subtype="plain",
    )

    await fm.send_message(message)

    return {"message": "OTP sent"}


# ==============================
# VERIFY OTP
# ==============================
@router.post("/verify-reset-otp")
def verify_reset_otp(payload: VerifyOTPSchema, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    otp = payload.otp

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(404, detail="User not found")

    if user.resetPasswordToken != otp:
        raise HTTPException(400, detail="Invalid OTP")

    # Waktu sekarang (Jakarta)
    now_jakarta = datetime.now(tz=ZoneInfo("Asia/Jakarta"))

    # Ambil waktu expired dari database
    expires_raw = user.resetTokenExpires

    if not expires_raw:
        raise HTTPException(400, detail="OTP expired")

    # Jika datetime dari DB tidak punya timezone → buatkan timezone Jakarta
    if expires_raw.tzinfo is None:
        expires = expires_raw.replace(tzinfo=ZoneInfo("Asia/Jakarta"))
    else:
        expires = expires_raw

    # Sekarang aman membandingkan
    if expires < now_jakarta:
        raise HTTPException(400, detail="OTP expired")

    return {"message": "OTP valid"}


# ==============================
# RESET PASSWORD
# ==============================
@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    password = payload.password

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = ph.hash(password)
    user.resetPasswordToken = None
    user.resetTokenExpires = None
    user.updatedAt = datetime.now(tz=ZoneInfo("Asia/Jakarta"))

    db.commit()

    return {"message": "Password updated successfully"}
