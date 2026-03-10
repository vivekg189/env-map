import requests
from datetime import datetime

def fetch_weather(latitude=40.7128, longitude=-74.0060):
    """Fetch weather data from Open-Meteo API"""
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
            'hourly': 'uv_index',
            'timezone': 'auto',
            'forecast_days': 1
        }
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            current = data.get('current', {})
            hourly = data.get('hourly', {})
            
            return {
                'temperature': round(current.get('temperature_2m', 28), 1),
                'humidity': current.get('relative_humidity_2m', 65),
                'wind_speed': round(current.get('wind_speed_10m', 10), 1),
                'precipitation': current.get('precipitation', 0),
                'pressure': round(current.get('surface_pressure', 1013), 1),
                'uv_index': hourly.get('uv_index', [3])[0] if hourly.get('uv_index') else 3
            }
        
        return {
            'temperature': 28,
            'humidity': 65,
            'wind_speed': 10,
            'precipitation': 0,
            'pressure': 1013,
            'uv_index': 3
        }
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return {
            'temperature': 28,
            'humidity': 65,
            'wind_speed': 10,
            'precipitation': 0,
            'pressure': 1013,
            'uv_index': 3
        }
