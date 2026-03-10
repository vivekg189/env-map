import os
from groq import Groq

def generate_health_advice(user_profile, environmental_data, risk_score, risk_level):
    """Generate personalized health advice using Groq AI"""
    
    # Construct prompt
    prompt = f"""You are a health advisor analyzing environmental health risks.

User Health Profile:
- Age: {user_profile['age']}
- Health Condition: {user_profile['condition']}
- Activity Level: {user_profile['activity']}
- Planned Exposure: {user_profile['exposure_time']} minutes

Current Environmental Conditions:
- PM2.5: {environmental_data['pm25']} μg/m³
- Temperature: {environmental_data['temperature']}°C
- Humidity: {environmental_data['humidity']}%
- Wind Speed: {environmental_data['wind_speed']} km/h
- Pressure: {environmental_data['pressure']} hPa
- Environmental Risk Score: {risk_score} ({risk_level})

Task: Provide a brief health risk assessment (2-3 sentences) and specific safety recommendations for this person. Be concise and actionable."""

    # Try Groq API
    try:
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_completion_tokens=300,
            top_p=1,
            stream=False
        )
        
        return completion.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Groq API error: {e}")
        return generate_rule_based_advice(user_profile, environmental_data, risk_score, risk_level)

def generate_rule_based_advice(user_profile, env_data, risk_score, risk_level):
    """Generate health advice using rules when AI is unavailable"""
    
    condition = user_profile['condition'].lower()
    pm25 = env_data['pm25']
    temp = env_data['temperature']
    
    advice = []
    recommendations = []
    
    # PM2.5 based advice
    if pm25 > 75:
        advice.append(f"Very high PM2.5 levels ({pm25} μg/m³) pose significant health risks.")
        recommendations.append("Avoid outdoor activities")
        recommendations.append("Stay indoors with air purification")
    elif pm25 > 50:
        advice.append(f"Elevated PM2.5 levels ({pm25} μg/m³) may affect sensitive individuals.")
        recommendations.append("Limit outdoor exposure to under 30 minutes")
        recommendations.append("Wear N95 mask if going outside")
    else:
        advice.append(f"PM2.5 levels ({pm25} μg/m³) are within acceptable range.")
    
    # Condition-specific advice
    if condition == 'asthma':
        advice.append("Your asthma condition increases sensitivity to air pollution.")
        recommendations.append("Keep rescue inhaler accessible")
        if pm25 > 50:
            recommendations.append("Avoid strenuous outdoor activities")
    elif condition == 'heart disease':
        advice.append("Heart conditions require extra caution in polluted environments.")
        if pm25 > 50:
            recommendations.append("Avoid physical exertion outdoors")
    elif condition == 'child' or condition == 'elderly':
        advice.append("Children and elderly are more vulnerable to environmental pollutants.")
        if pm25 > 50:
            recommendations.append("Minimize outdoor exposure")
    
    # Temperature advice
    if temp > 35:
        advice.append(f"High temperature ({temp}°C) increases heat stress risk.")
        recommendations.append("Stay hydrated and seek shade")
    elif temp < 10:
        advice.append(f"Low temperature ({temp}°C) may affect respiratory health.")
        recommendations.append("Dress warmly if going outside")
    
    # Activity level
    if user_profile['activity'] == 'exercise' and pm25 > 50:
        recommendations.append("Postpone intense exercise to when air quality improves")
    
    result = " ".join(advice) + "\n\nRecommendations:\n• " + "\n• ".join(recommendations)
    return result
