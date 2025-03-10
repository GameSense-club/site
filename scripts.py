import json
from datetime import datetime
import pytz
import os
import re
from database import *
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(levelname)s [%(asctime)s]   %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def now_time():  # Получение текущего времени по МСК
    now = datetime.now()
    tz = pytz.timezone('Europe/Moscow')
    now_moscow = now.astimezone(tz)
    current_time = now_moscow.strftime("%H:%M:%S")
    current_date = now_moscow.strftime("%Y.%m.%d")
    week_number = now_moscow.isocalendar()[1]
    return {"date":current_date, "time":current_time, "full_time":f'{current_date} {current_time}', "week":week_number}

logging.debug("Это отладочное сообщение")