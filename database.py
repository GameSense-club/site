import sqlite3
import logging
import json

logging.basicConfig(
    level=logging.DEBUG,
    format='%(levelname)s [%(asctime)s]   %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

DB_NAME = 'database.db'
DB_PATH = f"{DB_NAME}"

def SQL_request(request, params=(), all_data=None, return_json=None): # выполнение SQL запросов
    connect = sqlite3.connect(DB_PATH)
    cursor = connect.cursor()
    result = None
    
    if request.strip().lower().startswith('select'):
        cursor.execute(request, params)
        if all_data is None:
            raw_result = cursor.fetchone()
        else:
            raw_result = cursor.fetchall()

        if raw_result is not None and cursor.description:
            columns = [col[0] for col in cursor.description]
            data = {}
            for col, value in zip(columns, raw_result):
                try:
                    data[col] = json.loads(raw_result)
                except: pass
            result = data
        else:
            result = raw_result
        
        connect.close()
        if return_json:
            return json.dumps(result)
        return result
    else:
        cursor.execute(request, params)
        connect.commit()
        connect.close()
        return None

def user_data(id=None, email=None, phone=None): # получение данных пользователя
    conditions = []
    params = []
    if id is not None:
        conditions.append("user_id = ?")
        params.append(id)
    if email is not None:
        conditions.append("email = ?")
        params.append(email)
    if phone is not None:
        conditions.append("phone_number = ?")
        params.append(phone)
    if not conditions:
        logging.error("Укажите id, email или phone")
        return None
    query = "SELECT * FROM users WHERE " + " AND ".join(conditions)
    return SQL_request(query, params)

def settings_database():
    try:
        SQL_request("ALTER TABLE users DROP COLUMN purchases")
        logging.info("Колонка с покупками удалена!")
    except: pass

    update_column('inventory')
    update_column('cart')

def update_column(column):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()  
    try:
        cursor.execute(f"SELECT user_id, {column} FROM users WHERE {column} IS NOT NULL AND {column} != ''")
        rows = cursor.fetchall()
        for row in rows:
            user_id, inventory_str = row
            for item in (inventory_str.split(",")):
                print(item)
            inventory_list = json.loads(inventory_str)
            updated_inventory_str = ', '.join(json.dumps(item) for item in inventory_list)
            cursor.execute(f"UPDATE users SET {column} = ? WHERE user_id = ?", (updated_inventory_str, user_id))
        conn.commit()
        logging.info(f"{column} обновлено!")
    except Exception as e:
        logging.error(f"Произошла ошибка: {e}")
        conn.rollback()
    finally:
        conn.close()

settings_database()