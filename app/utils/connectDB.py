import psycopg2
import bcrypt


def make_connection():
    conn = psycopg2.connect(
        dbname="contract-analyzer",
        user="postgres",
        password="dilli1819",
        host="localhost",
        port="5432"
    )
    return conn

def create_user(username,email,password):
    conn = make_connection()
    cur = conn.cursor()
    hashed = bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())
    cur.execute(
    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
    (username, email, hashed.decode("utf-8"))
    )
    conn.commit()
    cur.close()
    conn.close()


def check_user(username=None,email=None,password=None):
    conn = make_connection()
    cur = conn.cursor()
    if username:
        cur.execute("SELECT password_hash FROM users WHERE username = %s", (username,))
        stored_hash = cur.fetchone()[0]
    elif email:
        cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
        stored_hash = cur.fetchone()[0]

    if bcrypt.checkpw(password.encode("utf-8"),stored_hash.encode("utf-8")):
        cur.close()
        conn.close()
        return True
    else:
        cur.close()
        conn.close()
        return False
    

