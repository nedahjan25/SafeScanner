from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pandas as pd
import joblib

# Load the data from the data_preprocessing step
# (Ensure this file runs after 'data_preprocessing.py')
X_train_scaled = pd.read_pickle("X_train_scaled.pkl")
X_test_scaled = pd.read_pickle("X_test_scaled.pkl")
y_train = pd.read_pickle("y_train.pkl")
y_test = pd.read_pickle("y_test.pkl")

# Train a Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate the model
y_pred = model.predict(X_test_scaled)

# Calculate evaluation metrics
accuracy = accuracy_score(y_test, y_pred)
classification_rep = classification_report(y_test, y_pred)
confusion_mat = confusion_matrix(y_test, y_pred)

# Display the evaluation results
print("Accuracy:", accuracy)
print("Classification Report:")
print(classification_rep)
print("Confusion Matrix:")
print(confusion_mat)

# Save the trained model and scaler for future use
scaler = joblib.load("url_scaler.pkl")

joblib.dump(model, "url_detection_model.pkl")
joblib.dump(scaler, "url_scaler.pkl")
