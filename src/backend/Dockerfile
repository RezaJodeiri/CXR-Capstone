# backend/Dockerfile
FROM python:3.8-slim
RUN apt-get update && apt-get install -y curl
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
