from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app import crud, models, schemas
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = "secretkey123"  # ganti dengan yang lebih aman nanti
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# REGISTER USER
@router.post("/register")
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = crud.create_user(db, name=user_in.name, email=user_in.email, password=user_in.password)
    return {"id": user.id, "name": user.name, "email": user.email}


# LOGIN USER
@router.post("/login")
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_in.email)
    if not user:
        raise HTTPException(status_code=401, detail="Email tidak ditemukan")

    if not pwd_context.verify(user_in.password, user.password):
        raise HTTPException(status_code=401, detail="Password salah")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {"sub": user.email, "exp": datetime.utcnow() + access_token_expires}
    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": access_token, "token_type": "bearer"}
