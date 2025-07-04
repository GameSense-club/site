FROM python:3.9-slim

WORKDIR /var/www/game-sense.net

VOLUME /var/www/game-sense.net

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN find . -type d -name "__pycache__" -exec rm -rf {} + && \
    find . -type f -name "*.py[co]" -delete

CMD ["gunicorn", "--bind", "0.0.0.0:5100", "--workers", "4", "--user", "root", "app:app"]