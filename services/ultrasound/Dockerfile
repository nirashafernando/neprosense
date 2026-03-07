FROM python:3.12-slim

WORKDIR /app

# System libs needed by OpenCV headless
RUN apt-get update && \
    apt-get install -y --no-install-recommends libglib2.0-0 libgl1 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# TensorFlow requires Python 3.12 – this image pins exactly that
RUN pip install --no-cache-dir -r requirements.txt

# Note: path has a space – JSON array form required
COPY ["Ultra backend/flask_app/", "."]

EXPOSE 5002

CMD ["python", "app.py"]
