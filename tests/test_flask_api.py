from flask import Flask, request, jsonify
import unittest
import json

app = Flask(__name__)

@app.route("/detect", methods=["POST"])
def detect_url():
    data = request.json
    url = data.get("url", "")

    # Dummy response for unit testing
    response = {
        "url": url,
        "is_suspicious": False,
        "message": "Benign URL"
    }

    return jsonify(response)

class TestFlaskAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_detect_url(self):
        # Send a sample POST request to the Flask endpoint
        response = self.app.post(
            "/detect",
            data=json.dumps({"url": "http://example.com"}),
            content_type="application/json"
        )
        
        # Test if the response is valid and contains the expected fields
        data = json.loads(response.data)
        
        self.assertEqual(data["url"], "http://example.com")
        self.assertFalse(data["is_suspicious"])
        self.assertEqual(data["message"], "Benign URL")
