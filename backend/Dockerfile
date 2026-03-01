FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:0.10.7 /uv /uvx /bin/

ENV PYTHONUNBUFFERED=1 

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --locked

COPY src/ ./src

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]