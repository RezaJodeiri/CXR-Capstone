# Author: Patrick Zhou, Reza Jodeiri, Nathan Luong

FROM python:3.8-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "torch_app.py"]
