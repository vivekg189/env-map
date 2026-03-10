import os
import json
from groq import Groq
from services.openmeteo_air_service import fetch_air_quality_openmeteo
from services.weather_service import fetch_weather
from utils.risk_calculator import calculate_risk_score

def get_location_name(lat, lon):
    """Get location name from coordinates"""
    locations = {
        (9.5127, 77.6337): "Madurai, India",
        (40.7128, -74.0060): "New York, USA",
        (34.0522, -118.2437): "Los Angeles, USA",
        (51.5074, -0.1278): "London, UK",
        (48.8566, 2.3522): "Paris, France",
    }
    
    for (loc_lat, loc_lon), name in locations.items():
        if abs(loc_lat - lat) < 0.1 and abs(loc_lon - lon) < 0.1:
            return name
    
    return f"Location ({lat:.2f}, {lon:.2f})"

def generate_advisor_response(lat, lon):
    """Generate environmental advisor response using Groq LLM"""
    
    air_data = fetch_air_quality_openmeteo(lat, lon)
    weather_data = fetch_weather(lat, lon)
    
    risk_score, risk_level = calculate_risk_score(
        air_data['pm25'],
        weather_data['temperature'],
        weather_data['humidity'],
        weather_data['wind_speed'],
        weather_data['pressure']
    )
    
    location_name = get_location_name(lat, lon)
    
    prompt = f"""Location: {location_name}

Environmental Data:
PM2.5: {air_data['pm25']} μg/m³
PM10: {air_data['pm10']} μg/m³
Temperature: {weather_data['temperature']}°C
Humidity: {weather_data['humidity']}%
Wind Speed: {weather_data['wind_speed']} km/h
Pressure: {weather_data['pressure']} hPa

Environmental Risk Score: {risk_score}/100 ({risk_level})

Analyze this environmental situation and provide a JSON response with exactly these fields:
- pollution_sources: string describing likely pollution sources
- recommendations: array of 3 health recommendations
- safe_exposure_time: string with safe outdoor time estimate
- safer_locations: array of 2-3 nearby safer locations

Return ONLY valid JSON, no other text."""

    client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    
    response_text = message.choices[0].message.content.strip()
    
    start_idx = response_text.find('{')
    end_idx = response_text.rfind('}') + 1
    
    if start_idx != -1 and end_idx > start_idx:
        json_str = response_text[start_idx:end_idx]
        ai_response = json.loads(json_str)
    else:
        ai_response = json.loads(response_text)
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "pm25": air_data['pm25'],
        "pm10": air_data['pm10'],
        "temperature": weather_data['temperature'],
        "humidity": weather_data['humidity'],
        "wind_speed": weather_data['wind_speed'],
        "pressure": weather_data['pressure'],
        "location": location_name,
        "pollution_sources": ai_response.get("pollution_sources", ""),
        "recommendations": ai_response.get("recommendations", []),
        "safe_exposure_time": ai_response.get("safe_exposure_time", ""),
        "safer_locations": ai_response.get("safer_locations", [])
    }
