from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the regression model
MODEL_PATH = "models/finalized_model.sav"
try:
    value_model = joblib.load(MODEL_PATH)
    print("✅ Player Value Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load value model: {e}")
    value_model = None

@app.route('/predict-value', methods=['POST'])
def predict_value():
    """
    Predict player's market value based on stats.
    Expects JSON: { age, height_cm, weight_kgs, overall_rating, potential }
    """
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging log
    
    if not value_model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        required_fields = ["age", "height_cm", "weight_kgs", "overall_rating", "potential"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required player stats"}), 400

        input_features = np.array([
            data["age"],
            data["height_cm"],
            data["weight_kgs"],
            data["overall_rating"],
            data["potential"]
        ]).reshape(1, -1)

        predicted_value = predicted_value = max(0, value_model.predict(input_features)[0])
        # Convert to euros (assuming the model predicts in thousands of euros)
        print(f"🎯 Predicted Value: €{predicted_value:,.2f}")
        return jsonify({
            "predicted_value_eur": round(predicted_value, 2)
        })

    except Exception as e:
        print(f"💥 Error: {e}")
        return jsonify({"error": "Prediction failed"}), 500

@app.route('/')
def home():
    return "🏠 Player Value Prediction API is running."

if __name__ == '__main__':
    app.run(debug=True, port=5002)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the regression model
MODEL_PATH = "models/finalized_model.sav"
try:
    value_model = joblib.load(MODEL_PATH)
    print("✅ Player Value Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load value model: {e}")
    value_model = None

@app.route('/predict-value', methods=['POST'])
def predict_value():
    """
    Predict player's market value based on stats.
    Expects JSON: { age, height_cm, weight_kgs, overall_rating, potential }
    """
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging log
    
    if not value_model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        required_fields = ["age", "height_cm", "weight_kgs", "overall_rating", "potential"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required player stats"}), 400

        input_features = np.array([
            data["age"],
            data["height_cm"],
            data["weight_kgs"],
            data["overall_rating"],
            data["potential"]
        ]).reshape(1, -1)

        predicted_value = predicted_value = max(0, value_model.predict(input_features)[0])
        # Convert to euros (assuming the model predicts in thousands of euros)
        print(f"🎯 Predicted Value: €{predicted_value:,.2f}")
        return jsonify({
            "predicted_value_eur": round(predicted_value, 2)
        })

    except Exception as e:
        print(f"💥 Error: {e}")
        return jsonify({"error": "Prediction failed"}), 500

@app.route('/')
def home():
    return "🏠 Player Value Prediction API is running."

if __name__ == '__main__':
    app.run(debug=True, port=5002)
