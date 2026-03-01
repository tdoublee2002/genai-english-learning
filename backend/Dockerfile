FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN pip install --no-cache-dir \
    fastapi>=0.134.0 \
    litellm>=1.81.16 \
    psycopg[binary]>=3.3.3 \
    pydantic-settings>=2.13.1 \
    python-dotenv>=1.2.1 \
    sqlalchemy>=2.0.47 \
    sqlmodel>=0.0.37 \
    uvicorn[standard]>=0.41.0

COPY src ./src

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
