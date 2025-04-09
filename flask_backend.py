from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
import cv2
import mediapipe as mp
import tempfile

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Configure the upload folder for videos
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the pre-trained machine learning model
MODEL_PATH = "models/football_talent_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error: Failed to load the model. Details: {e}")

# Initialize MediaPipe Pose for pose estimation
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False, 
    model_complexity=0, 
    min_detection_confidence=0.5, 
    min_tracking_confidence=0.5
)

@app.route('/')
def home():
    """
    Home route to confirm the API is running.
    """
    return "Welcome to the Football Talent Classification API. The service is up and running!"

def extract_features(video_path):
    """
    Extracts features from an uploaded video using MediaPipe Pose.

    Args:
        video_path (str): Path to the video file.

    Returns:
        pd.DataFrame or None: DataFrame containing extracted features if successful, None otherwise.
    """
    cap = cv2.VideoCapture(video_path)
    frame_width, frame_height = 640, 360
    frame_count = 0
    extracted_features = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("⚠️ End of video reached or failed to read frame.")
            break

        # Process every 5th frame for efficiency
        frame_count += 1
        if frame_count % 5 != 0:
            continue

        # Resize and convert the frame to RGB
        frame = cv2.resize(frame, (frame_width, frame_height))
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame using MediaPipe Pose
        result = pose.process(rgb_frame)

        if result.pose_landmarks:
            landmarks = result.pose_landmarks.landmark
            h, w, _ = frame.shape

            # Calculate example features (height, placeholders, etc.)
            height_cm = np.linalg.norm([
                landmarks[mp_pose.PoseLandmark.NOSE].y -
                landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX].y
            ]) * h

            extracted_features = {
                "height_cm": height_cm,
                "weight_kgs": 75,  # Placeholder
                "overall_rating": 85,  # Placeholder
                "potential": 90,  # Placeholder
                "sprint_speed": np.random.randint(60, 90),
                "dribbling": np.random.randint(60, 90),
                "agility": np.random.randint(60, 90),
                "stamina": np.random.randint(60, 90),
                "strength": np.random.randint(60, 90)
            }

            print("✅ Features successfully extracted:", extracted_features)
            return pd.DataFrame([extracted_features])

    cap.release()
    print("⚠️ No valid pose landmarks detected in the video.")
    return None

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles video uploads and predicts if the player is 'Talented' or 'Not Talented'.

    Returns:
        JSON: Prediction result or error message.
    """
    if 'video' not in request.files:
        print("❌ Error: No video file provided in the request.")
        return jsonify({"error": "No video file provided. Please upload a valid video."}), 400

    video_file = request.files['video']
    if video_file.filename == '':
        print("❌ Error: No video file selected.")
        return jsonify({"error": "No video file selected. Please upload a valid video."}), 400

    # Save the uploaded video to the configured folder
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_file.filename)
    video_file.save(video_path)
    print(f"📹 Video successfully uploaded and saved at: {video_path}")

    # Extract features from the uploaded video
    features_df = extract_features(video_path)
    if features_df is None:
        print("❌ Error: Failed to extract features from the video.")
        return jsonify({
            "error": "Unable to process the video. Ensure it contains clear and visible human poses."
        }), 400

    print("✅ Extracted features:\n", features_df)

    # Generate prediction using the pre-trained model
    try:
        # Reshape the features to match the model's input shape
        features_reshaped = features_df.values.astype(np.float32).reshape((1, 1, -1))
        prediction = model.predict(features_reshaped)
        label = "Talented" if prediction[0] == 1 else "Not Talented"

        print(f"🎯 Prediction result: {label}")
        return jsonify({"prediction": label})
    except Exception as e:
        print(f"💥 Error during prediction: {e}")
        return jsonify({"error": "Prediction failed due to an unexpected error. Please try again."}), 500
    finally:
        # Clean up the uploaded video file
        os.remove(video_path)
        print(f"🗑️ Uploaded video removed: {video_path}")

if __name__ == '__main__':
    app.run(debug=True, port=5001)