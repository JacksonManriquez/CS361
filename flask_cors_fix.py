# Add CORS support to your Flask server
# Install flask-cors first: pip install flask-cors

from flask import Flask, request, jsonify
import sqlite3
import hashlib
import logging
from datetime import datetime
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app)  # Add this line after creating the Flask app

# Your existing code continues below...
DATABASE = "auth.db"

# -----------------------
# Database Initialization
# -----------------------

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            username TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            UNIQUE(client_id, username)
        )
    """)

    conn.commit()
    conn.close()

init_db()

# -----------------------
# Logging Configuration
# -----------------------

logging.basicConfig(
    filename='deletion.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

# -----------------------
# Helper Functions
# -----------------------

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# -----------------------
# User Registration
# -----------------------

@app.route('/register', methods=['POST'])
def register():

    print("Received registration request. Processing...")

    data = request.get_json()

    if not data or not all(k in data for k in ("client_id", "username", "password")):
        return jsonify({"success": False, "error_message": "Invalid input"}), 400

    client_id = data["client_id"]
    username = data["username"]
    password_hash = hash_password(data["password"])

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (client_id, username, password_hash) VALUES (?, ?, ?)",
            (client_id, username, password_hash)
        )
        conn.commit()
        return jsonify({"success": True}), 201
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error_message": "Username already exists"}), 409
    finally:
        conn.close()

# -----------------------
# User Authentication
# -----------------------

@app.route('/authenticate', methods=['POST'])
def authenticate():
    print("Received authentication request. Processing...")

    data = request.get_json()

    if not data or not all(k in data for k in ("client_id", "username", "password")):
        return jsonify({"authorized": False, "error_message": "Invalid input"}), 400

    client_id = data["client_id"]
    username = data["username"]
    password_hash = hash_password(data["password"])

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE client_id = ? AND username = ?",
        (client_id, username)
    )
    user = cursor.fetchone()
    conn.close()

    if user and user["password_hash"] == password_hash:
        return jsonify({"authorized": True}), 200
    else:
        return jsonify({"authorized": False, "error_message": "User not found or incorrect password"}), 401

# -----------------------
# User Deletion
# -----------------------

@app.route('/delete', methods=['DELETE'])
def delete_user():

    print("Received deletion request. Processing...")

    data = request.get_json()

    if not data or not all(k in data for k in ("client_id", "username")):
        logging.info("Failed deletion attempt - invalid input")
        return jsonify({"success": False, "error_message": "Invalid input"}), 400

    client_id = data["client_id"]
    username = data["username"]

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE client_id = ? AND username = ?",
        (client_id, username)
    )
    user = cursor.fetchone()

    if not user:
        logging.info(f"Deletion failed - user {username} not found for client {client_id}")
        conn.close()
        return jsonify({"success": False, "error_message": "User does not exist"}), 404

    cursor.execute(
        "DELETE FROM users WHERE client_id = ? AND username = ?",
        (client_id, username)
    )
    conn.commit()
    conn.close()

    logging.info(f"User {username} deleted successfully for client {client_id}")
    return jsonify({"success": True}), 200

# -----------------------

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)