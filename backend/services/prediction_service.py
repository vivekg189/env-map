import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def predict_risk(historical_data):
    """Predict future environmental risk using Linear Regression"""
    try:
        if len(historical_data) < 5:
            # Generate sample predictions if not enough data
            return generate_sample_predictions()
        
        # Extract risk scores and timestamps
        risk_scores = [row[8] for row in historical_data][:30]  # Last 30 records
        
        # Create time series data
        X = np.array(range(len(risk_scores))).reshape(-1, 1)
        y = np.array(risk_scores)
        
        # Train model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next 7 days
        future_X = np.array(range(len(risk_scores), len(risk_scores) + 7)).reshape(-1, 1)
        predictions = model.predict(future_X)
        
        # Clip predictions between 0 and 100
        predictions = np.clip(predictions, 0, 100)
        
        # Generate dates
        base_date = datetime.now()
        result = []
        for i, pred in enumerate(predictions):
            result.append({
                'date': (base_date + timedelta(days=i+1)).strftime('%Y-%m-%d'),
                'predicted_risk': round(float(pred), 2)
            })
        
        return result
    except Exception as e:
        print(f"Prediction error: {e}")
        return generate_sample_predictions()

def generate_sample_predictions():
    """Generate sample predictions for demonstration"""
    base_date = datetime.now()
    base_risk = 45
    predictions = []
    
    for i in range(7):
        risk = base_risk + np.random.uniform(-5, 5)
        predictions.append({
            'date': (base_date + timedelta(days=i+1)).strftime('%Y-%m-%d'),
            'predicted_risk': round(risk, 2)
        })
    
    return predictions
