FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=10000
CMD ["gunicorn","-w","2","-b","0.0.0.0:10000","wsgi:app"]
