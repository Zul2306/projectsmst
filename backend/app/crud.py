# app/crud.py
from datetime import datetime
from sqlalchemy.orm import Session
from . import models
from passlib.context import CryptContext
import secrets
import hashlib
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()
RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.name == name).first()

def get_user_by_email(db, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, name: str, email: str, password: str):
    hashed = get_password_hash(password)
    user = models.User(name=name, email=email, password=hashed, createdAt=datetime.utcnow(), updatedAt=datetime.utcnow())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def _hash_token(token: str) -> str:
    """Hash token untuk disimpan di DB (tidak menyimpan token plain)."""
    return hashlib.sha256(token.encode()).hexdigest()

def create_password_reset_token(db, email: str):
    """
    Buat token reset untuk user dengan email.
    Simpan hash(token) di kolom resetPasswordToken dan expiry di resetTokenExpires.
    Mengembalikan token plain (untuk dev/testing). Di production seharusnya token dikirim via email.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None  # caller akan tangani (jangan bocorkan apakah email ada atau tidak)
    token = secrets.token_urlsafe(32)  # token plain
    token_hash = _hash_token(token)
    expiry = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)

    user.resetPasswordToken = token_hash
    user.resetTokenExpires = expiry
    # simpan perubahan
    db.add(user)
    db.commit()
    db.refresh(user)
    return token

def verify_password_reset_token(db, token: str):
    """
    Verifikasi token plain: hash(token) cocok dengan kolom dan expiry > now.
    Mengembalikan user jika valid, otherwise None.
    """
    token_hash = _hash_token(token)
    now = datetime.utcnow()
    user = db.query(models.User)\
             .filter(models.User.resetPasswordToken == token_hash)\
             .filter(models.User.resetTokenExpires != None)\
             .filter(models.User.resetTokenExpires > now)\
             .first()
    return user

def clear_password_reset_token(db, user):
    user.resetPasswordToken = None
    user.resetTokenExpires = None
    db.add(user)
    db.commit()
    db.refresh(user)

def reset_password(db, user, new_password: str):
    """
    Set password baru (hashed) untuk user dan hapus token reset.
    """
    hashed = get_password_hash(new_password[:72])  # pastikan tidak lebih 72 bytes
    user.password = hashed
    user.updatedAt = datetime.utcnow()
    user.resetPasswordToken = None
    user.resetTokenExpires = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
