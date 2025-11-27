# backend/routes/recommendRoute.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.db import SessionLocal
from models.prediction import Prediction as PredictionModel
from models.user import User as UserModel
from routes.authRoute import get_current_user
from schemas.recommendSchema import RecommendOut
from ml.recomendation_service import generate_food_recommendation  # sesuai nama file Anda

router = APIRouter(prefix="/recommend", tags=["recommend"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/food", response_model=RecommendOut)
def recommend_food_for_user(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Ambil prediksi terakhir user dan jalankan service rekomendasi makanan.
    Response:
      - status: "success"
      - prediction: last prediction (0/1)
      - probability: last probability (float)
      - recommendations: list of menu strings
      - createdAt: waktu prediksi
    """
    try:
        latest_pred = (
            db.query(PredictionModel)
            .filter(PredictionModel.user_id == current_user.id)
            .order_by(PredictionModel.createdAt.desc())
            .first()
        )

        if not latest_pred:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No prediction found for this user")

        # buat object sederhana yang cocok dengan signature generate_food_recommendation
        class DataObj:
            Glucose = latest_pred.glucose
            BloodPressure = latest_pred.blood_pressure
            BMI = latest_pred.bmi
            DiabetesPedigreeFunction = latest_pred.dpf

        recs = generate_food_recommendation(DataObj)

        return {
            "status": "success",
            "prediction": int(latest_pred.prediction) if latest_pred.prediction is not None else None,
            "probability": float(latest_pred.probability) if latest_pred.probability is not None else None,
            "recommendations": recs,
            "createdAt": latest_pred.createdAt,
        }

    except HTTPException:
        raise
    except Exception as e:
        # jangan leak exception stack, kembalikan 500 dengan pesan
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Recommendation error: {e}")