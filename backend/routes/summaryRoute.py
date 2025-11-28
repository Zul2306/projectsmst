# backend/routes/summaryRoute.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from config.db import SessionLocal
from models.prediction import Prediction as PredictionModel
from models.user import User as UserModel
from routes.authRoute import get_current_user
from schemas.summarySchema import SummaryOut, SummaryLatest

router = APIRouter(prefix="/summary", tags=["summary"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=SummaryOut)
def get_summary(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    uid = current_user.id

    total = db.query(func.count(PredictionModel.id)).filter_by(user_id=uid).scalar() or 0
    diabetes = db.query(func.count(PredictionModel.id)).filter_by(user_id=uid, prediction=1).scalar() or 0
    non_diabetes = db.query(func.count(PredictionModel.id)).filter_by(user_id=uid, prediction=0).scalar() or 0

    avg_prob = db.query(func.avg(PredictionModel.probability)).filter_by(user_id=uid).scalar()
    avg_glucose = db.query(func.avg(PredictionModel.glucose)).filter_by(user_id=uid).scalar()
    avg_bp = db.query(func.avg(PredictionModel.blood_pressure)).filter_by(user_id=uid).scalar()

    latest = (
        db.query(PredictionModel)
        .filter_by(user_id=uid)
        .order_by(PredictionModel.createdAt.desc())
        .first()
    )

    latest_out = None
    if latest:
        latest_out = SummaryLatest(
            id=latest.id,
            prediction=latest.prediction,
            probability=latest.probability,
            createdAt=latest.createdAt,
        )

    return SummaryOut(
        total_predictions=total,
        diabetes_count=diabetes,
        non_diabetes_count=non_diabetes,
        avg_probability=float(avg_prob) if avg_prob else None,
        avg_glucose=float(avg_glucose) if avg_glucose else None,
        avg_blood_pressure=float(avg_bp) if avg_bp else None,
        latest=latest_out
    )
