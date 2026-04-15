FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN addgroup --system app && adduser --system --ingroup app app && chown -R app:app /app
USER app

CMD ["gunicorn", "booking_system.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
