# from fastapi import APIRouter
# from schemas.predictSchema import PredictInput
# from ml.predict_service import predict_diabetes

# router = APIRouter()

# @router.post("/predict")
# def predict(input_data: PredictInput):
#     result = predict_diabetes(input_data)
#     return {
#         "hasil_prediksi": "Diabetes" if result["prediction"] == 1 else "Tidak Diabetes",
#         "probabilitas (%)": result["probability"]
#     }







# backend/routes/predictRoute.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.db import SessionLocal
from models.prediction import Prediction as PredictionModel
from models.user import User as UserModel
from schemas.predictSchema import PredictInput, PredictOut
from ml.predict_service import predict_diabetes
from routes.authRoute import get_current_user
from datetime import datetime

router = APIRouter(tags=["predict"], prefix="")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/predict", response_model=PredictOut, status_code=status.HTTP_201_CREATED)
def create_prediction(
    payload: PredictInput,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    # payload adalah instance PredictInput — punya attribute .Pregnancies, .Glucose, dll
    try:
        result = predict_diabetes(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    pred_obj = PredictionModel(
        user_id=int(current_user.id),
        pregnancies=float(payload.Pregnancies),
        glucose=float(payload.Glucose),
        blood_pressure=float(payload.BloodPressure),
        bmi=float(payload.BMI),
        dpf=float(payload.DiabetesPedigreeFunction),
        prediction=int(result["prediction"]),
        probability=float(result["probability"]),
        createdAt=datetime.utcnow(),
    )

    db.add(pred_obj)
    db.commit()
    db.refresh(pred_obj)
    return pred_obj

@router.get("/predict/latest", response_model=PredictOut)
def get_latest_prediction(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    pred = (
        db.query(PredictionModel)
        .filter(PredictionModel.user_id == current_user.id)
        .order_by(PredictionModel.createdAt.desc())
        .first()
    )
    if not pred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No predictions found")
    return pred
