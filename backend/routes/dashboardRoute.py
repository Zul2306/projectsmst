from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from config.db import SessionLocal
from models.prediction import Prediction as PredictionModel
from models.user import User as UserModel
from routes.authRoute import get_current_user
from schemas.dashboardSchema import (
    DashboardOut,
    DashboardUserStats,
    DashboardRecentPrediction,
    ChartDataPoint,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=DashboardOut)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    chart_param: str = Query("glucose", description="Parameter untuk grafik: pregnancies, glucose, blood_pressure, bmi, dpf, prediction"),
):
    uid = int(current_user.id)

    # --- USER stats ---
    total_user_preds = (
        db.query(func.count(PredictionModel.id)).filter(PredictionModel.user_id == uid).scalar() or 0
    )
    user_diabetes = (
        db.query(func.count(PredictionModel.id))
        .filter(PredictionModel.user_id == uid, PredictionModel.prediction == 1)
        .scalar()
        or 0
    )
    user_non = total_user_preds - user_diabetes

    avg_prob_user = db.query(func.avg(PredictionModel.probability)).filter(PredictionModel.user_id == uid).scalar()
    
    # last prediction (user)
    last_pred = (
        db.query(PredictionModel)
        .filter(PredictionModel.user_id == uid)
        .order_by(PredictionModel.createdAt.desc())
        .first()
    )

    last_pred_out = None
    if last_pred:
        last_pred_out = DashboardRecentPrediction(
            id=last_pred.id,
            user_id=last_pred.user_id,
            pregnancies=last_pred.pregnancies,
            glucose=last_pred.glucose,
            blood_pressure=last_pred.blood_pressure,
            bmi=last_pred.bmi,
            dpf=last_pred.dpf,
            prediction=last_pred.prediction,
            probability=last_pred.probability,
            createdAt=last_pred.createdAt,
        )

    user_stats = DashboardUserStats(
        total_predictions=int(total_user_preds),
        diabetes_count=int(user_diabetes),
        non_diabetes_count=int(user_non),
        avg_probability=float(avg_prob_user) if avg_prob_user is not None else None,
        last_prediction=last_pred_out,
    )

    # --- Recent predictions: user-specific (limit 5) ---
    recent_user_preds_query = (
        db.query(PredictionModel)
        .filter(PredictionModel.user_id == uid)
        .order_by(PredictionModel.createdAt.desc())
        .limit(5)
        .all()
    )

    recent_user_preds = [
        DashboardRecentPrediction(
            id=p.id,
            user_id=p.user_id,
            pregnancies=p.pregnancies,
            glucose=p.glucose,
            blood_pressure=p.blood_pressure,
            bmi=p.bmi,
            dpf=p.dpf,
            prediction=p.prediction,
            probability=p.probability,
            createdAt=p.createdAt,
        )
        for p in recent_user_preds_query
    ]

    # --- Chart data berdasarkan parameter yang dipilih (limit 5) ---
    chart_preds = (
        db.query(PredictionModel)
        .filter(PredictionModel.user_id == uid)
        .order_by(PredictionModel.createdAt.desc())
        .limit(5)
        .all()
    )

    # Reverse agar urutan dari lama ke baru untuk grafik
    chart_preds = list(reversed(chart_preds))

    chart_data = []
    for pred in chart_preds:
        date_str = pred.createdAt.strftime('%d/%m')
        
        # Pilih parameter sesuai filter
        value = None
        if chart_param == "pregnancies":
            value = pred.pregnancies
        elif chart_param == "glucose":
            value = pred.glucose
        elif chart_param == "blood_pressure":
            value = pred.blood_pressure
        elif chart_param == "bmi":
            value = pred.bmi
        elif chart_param == "dpf":
            value = pred.dpf
        elif chart_param == "prediction":
            # Gunakan probability (persentase) bukan prediction (0/1)
            value = float(pred.probability)
        
        chart_data.append(ChartDataPoint(date=date_str, value=value))

    return DashboardOut(
        user=user_stats,
        recent_user_predictions=recent_user_preds,
        chart_data=chart_data,
    )