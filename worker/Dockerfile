# ---- Build stage ----
FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- Runtime stage ----
FROM python:3.12-slim AS runtime

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy installed packages system-wide (not --user, avoids $HOME dependency issues)
COPY --from=builder /install /usr/local
COPY . .

ENV PYTHONUNBUFFERED=1

RUN chown -R appuser:appgroup /app

USER appuser

CMD ["python", "worker.py"]