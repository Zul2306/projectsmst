# backend/routes/userRoute.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime
from typing import Optional

from config.db import SessionLocal
from models.user import User as UserModel
from schemas.userSchema import UserOut, UserUpdate

# import get_current_user yang mengembalikan objek user (dari authRoute)
from .authRoute import get_current_user

router = APIRouter(prefix="/user", tags=["user"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/me", response_model=UserOut)
def read_profile(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Ambil profil user. Untuk menghindari masalah session, ambil ulang user dari session lokal.
    """
    # ambil ulang user dari session lokal (db) berdasarkan id
    user = db.get(UserModel, int(current_user.id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Update profil user (name, weight, height) — menggunakan instance yang berasal dari 'db' session.
    """
    # ambil ulang user dari session lokal (db) untuk menghindari "already attached to session"
    user: Optional[UserModel] = db.get(UserModel, int(current_user.id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    updated = False

    # Name
    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        user.name = name
        updated = True

    # Weight
    if payload.weight is not None:
        try:
            w = float(payload.weight)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid weight value")
        if w <= 0:
            raise HTTPException(status_code=400, detail="Weight must be > 0")
        user.weight = int(round(w))
        updated = True

    # Height
    if payload.height is not None:
        try:
            h = float(payload.height)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid height value")
        if h <= 0:
            raise HTTPException(status_code=400, detail="Height must be > 0")
        user.height = int(round(h))
        updated = True

    # Recalculate BMI if both present
    try:
        w_val = user.weight
        h_val = user.height
        if w_val and h_val:
            bmi_val = float(w_val) / ((float(h_val) / 100.0) ** 2)
            user.bmi = Decimal(f"{bmi_val:.2f}")
            updated = True
    except Exception:
        # jangan block update hanya karena kalkulasi gagal
        pass

    if not updated:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    user.updatedAt = datetime.utcnow()
    # tidak perlu db.add(user) karena user sudah ter-attach ke session db
    db.commit()
    db.refresh(user)

    return user