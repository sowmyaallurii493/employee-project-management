import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="backend_eval",
        user="postgres",
        password="1234",
        port="5433"
    )
    return conn