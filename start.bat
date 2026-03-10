@echo off
echo Starting Environmental Risk Map Platform...
echo.

echo Installing Backend Dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt
echo.

echo Starting Flask Backend Server...
start cmd /k "cd /d %cd% && venv\Scripts\activate && python app.py"
cd ..

echo.
echo Starting React Frontend...
cd frontend
start cmd /k "cd /d %cd% && npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
