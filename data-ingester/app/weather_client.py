import os
import requests
import logging
from sqlalchemy.orm import Session
from .models import WeatherData
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY", "your_api_key_here")
CITIES = ["London", "New York", "Tokyo", "Mumbai", "Sydney", "Paris", "Berlin"] # default cities

logger = logging.getLogger(__name__)

def fetch_weather_for_city(city: str) -> dict | None:
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch weather for {city}: {e}")
        return None

def fetch_and_store_weather(db: Session):
    logger.info("Starting background weather fetch...")
    for city in CITIES:
        data = fetch_weather_for_city(city)
        if data:
            temp = data.get("main", {}).get("temp")
            humidity = data.get("main", {}).get("humidity")
            
            if temp is not None and humidity is not None:
                weather_entry = WeatherData(
                    city=city,
                    temperature=temp,
                    humidity=humidity,
                    timestamp=datetime.utcnow()
                )
                db.add(weather_entry)
                try:
                    db.commit()
                    logger.info(f"Stored weather data for {city}: {temp}°C, {humidity}%")
                except Exception as e:
                    db.rollback()
                    logger.error(f"DB Error storing data for {city}: {e}")
