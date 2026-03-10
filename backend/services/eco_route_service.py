import math
from services.air_quality_service import fetch_air_quality

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points"""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def find_eco_route(start_lat, start_lon, end_lat, end_lon):
    """Find eco-friendly route with lowest pollution"""
    segments = 5
    route_points = []
    pollution_levels = []
    
    for i in range(segments + 1):
        t = i / segments
        lat = start_lat + (end_lat - start_lat) * t
        lon = start_lon + (end_lon - start_lon) * t
        
        air_data = fetch_air_quality(lat, lon)
        route_points.append({'lat': lat, 'lon': lon})
        pollution_levels.append(air_data['pm25'])
    
    avg_pollution = sum(pollution_levels) / len(pollution_levels)
    risk_level = 'Low' if avg_pollution < 30 else 'Medium' if avg_pollution < 60 else 'High'
    
    return {
        'route': route_points,
        'average_pollution': round(avg_pollution, 2),
        'risk_level': risk_level,
        'pollution_levels': pollution_levels
    }
