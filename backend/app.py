import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def hello():
    return jsonify({"message": "Hello from OSMnx Flask app!"})

@app.route('/api/data')
def get_data():
    # This is where you could add OSMnx functionality
    return jsonify({"data": "This is where OSMnx data would go"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)