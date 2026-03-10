from flask import Flask
from flask_cors import CORS
from routes.api_routes import api
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return {
        'message': 'Environmental Risk Map API',
        'version': '1.0',
        'endpoints': [
            '/api/air-quality',
            '/api/weather',
            '/api/environment-data',
            '/api/risk-score',
            '/api/prediction',
            '/api/historical',
            '/api/map-data',
            '/api/eco-route',
            '/api/alerts',
            '/api/reports',
            '/api/safety-score'
        ]
    }

if __name__ == '__main__':
    app.run(debug=True, port=5000)
