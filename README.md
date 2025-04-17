
# ⚽ TechTactics – Football Talent Classifier

TechTactics is a web application designed to predict football player talent and value based on video input and player attributes. This tool is ideal for scouts, coaches, and analysts to evaluate football players.
## Demo

[Watch the demo here](https://www.youtube.com/watch?v=eczk7fs4U84)

## 📁 Project Structure

```
FrontendApp/
├── Styles0.css
├── event-optimization.html
├── index.html
├── login.html
├── player-value.html
├── scout.html
├── script.js
└── talent.html

models/
├── detect_talent_football.ipynb
├── football_talent_model.pkl
├── finalized_model.sav
└── player_value.ipynb

smart_predict.py
flask_backend.py
player_value.py
server.js
test.py
.gitignore
README.md
desktop.ini
```

---

## 🧪 Backend Setup (Python)

The project uses **Flask** to serve the backend for both the talent prediction and player value prediction functionalities.

### 1. 🔧 Create a Virtual Environment (Optional but Recommended)

If you want to set up a virtual environment for Python dependencies, run the following commands:

```bash
python -m venv venv
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. 📦 Install Python Dependencies

Install the necessary Python packages using pip:

```bash
pip install flask flask-cors joblib numpy pandas opencv-python mediapipe ultralytics
```

### 3. 🧠 Prepare the Models

Make sure the following model files exist in the `models/` directory:

- `models/football_talent_model.pkl`
- `models/football_talent_model.sav`
  
These files contain the pre-trained machine learning models used for talent classification and player value prediction.

---

## 🚀 Running the Backend

### Flask Backend

To start the backend for both football talent prediction and player value prediction, run the following:

```bash
python smart_predict.py
```

This will run the Flask server at `http://localhost:5003`.

### Player Value Prediction (Python)

To start the backend for player value prediction, run:

```bash
python player_value.py
```

This server will run at `http://localhost:5002`.

---

## 🌐 Frontend Usage

The frontend is built using HTML, CSS, and JavaScript. It includes the following pages:

- **Talent Prediction** (`talent.html`): Allows users to upload a football video, which will be analyzed to determine if the player is "Talented" or "Not Talented".
- **Player Value Prediction** (`player-value.html`): Allows users to input player attributes like age, height, weight, etc., to predict the player's market value.

### Opening the Frontend

To view the frontend:

1. Open the `FrontendApp/index.html` file directly in a browser.
2. Use an extension like **Live Server** to serve the pages if you prefer dynamic reloading during development.

---

## 🌍 Optional Node.js Server (If you're using `server.js`)

### 1. 📦 Install Node.js Dependencies

If you're using Node.js for additional server features, install the dependencies:

```bash
npm install dotenv express multer mongoose
```

### 2. ⚙️ Create a `.env` File

Create a `.env` file in the root directory and add the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. 🚀 Run the Node Server

```bash
node server.js
```

---

## 🎯 Features

- **Football Talent Prediction**: Upload and analyze football videos to classify a player's talent based on AI-powered classification.
- **Player Value Prediction**: Input player attributes (e.g., age, height, weight) and get a predicted market value.
- **Pose Estimation**: The system uses **MediaPipe Pose** to extract the football player's movements from video for talent prediction.
- **Scalable**: This system can be extended to support more functionalities such as user accounts, scouting dashboards, and detailed player history.

---

## 💡 Future Improvements

- **User Accounts & Scouting Dashboards**: Allow scouts and coaches to create accounts and track player evaluation history.
- **Player Statistics History**: Add a feature to store and display player statistics over time.
- **Pose Visualization**: Improve the visual feedback of the pose estimation process for better understanding.
- **Multilingual Support**: Extend the UI to support multiple languages (Arabic/English).

---

## 🧑‍💻 Made by Ghadeer, Atheer, Renad, Zaher

---

## 🧑‍💻 Development Notes

- Ensure that all backend servers are running before using the frontend for full functionality.
- If you encounter issues with the Flask or Node.js servers, check if the necessary model files (`.pkl` or `.sav`) are present in the `models/` folder and that the correct paths are referenced in the backend scripts.

---

## 📦 Testing

To test the talent prediction system via **CURL**, you can use the following command to send a video file directly to the backend:

```bash
curl -X POST -F "video=@/path/to/your/football_video.mp4" http://localhost:5001/predict
```

For the player value prediction:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"age": 24, "height_cm": 180, "weight_kgs": 75, "overall_rating": 85, "potential": 90}' http://localhost:5002/predict-value
```

---

## ✅ Requirements

- Python 3.6 or higher
- Node.js (optional for advanced features)
- Dependencies: Flask, MediaPipe, OpenCV, etc.
