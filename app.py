from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'message': 'Data from Flask backend!',
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
