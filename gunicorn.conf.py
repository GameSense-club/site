bind = "0.0.0.0:5100"
workers = 4
worker_class = "sync"
timeout = 30
keepalive = 2

# Логирование
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Безопасность
user = "www-data"
group = "www-data"
umask = 0o007

raw_env = [
    "FLASK_ENV=production",
]

reload = False