import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib


# Load a dataset with URLs and labels
# The dataset with a 'url' column and a 'label' column
url_data = pd.read_csv("urls_data.csv")

# Define the correct label mapping based on the dataset's unique values
label_mapping = {
    "benign": 0,
    "defacement": 1,
    "phishing": 2,
    "malware": 3,
    # Handle unexpected labels by providing a default value
    0: "benign",  # Example of handling numerical labels
    1: "defacement",
    2: "phishing",
    3: "malware"
}

# Apply the corrected label mapping
url_data['label'] = url_data['label'].apply(lambda x: label_mapping.get(x, 0))  


# Function to extract lexical features from URLs
def extract_features(url):
    return {
        "url_length": len(url),
        "num_special_chars": len([char for char in "%/.=:_-"]),
        "num_digits": sum(char.isdigit() for char in url),
        "contains_ip": any(char.isdigit() for char in url.split('.')),
        "contains_special": any(char in ['%', '/', '.', '=', '_', '-', '@', '?', ':', '~'] for char in url)
    }

# Create a DataFrame with the extracted features
feature_data = pd.DataFrame([extract_features(url) for url in url_data['url']])

# Add the labels to the features DataFrame
feature_data['label'] = url_data['label']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    feature_data.drop("label", axis=1), 
    feature_data['label'], 
    test_size=0.3, 
    random_state=42
)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# # Save the preprocessed data for later use 
# X_train_scaled.to_pickle("X_train_scaled.pkl")
# X_test_scaled.to_pickle("X_test_scaled.pkl")
# y_train.to_pickle("y_train.pkl")
# y_test.to_pickle("y_test.pkl")

joblib.dump(scaler, "scaler.pkl")