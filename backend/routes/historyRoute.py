# backend/routes/historyRoute.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from config.db import SessionLocal
from models.prediction import Prediction as PredictionModel
from models.user import User as UserModel
from routes.authRoute import get_current_user
from schemas.historySchema import HistoryItem

router = APIRouter(prefix="/history", tags=["history"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[HistoryItem])
def list_history(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    history = (
        db.query(PredictionModel)
        .filter(PredictionModel.user_id == current_user.id)
        .order_by(PredictionModel.createdAt.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return history

@router.get("/{prediction_id}", response_model=HistoryItem)
def get_history_item(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    item = db.get(PredictionModel, prediction_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="History item not found")
    return item
