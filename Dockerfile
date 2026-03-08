# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY backend/requirments.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the backend directory
COPY backend/ /app/

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Expose port
EXPOSE 8000

# Run migrations and start gunicorn
WORKDIR /app
CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2

