
@api.route('/clean-air-zones', methods=['GET'])
def get_clean_air_zones():
    """Detect clean air zones near user location - optimized"""
    from services.nearby_cities_service import fetch_nearby_cities
    from services.openmeteo_air_service import fetch_air_quality_openmeteo
    
    lat = float(request.args.get('lat', 40.7128))
    lon = float(request.args.get('lon', -74.0060))
    
    cities = fetch_nearby_cities(lat, lon, radius_km=100)[:5]
    clean_zones = []
    
    for city in cities:
        try:
            air_data = fetch_air_quality_openmeteo(city['lat'], city['lon'])
            weather_data = fetch_weather(city['lat'], city['lon'])
            risk_score, _ = calculate_risk_score(
                air_data['pm25'], weather_data['temperature'],
                weather_data['humidity'], weather_data['wind_speed'],
                weather_data['pressure']
            )
            
            if risk_score < 30:
                clean_zones.append({
                    'city': city['name'],
                    'latitude': city['lat'],
                    'longitude': city['lon'],
                    'risk_score': risk_score,
                    'pm25': air_data['pm25']
                })
        except:
            pass
    
    clean_zones.sort(key=lambda x: x['risk_score'])
    return jsonify({'clean_air_zones': clean_zones[:3]})

@api.route('/pollution-hotspots', methods=['GET'])
def get_pollution_hotspots():
    """Detect pollution hotspots near user location - optimized"""
    from services.nearby_cities_service import fetch_nearby_cities
    from services.openmeteo_air_service import fetch_air_quality_openmeteo
    
    lat = float(request.args.get('lat', 40.7128))
    lon = float(request.args.get('lon', -74.0060))
    
    cities = fetch_nearby_cities(lat, lon, radius_km=100)[:5]
    hotspots = []
    
    for city in cities:
        try:
            air_data = fetch_air_quality_openmeteo(city['lat'], city['lon'])
            weather_data = fetch_weather(city['lat'], city['lon'])
            risk_score, risk_level = calculate_risk_score(
                air_data['pm25'], weather_data['temperature'],
                weather_data['humidity'], weather_data['wind_speed'],
                weather_data['pressure']
            )
            
            if air_data['pm25'] > 80 or risk_score > 70:
                hotspots.append({
                    'city': city['name'],
                    'latitude': city['lat'],
                    'longitude': city['lon'],
                    'pm25': air_data['pm25'],
                    'risk_score': risk_score,
                    'risk_level': risk_level
                })
        except:
            pass
    
    hotspots.sort(key=lambda x: x['risk_score'], reverse=True)
    return jsonify({'pollution_hotspots': hotspots[:3]})
