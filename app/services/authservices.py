import bcrypt
from app.utils.connectDB import make_connection

def create_user(username, email, password):
    conn = make_connection()
    cur = conn.cursor()
    try:
        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            return {"Error": "User with this username or email already exists"}

        # Hash password
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12))

        # Insert new user
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, hashed.decode("utf-8"))
        )
        conn.commit()
        return {"Success": "User created successfully"}

    except Exception as e:
        conn.rollback()
        return {"Error": f"User creation failed"}
    finally:
        cur.close()
        conn.close()


def check_user(username=None, email=None, password=None):
    if not password:
        return {"Error": "Password is required"}

    conn = make_connection()
    cur = conn.cursor()
    try:
        if username:
            cur.execute("SELECT password_hash FROM users WHERE username = %s", (username,))
        elif email:
            cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
        else:
            return {"Error": "Username or Email required"}

        row = cur.fetchone()
        if not row:
            return {"Error": "User not found"}

        stored_hash = row[0]
        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return {"Success": True}
        else:
            return {"Success": False}

    except Exception as e:
        return {"Error": f"Error while checking user"}
    finally:
        cur.close()
        conn.close()
