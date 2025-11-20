# backend/routes/indexRoute.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["root"])
def root():
    return {"message": "API running"}
