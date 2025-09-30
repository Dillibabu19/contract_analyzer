import os
from dotenv import load_dotenv
import psycopg2
import bcrypt

load_dotenv()

def make_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("dbname"),
        user=os.getenv("user"),
        password=os.getenv("password"),
        host=os.getenv("host"),
        port=os.getenv("port")
    )
    return conn
