# ⚽ TechTactics – Football Talent Classifier

TechTactics is a web application that allows users (like scouts or coaches) to upload a short football video of a player, and receive an AI-based prediction of whether the player is **"Talented"** or **"Not Talented"** based on their movement and features.

This project uses:
- 🧠 A Machine Learning model trained on football attributes  
- 🎥 MediaPipe Pose for pose estimation from video  
- 🌐 Flask for the backend API  
- 🧾 HTML/CSS/JS for the frontend  
- (Optional) Node.js server for advanced features

---

## 📁 Project Structure

```
FrontendApp/
├── Styles0.css
├── event-optimization.html
├── index.html
├── login.html
├── scout.html
├── script0.js
└── talent.html

otherStyless/
└── pinkypurple.css

models/
├── detect_talent.ipynb
└── football_talent_model.pkl

flask_backend.py
server.js
test.py
.gitignore
desktop.ini
```

---

## 🧪 Backend Requirements (Python)

Make sure Python is installed.

### 1. 🔧 Create a virtual environment (optional but recommended)

```bash
python -m venv venv
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. 📦 Install Python dependencies

```bash
pip install flask flask-cors joblib numpy pandas opencv-python mediapipe
```

### 3. 🧠 Prepare the model

Make sure the file `models/football_talent_model.pkl` exists in the correct location. This is your pre-trained classifier.

---

## 🚀 Run the Flask Backend

From the project root directory:

```bash
python flask_backend.py
```

The backend will run at `http://localhost:5001`.

---

## 🌐 Frontend Usage

You can open `FrontendApp/index.html` or `scout.html` in your browser directly (or use an extension like Live Server).

Make sure the Flask backend is running to process the uploaded videos.

---

## 🌍 Optional Node.js Server (If you're using `server.js`)

### 1. 📦 Install Node.js dependencies

```bash
npm install dotenv express multer mongoose
```

### 2. ⚙️ Create a `.env` file

In the root directory, create a `.env` file with the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. 🚀 Run the Node server

```bash
node server.js
```

---

## 🎯 Example CURL request (test without frontend)

```bash
curl -X POST -F "video=@C:/path/to/your/football.mp4" http://localhost:5001/predict
```

---

## ✅ Features

- Upload and analyze football videos  
- AI-powered talent classification  
- Pose estimation using MediaPipe  
- Expandable design for scouts, athletes, and analysts  

---

## 💡 Future Improvements

- Add user accounts and scouting dashboards  
- Enable player statistics history  
- Improve video feedback and pose visualization  
- Support multilingual UI (Arabic/English)

---

## 🧑‍💻 Made by Ghadeer
