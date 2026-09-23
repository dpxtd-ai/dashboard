# RepoHub Python Production Deployment Guide

This directory contains the production-grade Python backend service for the RepoHub Terminal HUD dashboard.

## 1. Quick Start (Standard Library - No pip dependencies required)

Run the zero-dependency Python production server:

```bash
python3 server.py 8000
```

The REST API will be available at `http://0.0.0.0:8000/api`.

## 2. API Endpoints

- `GET /api/health` - Server health check and runtime status
- `GET /api/repos` - Filter and list all tracked repositories
- `GET /api/metrics` - Real-time commit velocity and sprint analytics
- `GET /api/commits/latest` - Latest webhook commit payload with diff stats
- `POST /api/python/execute` - Dynamic Python sandbox executor for metric computation

## 3. Docker Deployment (Python 3.10-slim)

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . /app
EXPOSE 8000
CMD ["python3", "server.py", "8000"]
```
