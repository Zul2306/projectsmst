# backend/routes/authRoute.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from argon2 import PasswordHasher, exceptions as argon2_exceptions
from fastapi.security import APIKeyHeader
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import jwt

from ..config.db import SessionLocal
from ..models.user import User as UserModel
from ..schemas.userSchema import UserCreate, UserLogin, UserOut, Token

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

ph = PasswordHasher()

JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))

# --- API Key in header (will show a single "value" input in Swagger Authorize)
api_key_header = APIKeyHeader(name="Authorization", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = ph.hash(user_in.password)
    new_user = UserModel(
        name=user_in.name,
        email=user_in.email,
        password=hashed,
        createdAt=datetime.utcnow(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    try:
        ph.verify(user.password, payload.password)
    except argon2_exceptions.VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception:
        raise HTTPException(status_code=500, detail="Password verification error")

    try:
        if ph.check_needs_rehash(user.password):
            user.password = ph.hash(payload.password)
            user.updatedAt = datetime.utcnow()
            db.add(user)
            db.commit()
    except Exception:
        pass

    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}


# --- Dependency to get current user from token in Authorization header ---
def get_current_user(
    authorization: str = Depends(api_key_header),
    db: Session = Depends(get_db),
) -> UserModel:
    # authorization may be:
    # - "Bearer <token>"
    # - "<token>" (user pastes token only in Swagger)
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.strip()
    if token.lower().startswith("bearer "):
        token = token.split(" ", 1)[1].strip()

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user = db.get(UserModel, int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@router.get("/me", response_model=UserOut)
def read_me(current_user: UserModel = Depends(get_current_user)):
    return current_user
