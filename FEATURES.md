# AI Environmental Risk Map Platform - Extended Features

## 🚀 New Features Added

### 1. 🌿 Eco-Friendly Route Finder
Find the least polluted route between two locations.

**Features:**
- Input start and destination coordinates
- Visual route display on interactive map
- Average pollution level calculation
- Risk level assessment (Low/Medium/High)
- Color-coded route based on pollution

**API Endpoint:** `GET /api/eco-route`

**Parameters:**
- `start_lat`, `start_lon` - Starting coordinates
- `end_lat`, `end_lon` - Destination coordinates

---

### 2. 🤖 AI Environmental Risk Prediction
Predict future environmental risk levels using machine learning.

**Features:**
- 7-day risk forecasting
- Linear Regression model
- Historical data analysis
- Interactive prediction charts

**API Endpoint:** `GET /api/prediction`

**Model Inputs:**
- PM2.5 levels
- PM10 levels
- Temperature
- Humidity

---

### 3. 🛡️ Environmental Safety Score
Calculate location safety score (0-100).

**Formula:** `Safety Score = 100 - Risk Score`

**Features:**
- Real-time safety calculation
- Display on dashboard
- Map marker integration
- Color-coded indicators

**API Endpoint:** `GET /api/safety-score`

**Response:**
```json
{
  "location": "New York",
  "pm25": 45,
  "temperature": 22,
  "risk_score": 58,
  "safety_score": 42,
  "risk_level": "Medium"
}
```

---

### 4. 📢 Citizen Environmental Reporting
Allow users to report environmental issues.

**Features:**
- Interactive map-based location selection
- Multiple issue types (Air/Water Pollution, Garbage, etc.)
- Description and image upload
- View all reports on map
- Real-time report tracking

**API Endpoints:**
- `POST /api/reports` - Submit report
- `GET /api/reports` - Get all reports

**Database Table:** `reports`
- id, type, description, latitude, longitude, image_url, timestamp

---

### 5. 🚨 Environmental Alerts System
Automatic alerts for high-risk locations.

**Features:**
- Real-time monitoring
- Critical alerts (Risk > 70)
- Warning alerts (Risk > 60)
- Dashboard integration
- Auto-refresh every 60 seconds

**API Endpoint:** `GET /api/alerts`

**Alert Levels:**
- **Critical:** Risk Score > 70 (Red)
- **Warning:** Risk Score > 60 (Yellow)

---

## 📁 Project Structure

```
map/
├── backend/
│   ├── models/
│   │   └── database.py (Extended with reports table)
│   ├── routes/
│   │   └── api_routes.py (New endpoints added)
│   ├── services/
│   │   ├── air_quality_service.py
│   │   ├── weather_service.py
│   │   ├── prediction_service.py
│   │   ├── eco_route_service.py (NEW)
│   │   └── alert_service.py (NEW)
│   └── app.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js (Updated)
│   │   │   ├── AlertPanel.js (NEW)
│   │   │   ├── SafetyScoreCard.js (NEW)
│   │   │   └── PredictionChart.js (NEW)
│   │   ├── pages/
│   │   │   ├── Dashboard.js (Updated)
│   │   │   ├── RiskMap.js (Updated)
│   │   │   ├── Analytics.js
│   │   │   ├── EcoRoutePage.js (NEW)
│   │   │   ├── PredictionPage.js (NEW)
│   │   │   └── ReportsPage.js (NEW)
│   │   ├── services/
│   │   │   └── api.js (Extended)
│   │   └── App.js (Updated routing)
```

---

## 🎯 Complete Feature List

### Dashboard
- ✅ Real-time environmental statistics
- ✅ Risk score display
- ✅ **Safety score display (NEW)**
- ✅ **Environmental alerts panel (NEW)**
- ✅ 7-day prediction chart

### Risk Map
- ✅ Interactive map with markers
- ✅ Color-coded risk zones
- ✅ **Safety scores in popups (NEW)**
- ✅ **Citizen reports overlay (NEW)**

### Analytics
- ✅ Historical trends
- ✅ Pollution charts
- ✅ Temperature analysis

### Eco Route (NEW)
- ✅ Route input form
- ✅ Pollution-optimized routing
- ✅ Visual route display
- ✅ Risk assessment

### Predictions (NEW)
- ✅ AI risk forecasting
- ✅ Safety score card
- ✅ Prediction charts
- ✅ Model information

### Reports (NEW)
- ✅ Issue reporting form
- ✅ Map-based location selection
- ✅ Report history
- ✅ Issue type categorization

---

## 🔧 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/air-quality` | GET | Air quality data |
| `/api/weather` | GET | Weather data |
| `/api/environment-data` | GET | Combined environmental data |
| `/api/risk-score` | GET | Calculate risk score |
| `/api/prediction` | GET | AI predictions |
| `/api/historical` | GET | Historical data |
| `/api/map-data` | GET | Multi-location map data |
| `/api/eco-route` | GET | Eco-friendly route |
| `/api/alerts` | GET | Environmental alerts |
| `/api/reports` | GET/POST | Citizen reports |
| `/api/safety-score` | GET | Location safety score |

---

## 🚀 Running the Application

### Backend
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

### Frontend
```bash
cd frontend
npm start
```

---

## 🎨 UI Components

### New Components
1. **AlertPanel** - Displays environmental alerts
2. **SafetyScoreCard** - Shows safety score with visual indicator
3. **PredictionChart** - Line chart for risk predictions

### New Pages
1. **EcoRoutePage** - Route finder interface
2. **PredictionPage** - AI predictions dashboard
3. **ReportsPage** - Citizen reporting system

---

## 📊 Database Schema

### environmental_data (Existing)
- id, latitude, longitude, location
- pm25, pm10, temperature, humidity
- risk_score, risk_level, timestamp

### reports (NEW)
- id, type, description
- latitude, longitude
- image_url, timestamp

---

## 🎯 Risk Scoring

**Risk Score Formula:**
```
Risk = 0.4 × PM2.5 + 0.3 × Temperature + 0.2 × Humidity + 0.1 × Population
```

**Safety Score Formula:**
```
Safety = 100 - Risk Score
```

**Risk Levels:**
- 0-30: Low (Green) → Safety: 70-100
- 31-60: Medium (Yellow) → Safety: 40-69
- 61-100: High (Red) → Safety: 0-39

---

## 🔮 Future Enhancements

- Real-time notifications
- Mobile app integration
- Advanced ML models (LSTM, Random Forest)
- Social media integration
- Government API integration
- Air quality index (AQI) standards
- Multi-language support

---

## 📝 Notes

- All new features integrate seamlessly with existing architecture
- Database automatically creates new tables on first run
- Frontend components are responsive and mobile-friendly
- API endpoints follow RESTful conventions
- Error handling implemented throughout

---

## 🤝 Contributing

This is an extended version of the base Environmental Risk Map Platform with innovative features for environmental monitoring and citizen engagement.
