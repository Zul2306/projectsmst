# app/utils.py
from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """Hash password using SHA256 first (for bcrypt's 72-byte limit), then bcrypt"""
    # Truncate to 72 bytes to avoid bcrypt limitations
    truncated_password = password[:72]
    return pwd_context.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str):
    """Verify password by truncating to 72 bytes first"""
    truncated_password = plain_password[:72]
    return pwd_context.verify(truncated_password, hashed_password)
