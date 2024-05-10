import unittest
import re
from data_preprocessing import extract_features  # Importing the function to test

class TestFeatureExtraction(unittest.TestCase):
    def test_extract_features(self):
        url = "http://example.com/path?param=1"
        
        features = extract_features(url)
        
        self.assertEqual(features["url_length"], 31)
        self.assertEqual(features["num_special_chars"], 7)
        self.assertEqual(features["num_digits"], 1)
        self.assertFalse(features["contains_ip"])