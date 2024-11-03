from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 허용

@app.route('/model2/<path:path>')
def serve_model(path):
    return send_from_directory('model2', path)

if __name__ == '__main__':
    app.run(port=8080)
