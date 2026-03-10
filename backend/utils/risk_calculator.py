import numpy as np

def normalize(value, min_val, max_val):
    """Normalize value between 0 and 100"""
    if max_val == min_val:
        return 50
    return ((value - min_val) / (max_val - min_val)) * 100

def calculate_risk_score(pm25, temperature, humidity, wind_speed=10, pressure=1013):
    """
    Calculate environmental risk score
    Risk Score = 0.3 × PM2.5 + 0.25 × Temperature + 0.2 × Humidity + 0.15 × Wind Speed + 0.1 × Pressure
    """
    # Normalize parameters
    pollution_score = normalize(pm25, 0, 100)
    temp_score = normalize(abs(temperature - 20), 0, 30)
    humidity_score = normalize(abs(humidity - 50), 0, 50)
    wind_score = normalize(wind_speed, 0, 50)
    pressure_score = normalize(abs(pressure - 1013), 0, 50)
    
    # Calculate weighted risk score
    risk_score = (
        0.30 * pollution_score +
        0.25 * temp_score +
        0.20 * humidity_score +
        0.15 * wind_score +
        0.10 * pressure_score
    )
    
    # Ensure score is between 0 and 100
    risk_score = np.clip(risk_score, 0, 100)
    
    # Determine risk level
    if risk_score <= 30:
        risk_level = 'Low'
    elif risk_score <= 60:
        risk_level = 'Medium'
    else:
        risk_level = 'High'
    
    return round(risk_score, 2), risk_level
