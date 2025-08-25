# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app


# Copy requirements and install dependencies
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt

# Copy application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]