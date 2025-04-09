import pickle

# Load the model
model_path = "models/talent_model.pkl"
model = joblib.load(model_path)
with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

# Check what type of object the model is
print(type(model))

# If it's a custom function/class, check its attributes
if hasattr(model, "predict"):
    print("Model supports predict(). It expects:", model.predict.__annotations__)  # If annotations exist

# Try checking expected input shape (for sklearn models)
if hasattr(model, "n_features_in_"):
    print(f"Expected number of features: {model.n_features_in_}")
