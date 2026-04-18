# Weather Analytics Platform

A production-ready full-stack weather analytics platform.

## 🔧 Architecture

- **Python (FastAPI)**: Data ingestion microservice. Periodically fetches data from OpenWeatherMap using `APScheduler`. Saves data to PostgreSQL.
- **Java (Spring Boot)**: API Gateway. Caches data using Redis to avoid overwhelming the database/microservice.
- **Frontend (React + Vite)**: Dashboard showing current weather and history charts.
- **PostgreSQL**: Stores historical weather data.
- **Redis**: Caching layer for API Gateway.

## 🚀 Setup & Run (Docker)

1. Get an API key from OpenWeatherMap.
2. Create a `.env` file in the root directory (same level as `docker-compose.yml`):
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```
3. Run using Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Ports
- React Frontend: `http://localhost:5173`
- Java API Gateway: `http://localhost:8080`
- Python Microservice: `http://localhost:8000`
- PostgreSQL: `5432`
- Redis: `6379`

## API Endpoints

### API Gateway (Java) `http://localhost:8080/api/weather`
- `GET /current?city={city}`: Fetches current weather (uses Redis cache).
- `GET /history?city={city}`: Fetches history (last 24 periods).

### Data Ingester (Python) `http://localhost:8000/weather`
- `GET /latest?city={city}`
- `GET /history?city={city}`

## QA / Testing
To test the caching layer and failure scenarios, there is a `RestTemplate` / `WebClient` integration via WireMock (instructions in code / next phases).
The microservice contains retry logic internally using the `requests` library and `APScheduler`.

