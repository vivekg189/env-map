import requests

def fetch_nearby_cities(latitude, longitude, radius_km=100):
    """Fetch nearby cities using Overpass API"""
    try:
        overpass_url = "https://overpass-api.de/api/interpreter"
        radius_m = radius_km * 1000
        
        query = f"""
        [out:json];
        (
          node["place"~"city|town"]["name"](around:{radius_m},{latitude},{longitude});
        );
        out body;
        """
        
        response = requests.post(overpass_url, data={'data': query}, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            cities = []
            seen = set()
            
            for element in data.get('elements', []):
                name = element.get('tags', {}).get('name')
                lat = element.get('lat')
                lon = element.get('lon')
                
                if name and lat and lon and name not in seen:
                    cities.append({
                        'name': name,
                        'lat': lat,
                        'lon': lon
                    })
                    seen.add(name)
            
            return cities[:15]  # Limit to 15 cities
        
        return []
    except Exception as e:
        print(f"Error fetching nearby cities: {e}")
        return []
