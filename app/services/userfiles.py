from app.utils.connectDB import make_connection

def add_user_file(user_id, file_url, file_name, file_id, file_type="pdf"):
    conn = make_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO user_files (user_id, file_url, file_name, file_type, file_id) VALUES (%s, %s, %s, %s, %s)",
            (user_id, file_url, file_name, file_type, file_id)
        )
        conn.commit()
        return {"Success": "File added"}
    except Exception as e:
        conn.rollback()
        return {"Error": f"Failed to add file: {e}"}
    finally:
        cur.close()
        conn.close()
