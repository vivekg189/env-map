import requests

def fetch_air_quality_openmeteo(latitude, longitude):
    """Fetch air quality from Open-Meteo Air Quality API"""
    try:
        url = "https://air-quality-api.open-meteo.com/v1/air-quality"
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'current': 'pm2_5,pm10'
        }
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            current = data.get('current', {})
            return {
                'pm25': round(current.get('pm2_5', 25), 1),
                'pm10': round(current.get('pm10', 50), 1)
            }
    except Exception as e:
        print(f"Error fetching air quality: {e}")
    
    return {'pm25': 25, 'pm10': 50}
