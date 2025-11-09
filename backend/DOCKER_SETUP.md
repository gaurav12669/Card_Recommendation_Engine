# Docker Setup Guide

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Start all services:**
   ```bash
   docker compose up --build
   ```

3. **Access the application:**
   - Backend API: http://localhost:8080
   - MySQL: localhost:3307
   - MongoDB: localhost:27018
   - Redis: localhost:6380

## What Happens on Startup

1. **MySQL, MongoDB, and Redis** containers start and wait until healthy
2. **Backend** container waits for all dependencies to be healthy
3. **Database setup** runs automatically (`npm run setup`):
   - Creates database and tables
   - Seeds initial data (categories, banks, cards, etc.)
4. **Backend server** starts on port 8080

## Environment Variables

All environment variables are set in `docker-compose.yml`:
- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=""` (empty)
- `TRAVEL_CONSTANT=2`   
- `SHOPING_CONSTANT=3`
- `FUEL_CONSTANT=4`
- `FOOD_CONSTANT=5`
- `PORT=8080`
- `DB_NAME=card_genius`
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`
- `MONGO_URI=mongodb://mongo:27017`
- `MONGO_DB_NAME=card_genius_analytics`

## Skipping Setup

To skip database setup on startup (if data already exists):
```bash
# Set in docker-compose.yml or override:
RUN_SETUP_ON_STARTUP=false
```

## Stopping Services

```bash
docker compose down
```

## Removing All Data

```bash
docker compose down -v
```

## Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f mysql
```

## Troubleshooting

1. **Port conflicts:** If ports are already in use, modify port mappings in `docker-compose.yml`
2. **Database connection errors:** Wait for MySQL to be healthy (healthcheck will handle this)
3. **Setup fails:** Check logs with `docker compose logs backend`

## Services

- **mysql**: MySQL 8 database
- **mongo**: MongoDB 6 for analytics
- **redis**: Redis for caching
- **backend**: Node.js backend application

