from apscheduler.schedulers.background import BackgroundScheduler
from .weather_client import fetch_and_store_weather
from .database import SessionLocal
import atexit
import logging

logger = logging.getLogger(__name__)

def job():
    db = SessionLocal()
    try:
        fetch_and_store_weather(db)
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run every 60 minutes
    scheduler.add_job(job, 'interval', minutes=60, id='weather_fetch_job', replace_existing=True)
    scheduler.start()
    logger.info("Started BackgroundScheduler - fetching weather every 60 minutes")
    
    # Run once at startup as well
    try:
        job()
    except Exception as e:
        logger.error(f"Error on initial run: {e}")

    atexit.register(lambda: scheduler.shutdown())
