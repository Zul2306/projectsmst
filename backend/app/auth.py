# app/auth.py
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import crud, schemas
from .database import get_db
from ..schemas import PasswordResetRequest, PasswordResetConfirm

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY tidak ditemukan di .env")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, name: str, password: str):
    user = crud.get_user_by_name(db, name)
    if not user:
        return False
    if not crud.verify_password(password, user.password):
        return False
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        name: str = payload.get("sub")
        if name is None:
            raise credentials_exception
        token_data = schemas.TokenData(name=name)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_name(db, name=token_data.name)
    if user is None:
        raise credentials_exception
    return user

@router.post("/forgot-password", status_code=200)
def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Request reset password. Untuk dev, endpoint ini akan mengembalikan token plain.
    Production: kirim token via email dan jangan return token di response.
    """
    # buat token jika user ada; jika tidak, jangan beri info detail (timing attack beyond scope)
    token = crud.create_password_reset_token(db, request.email)
    # Untuk development/testing: kembalikan token agar bisa dipakai di curl / Swagger.
    # Untuk production: HENTIKAN return token, kirim via email instead.
    if token:
        return {"msg": "Reset token created. (In production, token would be emailed.)", "reset_token": token}
    # Tidak mengungkapkan apakah email ada atau tidak
    return {"msg": "If the email exists, a reset token has been sent (check email)."}


@router.post("/reset-password", status_code=200)
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Reset password menggunakan token yang dikirimkan ke user.
    Body: { "token": "...", "new_password": "..." }
    """
    user = crud.verify_password_reset_token(db, data.token)
    if not user:
        raise HTTPException(status_code=400, detail="Token invalid or expired")

    # set password baru
    crud.reset_password(db, user, data.new_password)
    return {"msg": "Password has been reset successfully"}
