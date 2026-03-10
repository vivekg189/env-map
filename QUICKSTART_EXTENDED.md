# Quick Start Guide - Extended Features

## 🎯 What's New?

Your AI Environmental Risk Map Platform now includes 5 innovative features:

1. **Eco-Friendly Route Finder** - Find least polluted routes
2. **AI Risk Prediction** - 7-day forecasting
3. **Safety Score System** - 0-100 safety ratings
4. **Citizen Reporting** - Report environmental issues
5. **Alert System** - Real-time risk alerts

---

## 🚀 Getting Started

### Step 1: Start Backend
```bash
cd backend
venv\Scripts\activate
python app.py
```
Backend runs on: http://localhost:5000

### Step 2: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

---

## 🎮 Using New Features

### 1. Dashboard (Enhanced)
- View **Safety Score** alongside Risk Score
- See **Environmental Alerts** panel
- Monitor real-time statistics

### 2. Eco Route Finder
**Navigation:** Click "Eco Route" in menu

**How to use:**
1. Enter start location (latitude, longitude)
2. Enter destination (latitude, longitude)
3. Click "Find Eco Route"
4. View route on map with pollution levels

**Example:**
- Start: 40.7128, -74.0060 (New York)
- End: 34.0522, -118.2437 (Los Angeles)

### 3. Predictions
**Navigation:** Click "Predictions" in menu

**Features:**
- View current safety score
- See 7-day risk forecast
- Understand AI model inputs

### 4. Citizen Reports
**Navigation:** Click "Reports" in menu

**How to report:**
1. Select issue type (Air Pollution, Water Pollution, etc.)
2. Write description
3. Click on map to select location
4. Submit report

**View reports:**
- All reports appear as markers on map
- Click markers to see details

### 5. Risk Map (Enhanced)
**Navigation:** Click "Risk Map" in menu

**New features:**
- Safety scores in location popups
- Citizen reports overlay
- Enhanced location details

---

## 📊 API Testing

Test new endpoints using browser or Postman:

### Eco Route
```
http://localhost:5000/api/eco-route?start_lat=40.7128&start_lon=-74.0060&end_lat=34.0522&end_lon=-118.2437
```

### Alerts
```
http://localhost:5000/api/alerts
```

### Safety Score
```
http://localhost:5000/api/safety-score?lat=40.7128&lon=-74.0060
```

### Reports (GET)
```
http://localhost:5000/api/reports
```

---

## 🎨 Navigation Menu

Your app now has 6 pages:

1. **Dashboard** - Overview with alerts
2. **Risk Map** - Interactive map with safety scores
3. **Analytics** - Historical trends
4. **Eco Route** - Route finder (NEW)
5. **Predictions** - AI forecasting (NEW)
6. **Reports** - Citizen reporting (NEW)

---

## 💡 Tips

### For Best Results:
- Allow location access for accurate data
- Wait for data to load on first visit
- Submit reports to see them on map
- Check alerts panel regularly

### Understanding Scores:
- **Risk Score:** 0-100 (Lower is better)
  - 0-30: Low Risk (Green)
  - 31-60: Medium Risk (Yellow)
  - 61-100: High Risk (Red)

- **Safety Score:** 0-100 (Higher is better)
  - 70-100: Safe (Green)
  - 40-69: Moderate (Yellow)
  - 0-39: Unsafe (Red)

---

## 🔧 Troubleshooting

### Backend Issues:
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check if port 5000 is free
netstat -ano | findstr :5000
```

### Frontend Issues:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Database Issues:
- Database auto-creates on first run
- Located at: `backend/environmental_data.db`
- Delete and restart to reset

---

## 📱 Mobile Responsive

All new features are mobile-friendly:
- Responsive layouts
- Touch-friendly maps
- Optimized forms

---

## 🎯 Next Steps

1. **Explore Dashboard** - See safety scores and alerts
2. **Try Eco Route** - Find a clean route
3. **Submit Report** - Report an environmental issue
4. **Check Predictions** - View AI forecasts
5. **Monitor Alerts** - Stay informed about risks

---

## 📞 Support

For issues or questions:
- Check FEATURES.md for detailed documentation
- Review API endpoints at http://localhost:5000
- Inspect browser console for errors

---

## ✅ Feature Checklist

- [x] Eco-Friendly Route Finder
- [x] AI Environmental Risk Prediction
- [x] Environmental Safety Score
- [x] Citizen Environmental Reporting
- [x] Environmental Alerts System
- [x] Dashboard Integration
- [x] Map Enhancements
- [x] Responsive Design

---

**Enjoy your enhanced Environmental Risk Map Platform! 🌍**
