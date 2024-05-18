from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pandas as pd
import unittest
import re

class TestTrainModel(unittest.TestCase):
    def test_train_model(self):
        # Sample data for testing
        data = {
            "url_length": [10, 20, 30],
            "num_special_chars": [1, 2, 3],
            "num_digits": [0, 1, 2],
            "contains_ip": [False, False, True],
            "label": [0, 1, 2]
        }

        df = pd.DataFrame(data)
        
        # Split into training and testing              
        X_train, X_test, y_train, y_test = train_test_split(
            df.drop("label", axis=1), 
            df["label"], 
            test_size=0.3, 
            random_state=42
        )
        
        # Standardize the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train the model
        model = RandomForestClassifier(n_estimators=10, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        # Test if the model predicts without errors
        predictions = model.predict(X_test_scaled) 
        
        self.assertEqual(len(predictions), len(y_test))
