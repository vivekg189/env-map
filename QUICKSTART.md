# Quick Start Guide

## Automated Start (Windows)

Simply double-click `start.bat` to launch both backend and frontend servers automatically.

## Manual Start

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Time Setup

1. Ensure Python 3.8+ is installed
2. Ensure Node.js 14+ is installed
3. Run the automated start script or follow manual steps
4. Wait for both servers to start
5. Browser will automatically open to http://localhost:3000

## Features to Explore

1. **Dashboard** - View current environmental risk score and 7-day predictions
2. **Risk Map** - Interactive map showing risk zones across multiple cities
3. **Analytics** - Historical trends and charts for pollution and temperature

## Troubleshooting

- If port 5000 is busy, change port in `backend/app.py`
- If port 3000 is busy, React will prompt to use another port
- Ensure virtual environment is activated before running Flask
- Clear browser cache if map doesn't load properly
