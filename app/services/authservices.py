import bcrypt
from app.utils.connectDB import make_connection

def create_user(username,email,password):
    conn = make_connection()
    cur = conn.cursor()
    try:
        hashed = bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())
        cur.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, hashed.decode("utf-8"))
        )
        return {"Success":f"User created sucessfully"}

    except Exception as e:
        return {"Error":f"Error while creating user {e}"}
    
    finally:
        conn.commit()
        cur.close()
        conn.close()


def check_user(username=None,email=None,password=None):
    conn = make_connection()
    cur = conn.cursor()

    try:
        if username:
            cur.execute("SELECT password_hash FROM users WHERE username = %s", (username,))
            stored_hash = cur.fetchone()[0]
        elif email:
            cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
            stored_hash = cur.fetchone()[0]
    
        if bcrypt.checkpw(password.encode("utf-8"),stored_hash.encode("utf-8")):
            # cur.close()
            # conn.close()
            return True
        else:
            # cur.close()
            # conn.close()
            return False
        
    except Exception as e:
        return {"Error":f"Error while checking user {e}"}
    
    finally:
        cur.close()
        conn.close()
    

