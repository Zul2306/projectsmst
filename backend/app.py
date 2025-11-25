# backend/app.py
from fastapi import FastAPI
from config.db import engine, Base
from routes import authRoute, indexRoute, userRoute, predictRoute
import models.user as user_model
import models.prediction as pred_model

# Create tables if not exist (be careful in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diabetes Auth API")

app.include_router(indexRoute.router)
app.include_router(authRoute.router)
app.include_router(userRoute.router)
app.include_router(predictRoute.router)