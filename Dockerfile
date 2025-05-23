FROM python:3.9

WORKDIR /var/www/game-sense.net

VOLUME /var/www/game-sense.net

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5100", "--workers", "4", "--user", "root", "app:app"]