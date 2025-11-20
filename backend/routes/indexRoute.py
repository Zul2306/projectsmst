# backend/routes/indexRoute.py
from fastapi import APIRouter

router = APIRouter(tags=["root"])

@router.get("/", summary="Health check / root")
def root():
    return {"message": "API running"}
