import sqlite3
import json
from datetime import datetime

class Database:
    def __init__(self, db_name='environmental_data.db'):
        self.db_name = db_name
        self.init_db()
    
    def get_connection(self):
        return sqlite3.connect(self.db_name)
    
    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS environmental_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL,
                longitude REAL,
                location TEXT,
                pm25 REAL,
                pm10 REAL,
                temperature REAL,
                humidity REAL,
                risk_score REAL,
                risk_level TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                description TEXT,
                latitude REAL,
                longitude REAL,
                image_url TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
    
    def insert_data(self, data):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO environmental_data 
            (latitude, longitude, location, pm25, pm10, temperature, humidity, risk_score, risk_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['latitude'], data['longitude'], data['location'],
            data['pm25'], data['pm10'], data['temperature'], data['humidity'],
            data['risk_score'], data['risk_level']
        ))
        conn.commit()
        conn.close()
    
    def get_historical_data(self, limit=100):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM environmental_data ORDER BY timestamp DESC LIMIT ?', (limit,))
        rows = cursor.fetchall()
        conn.close()
        return rows
    
    def insert_report(self, data):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reports (type, description, latitude, longitude, image_url)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['type'], data['description'], data['latitude'], data['longitude'], data.get('image_url', '')))
        conn.commit()
        conn.close()
    
    def get_reports(self, limit=100):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM reports ORDER BY timestamp DESC LIMIT ?', (limit,))
        rows = cursor.fetchall()
        conn.close()
        return rows
