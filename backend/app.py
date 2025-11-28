# backend/app.py
from fastapi import FastAPI
from config.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from routes import authRoute, indexRoute, userRoute, predictRoute, recommendRoute, summaryRoute, dashboardRoute
# from routes import historyRoute
import models.user as user_model
import models.prediction as pred_model

# Create tables if not exist (be careful in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diabetes Auth API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "http://10.10.180.186:3000"],  # Ganti dengan domain frontend untuk production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(indexRoute.router)
app.include_router(authRoute.router)
app.include_router(userRoute.router)
app.include_router(predictRoute.router)
app.include_router(recommendRoute.router)
app.include_router(summaryRoute.router)
# app.include_router(historyRoute.router)
app.include_router(dashboardRoute.router)