
# ⚽ TechTactics – AI-Powered Football Analysis Platform

TechTactics is an AI-powered web application that helps scouts, coaches, and analysts evaluate player potential, predict market value, analyze contracts, and explore upcoming sports events. It combines computer vision, machine learning, OCR, and external APIs into a sleek user experience.

🎥 [Watch the Demo on YouTube](https://youtu.be/MvZiGuY20ZY)

---

## 📁 Project Structure

```
FrontendApp/
├── contract_analysis.html
├── event-optimization.html
├── index.html
├── login.html
├── player-value.html
├── scout.html
├── styles0.css
├── script.js
├── contract_script.js
└── event_script.js

models/
├── detect_talent_football.ipynb
├── football_talent_model.pkl
├── finalized_model.sav
└── player_value.ipynb

smart_predict.py         # 🧠 Football talent detection
player_value.py          # 💰 Player value prediction
contract.py              # 📑 Contract analyzer (OCR + NLP)
event.py                 # 📅 Event optimization interface
server.js (optional)     # Node server (MongoDB setup)

README.md
```

---

## 🔌 How to Run

TechTactics uses **4 separate Flask apps**, each running on its own port. Make sure all four are running simultaneously.

| Flask App | File               | Description                     | Port         |
|-----------|--------------------|----------------------------------|--------------|
| Talent    | `smart_predict.py` | Football video analysis          | `5003`       |
| Value     | `player_value.py`  | Player value prediction          | `5002`       |
| Contract  | `contract.py`      | Contract analysis via OCR+NLP    | `5004`       |
| Events    | `event.py`         | Event filtering & optimization   | `5005`       |

---

## 🧪 Setup (Backend)

### 1. Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install flask flask-cors joblib numpy pandas opencv-python mediapipe ultralytics transformers googletrans==4.0.0-rc1 pytesseract reportlab pdf2image
```

For Windows users, also install:
- Tesseract OCR: [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- Poppler for Windows: [https://blog.alivate.com.au/poppler-windows/](https://blog.alivate.com.au/poppler-windows/)

---

## 🧠 Model Files

Place these in the `models/` folder:

- `football_talent_model.pkl`
- `finalized_model.sav`

---

## 🚀 Running the Apps

Each app must be run in a separate terminal:

```bash
# Terminal 1 (Football talent)
python smart_predict.py

# Terminal 2 (Player value)
python player_value.py

# Terminal 3 (Contract analyzer)
python contract.py

# Terminal 4 (Event optimization)
python event.py
```

---

## 🌐 Using the Frontend

Open any of the following HTML files in your browser via `file://`:

- `FrontendApp/talent.html`: Upload a video to detect football talent
- `FrontendApp/player-value.html`: Enter player stats to predict value
- `FrontendApp/contract_analysis.html`: Upload contract PDF/image for analysis
- `FrontendApp/event-optimization.html`: Filter and browse upcoming sports events by sport, league, season, month, and day

For better development flow, you can use VSCode’s **Live Server** extension.

---

## 🌟 Features

- **🎯 Talent Classifier** – Upload football videos and detect if the player is talented using AI & pose estimation.
- **💰 Player Value** – Predict market value using player stats with a regression model.
- **📑 Contract Analyzer** – Extract and summarize contract text using OCR and NLP with language toggle (EN/AR).
- **📅 Event Optimization** – Filter real sports events by sport, league, season, month, and day using external APIs.
- **📦 API Integration** – Sports data is pulled from [TheSportsDB](https://www.thesportsdb.com/) and [football-data.org](https://www.football-data.org/) (demo key).

---

## 🎯 Example CURL Commands (for testing)

### Talent Prediction
```bash
curl -X POST -F "video=@/path/to/video.mp4" http://localhost:5003/smart-predict
```

### Value Prediction
```bash
curl -X POST -H "Content-Type: application/json" -d '{"age": 24, "height_cm": 180, "weight_kgs": 75, "overall_rating": 85, "potential": 90}' http://localhost:5002/predict-value
```

---

## 🛠 Requirements

- Python 3.8+
- Node.js (optional for MongoDB backend)
- Chrome browser
- Tesseract OCR and Poppler installed (for PDF contract analysis)

---

## 🧑‍💻 Made with ♥ by Ghadeer, Atheer, Renad, Zaher

---

## 📈 Future Improvements

- Authentication for scouts
- More sports support (e.g., swimming classifier is partially implemented)
- Advanced dashboard for analysis history
- Custom PDF layouts for reports
