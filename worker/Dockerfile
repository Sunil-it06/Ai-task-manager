# ---- Build stage ----
FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt .
# Installing to /usr/local inside the builder makes system-wide copying much cleaner
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- Runtime stage ----
FROM python:3.12-slim AS runtime

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# 1. Copy installed packages from the builder stage
COPY --from=builder /install /usr/local

# 2. Copy your application source code
COPY . .

# Ensure Python logs are flushed immediately to stdout/stderr
ENV PYTHONUNBUFFERED=1

# 3. CRITICAL FIX: Ensure appuser owns BOTH the copied packages and the app files
RUN chown -R appuser:appgroup /app && chown -R appuser:appgroup /usr/local

# Switch to the secure non-root user
USER appuser

CMD ["python", "worker.py"]
