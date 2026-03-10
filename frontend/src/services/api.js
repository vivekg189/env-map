import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getAirQuality = (lat, lon) => 
  axios.get(`${API_BASE_URL}/air-quality?lat=${lat}&lon=${lon}`);

export const getWeather = (lat, lon) => 
  axios.get(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);

export const getEnvironmentData = (lat, lon) => 
  axios.get(`${API_BASE_URL}/environment-data?lat=${lat}&lon=${lon}`);

export const getRiskScore = (lat, lon) => 
  axios.get(`${API_BASE_URL}/risk-score?lat=${lat}&lon=${lon}`);

export const getPrediction = () => 
  axios.get(`${API_BASE_URL}/prediction`);

export const getAnalyticsData = (range, lat, lon) => 
  axios.get(`${API_BASE_URL}/analytics-data?range=${range}&lat=${lat}&lon=${lon}`);

export const getHistorical = (hours = 3, lat = null, lon = null) => {
  const params = new URLSearchParams({ hours: hours.toString() });
  if (lat && lon) {
    params.append('lat', lat.toString());
    params.append('lon', lon.toString());
  }
  return axios.get(`${API_BASE_URL}/historical?${params}`);
};

export const getMapData = () => 
  axios.get(`${API_BASE_URL}/map-data`);

export const getEcoRoute = (startLat, startLon, endLat, endLon) => 
  axios.get(`${API_BASE_URL}/eco-route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);

export const getAlerts = (lat, lon) => 
  axios.get(`${API_BASE_URL}/alerts?lat=${lat}&lon=${lon}`);

export const getReports = () => 
  axios.get(`${API_BASE_URL}/reports`);

export const submitReport = (data) => 
  axios.post(`${API_BASE_URL}/reports`, data);

export const getSafetyScore = (lat, lon) => 
  axios.get(`${API_BASE_URL}/safety-score?lat=${lat}&lon=${lon}`);

export const getNearbyRiskMap = (lat, lon) => 
  axios.get(`${API_BASE_URL}/nearby-risk-map?lat=${lat}&lon=${lon}`);


export const getAIHealthRisk = (data) => 
  axios.post(`${API_BASE_URL}/ai-health-risk`, data);

export const getEnvironmentAdvisor = (lat, lon) => 
  axios.post(`${API_BASE_URL}/environment-advisor`, { latitude: lat, longitude: lon });

export const getCleanAirZones = (lat, lon) => 
  axios.get(`${API_BASE_URL}/clean-air-zones?lat=${lat}&lon=${lon}`);

export const getPollutionHotspots = (lat, lon) => 
  axios.get(`${API_BASE_URL}/pollution-hotspots?lat=${lat}&lon=${lon}`);
