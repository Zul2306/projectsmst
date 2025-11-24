# backend/app.py
from fastapi import FastAPI
from backend.config.db import engine, Base
from backend.routes import authRoute, indexRoute, userRoute
import backend.models.user as user_model

# Create tables if not exist (be careful in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diabetes Auth API")

app.include_router(indexRoute.router)
app.include_router(authRoute.router)
app.include_router(userRoute.router)