# URL Detection Project
This project aims to detect malicious URLs using machine learning. It includes components for data preprocessing, model training, and a Flask-based real-time URL detection server.

## Installation
1. Set up a virtual environment:
   `bash
   python -m venv .venv
   source .venv/bin/activate  #linux

2. Install required packages:

    pip install -r requirements.txt

## Running the Project
1. Preprocess Data: Run the data preprocessing script to prepare the data for model training.

    python data_preprocessing.py

2. Train the Model: Train the model with the preprocessed data and evaluate its performance.
    
    python train_model.py

3. Run the Flask Server: Start the Flask server to detect URLs in real-time.

    python url_detection.py

## Using the QR Code Scanner
Open the application in your web browser.
Allow access to your device's camera or webcam when prompted.
Position the QR code within the scanner area until it is detected.
Once the QR code is detected, the application will analyze its content and provide feedback.

