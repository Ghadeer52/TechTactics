
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import pandas as pd
import time
import joblib
from werkzeug.utils import secure_filename

from ultralytics import YOLO  # YOLOv8 for detection
import mediapipe as mp

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load YOLOv8 model (person, sports ball, etc.)
yolo = YOLO("yolov8n.pt")

# Load football model (expects input shape: (1, 1, 9))
football_model = joblib.load("models/football_talent_model.pkl")

# MediaPipe Pose for optional motion features (used in swimming class)
mp_pose = mp.solutions.pose

# ------------------ Swimming Class ------------------
class SwimmingTalentDetector:
    def __init__(self, speed_threshold=1.5):
        self.speed_threshold = speed_threshold
        self.pose = mp_pose.Pose()
        self.prev_left_hand_pos = None
        self.prev_right_hand_pos = None
        self.prev_time = None

    def estimate_speed(self, prev_pos, curr_pos, time_diff):
        if prev_pos is None or curr_pos is None or time_diff <= 0:
            return 0
        distance = np.linalg.norm(np.array(curr_pos) - np.array(prev_pos))
        return distance / time_diff

    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return "Not talented swimmer"

        label = "Not talented swimmer"
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(image_rgb)
            if results.pose_landmarks:
                w, h = frame.shape[1], frame.shape[0]
                lh = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
                rh = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
                lh_pos = (lh.x * w, lh.y * h)
                rh_pos = (rh.x * w, rh.y * h)
                curr_time = time.time()

                if self.prev_left_hand_pos and self.prev_time:
                    l_speed = self.estimate_speed(self.prev_left_hand_pos, lh_pos, curr_time - self.prev_time)
                    r_speed = self.estimate_speed(self.prev_right_hand_pos, rh_pos, curr_time - self.prev_time)
                    avg_speed = (l_speed + r_speed) / 2
                    label = "Talented swimmer" if avg_speed > self.speed_threshold else "Not talented swimmer"

                self.prev_left_hand_pos = lh_pos
                self.prev_right_hand_pos = rh_pos
                self.prev_time = curr_time

        cap.release()
        return label

# ------------------ Helper Functions ------------------
def extract_features_placeholder():
    return pd.DataFrame([{
        "height_cm": 175,
        "weight_kgs": 75,
        "overall_rating": 85,
        "potential": 90,
        "sprint_speed": 80,
        "dribbling": 78,
        "agility": 77,
        "stamina": 85,
        "strength": 80
    }])

def detect_human(frame):
    results = yolo(frame)
    classes = results[0].boxes.cls.cpu().numpy()
    return 0 in classes  # class 0 = person

def detect_ball_near_foot(frame):
    results = yolo(frame)[0]
    person_boxes = []
    ball_boxes = []

    for box, cls in zip(results.boxes.xyxy.cpu().numpy(), results.boxes.cls.cpu().numpy()):
        if cls == 0:  # person
            person_boxes.append(box)
        elif cls == 32:  # sports ball
            ball_boxes.append(box)

    for person in person_boxes:
        px1, py1, px2, py2 = person
        foot_y = py2  # bottom of person box
        for ball in ball_boxes:
            bx1, by1, bx2, by2 = ball
            ball_center_y = (by1 + by2) / 2
            if abs(ball_center_y - foot_y) < 50:  # Ball near feet
                return True
    return False

def detect_water(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array([90, 50, 50]), np.array([130, 255, 255]))
    blue_ratio = np.sum(mask > 0) / (frame.shape[0] * frame.shape[1])
    return blue_ratio > 0.2

# ------------------ Flask Route ------------------
@app.route('/smart-predict', methods=['POST'])
def smart_predict():
    if 'video' not in request.files:
        return jsonify({"prediction": "No video uploaded"}), 400

    video_file = request.files['video']
    filename = secure_filename(video_file.filename)
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video_file.save(video_path)

    cap = cv2.VideoCapture(video_path)
    valid_frame = None
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (640, 360))
        if detect_human(frame):
            valid_frame = frame
            break
    cap.release()

    if valid_frame is None:
        os.remove(video_path)
        return jsonify({"prediction": "No human detected"})

    # 1. Ball near foot → Football model
    if detect_ball_near_foot(valid_frame):
        features = extract_features_placeholder().values.astype(np.float32).reshape((1, 1, -1))
        prediction = football_model.predict(features)[0]
        label = "Talented football player" if prediction == 1 else "Not talented football player"
        os.remove(video_path)
        return jsonify({"prediction": label})

    # 2. Swimming
    if detect_water(valid_frame):
        result = SwimmingTalentDetector().process_video(video_path)
        os.remove(video_path)
        return jsonify({"prediction": result})

    # 3. Fallback
    os.remove(video_path)
    return jsonify({"prediction": "Unsupported or unknown sport"})

@app.route('/')
def home():
    return "Smart AI Talent Classifier is running."

if __name__ == '__main__':
    app.run(debug=True, port=5003)
