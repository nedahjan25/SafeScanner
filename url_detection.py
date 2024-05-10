from flask import Flask, request, jsonify, send_file
from flask import Flask, render_template
import joblib
import re
import pandas as pd

app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load("url_detection_model.pkl")
scaler = joblib.load("url_scaler.pkl")

# Endpoint to serve the HTML file
# Route to the home page
@app.route("/")
def index():
    return render_template("index.html")

# Route to the about page
@app.route("/qrScanner")
def about():
    return render_template("qrScanner.html")
    

# Endpoint to serve the HTML file
@app.route("/")
def home():
    return send_file("urlScanner.html") # Serve the HTML file

# Endpoint for URL detection
@app.route("/detect", methods=["POST"])
def detect_url():
    data = request.json
    url = data.get("url", "")

    # Extract features from the URL
    features = {
        "url_length": len(url),
        "num_special_chars": len([char for char in "%/.=:_-"]),
        "num_digits": sum(char.isdigit() for char in url),
        "contains_ip": re.search(r'\d+\.\d+\.\d+\.\d+', url) is not None,
    }

    # Standardize the features
    features_scaled = scaler.transform(pd.DataFrame([features]))

    # Predict whether the URL is suspicious or benign
    prediction = model.predict(features_scaled)[0]

    result = {
        "url": url,
        "is_suspicious": bool(prediction),
        "message": "Malicious URL" if prediction else "Benign URL",
    }

    return jsonify(result)

# Run the Flask app
if __name__ == "__main__":
    #app.run(debug=True, port=5000)
    app.run(debug=True, host='0.0.0.0', port=8080)
