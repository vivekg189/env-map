def generate_alerts(map_data):
    """Generate alerts for high-risk locations"""
    alerts = []
    
    for location in map_data:
        if location['risk_score'] > 70:
            alerts.append({
                'location': location.get('name', location.get('location', 'Unknown')),
                'message': f"High pollution detected - PM2.5: {location['pm25']}",
                'risk_score': location['risk_score'],
                'severity': 'critical'
            })
        elif location['risk_score'] > 60:
            alerts.append({
                'location': location.get('name', location.get('location', 'Unknown')),
                'message': f"Elevated pollution levels - PM2.5: {location['pm25']}",
                'risk_score': location['risk_score'],
                'severity': 'warning'
            })
    
    return alerts
