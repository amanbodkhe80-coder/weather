from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from typing import List

from .database import engine, get_db, Base
from . import models, schemas
from .scheduler import start_scheduler

logging.basicConfig(level=logging.INFO)

# Create tables if not exists
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather Ingestion Microservice")

@app.on_event("startup")
def on_startup():
    start_scheduler()

@app.get("/weather/latest", response_model=schemas.WeatherDataSchema)
def get_latest_weather(city: str, db: Session = Depends(get_db)):
    """Fetches the latest weather reading for a given city from the DB"""
    data = db.query(models.WeatherData).filter(models.WeatherData.city.ilike(f"%{city}%")).order_by(models.WeatherData.timestamp.desc()).first()
    if not data:
        raise HTTPException(status_code=404, detail="No data found for this city")
    return data

@app.get("/weather/history", response_model=List[schemas.WeatherDataSchema])
def get_weather_history(city: str, limit: int = 24, db: Session = Depends(get_db)):
    """Fetches weather history for a given city"""
    data = db.query(models.WeatherData).filter(models.WeatherData.city.ilike(f"%{city}%")).order_by(models.WeatherData.timestamp.desc()).limit(limit).all()
    return data
