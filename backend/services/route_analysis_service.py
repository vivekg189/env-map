from services.openmeteo_air_service import fetch_air_quality_openmeteo
from services.weather_service import fetch_weather
import math

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in km"""
    return math.sqrt((lat2-lat1)**2 + (lon2-lon1)**2) * 111

def sample_route_points(coordinates, sample_distance_km=20):
    """Sample fewer points along route for faster processing"""
    if len(coordinates) < 2:
        return coordinates
    
    # Sample only start, middle, and end points for speed
    sampled = [
        coordinates[0],
        coordinates[len(coordinates)//2],
        coordinates[-1]
    ]
    
    return sampled

def calculate_route_pollution(coordinates):
    """Calculate average pollution along route - optimized"""
    sampled_points = sample_route_points(coordinates, sample_distance_km=20)
    
    pm25_values = []
    
    for lat, lon in sampled_points:
        try:
            air_data = fetch_air_quality_openmeteo(lat, lon)
            pm25_values.append(air_data['pm25'])
        except:
            pm25_values.append(30)
    
    if pm25_values:
        return round(sum(pm25_values) / len(pm25_values), 2)
    return 30

def calculate_route_risk(coordinates):
    """Calculate environmental risk - optimized with fewer samples"""
    sampled_points = sample_route_points(coordinates, sample_distance_km=20)
    
    risk_scores = []
    
    for lat, lon in sampled_points:
        try:
            air_data = fetch_air_quality_openmeteo(lat, lon)
            
            # Simplified risk calculation
            pm25_score = min((air_data['pm25'] / 100) * 100, 100)
            risk = pm25_score * 0.7 + 30  # Weighted towards pollution
            
            risk_scores.append(risk)
        except:
            risk_scores.append(50)
    
    if risk_scores:
        return round(sum(risk_scores) / len(risk_scores), 2)
    return 50

def analyze_routes(routes):
    """Analyze routes quickly with minimal API calls"""
    analyzed = []
    
    for route in routes:
        avg_pollution = calculate_route_pollution(route['coordinates'])
        risk_score = calculate_route_risk(route['coordinates'])
        
        analyzed.append({
            'coordinates': route['coordinates'],
            'distance': route['distance'],
            'duration': route['duration'],
            'avg_pm25': avg_pollution,
            'risk_score': risk_score
        })
    
    if not analyzed:
        return []
    
    # Always return both routes if available
    if len(analyzed) >= 2:
        # Sort by risk
        sorted_by_risk = sorted(analyzed, key=lambda x: x['risk_score'])
        
        # Eco route (lowest risk)
        eco_route = sorted_by_risk[0].copy()
        eco_route['type'] = 'eco'
        eco_route['label'] = 'Low Risk Route'
        
        # Second route
        other_route = sorted_by_risk[1].copy()
        other_route['type'] = 'shortest'
        other_route['label'] = 'Alternative Route'
        
        return [eco_route, other_route]
    else:
        # Only one route available
        analyzed[0]['type'] = 'eco'
        analyzed[0]['label'] = 'Recommended Route'
        return analyzed
