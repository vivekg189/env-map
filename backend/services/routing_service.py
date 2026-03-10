import requests

def decode_polyline(encoded):
    """Decode polyline string to coordinates"""
    coords = []
    index = 0
    lat = 0
    lng = 0
    
    while index < len(encoded):
        b = 0
        shift = 0
        result = 0
        
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break
        
        dlat = ~(result >> 1) if result & 1 else result >> 1
        lat += dlat
        
        shift = 0
        result = 0
        
        while True:
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break
        
        dlng = ~(result >> 1) if result & 1 else result >> 1
        lng += dlng
        
        coords.append([lat * 1e-5, lng * 1e-5])
    
    return coords

def get_real_routes(start_lat, start_lon, end_lat, end_lon):
    """Get real road routes using OSRM API with faster timeout"""
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}"
        params = {
            'overview': 'simplified',
            'geometries': 'polyline',
            'alternatives': 'true'
        }
        
        response = requests.get(url, params=params, timeout=8)
        
        if response.status_code == 200:
            data = response.json()
            routes = []
            
            for route in data.get('routes', [])[:2]:  # Limit to 2 routes
                coords = decode_polyline(route['geometry'])
                
                routes.append({
                    'coordinates': coords,
                    'distance': round(route['distance'] / 1000, 2),
                    'duration': round(route['duration'] / 60, 2)
                })
            
            if routes:
                return routes
                
    except Exception as e:
        print(f"OSRM error: {e}")
    
    return generate_interpolated_route(start_lat, start_lon, end_lat, end_lon)

def generate_interpolated_route(start_lat, start_lon, end_lat, end_lon):
    """Generate interpolated route quickly"""
    import math
    
    lat_diff = end_lat - start_lat
    lon_diff = end_lon - start_lon
    distance = math.sqrt(lat_diff**2 + lon_diff**2) * 111
    
    # Generate fewer points for faster processing
    points = []
    for i in range(21):
        t = i / 20
        lat = start_lat + t * lat_diff
        lon = start_lon + t * lon_diff
        points.append([lat, lon])
    
    alt_points = []
    for i in range(21):
        t = i / 20
        deviation = 0.015 * math.sin(t * math.pi)
        lat = start_lat + t * lat_diff + deviation
        lon = start_lon + t * lon_diff + deviation * 0.5
        alt_points.append([lat, lon])
    
    return [
        {
            'coordinates': points,
            'distance': round(distance, 2),
            'duration': round(distance * 1.5, 2)
        },
        {
            'coordinates': alt_points,
            'distance': round(distance * 1.15, 2),
            'duration': round(distance * 1.7, 2)
        }
    ]
