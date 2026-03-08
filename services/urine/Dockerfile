FROM python:3.12-slim

WORKDIR /app

# System libs needed by OpenCV headless + YOLO
RUN apt-get update && \
    apt-get install -y --no-install-recommends libglib2.0-0 libgl1 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install CPU-only PyTorch first – prevents ultralytics from pulling 700 MB+ of NVIDIA CUDA libs
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Note: path has a space – JSON array form required
COPY ["Urine Backend/flask_app/", "."]

EXPOSE 5003

CMD ["python", "app.py"]
