from pydantic import BaseModel
from datetime import datetime

class WeatherDataSchema(BaseModel):
    id: int
    city: str
    temperature: float
    humidity: float
    timestamp: datetime

    class Config:
        from_attributes = True
