import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherAPI = {
  searchLocation: (location) => {
    return api.get(`/search-location?location=${location}`);
  },

  getWeather: (lat, lon) => {
    return api.get(`/weather?lat=${lat}&lon=${lon}`);
  },

  getWeatherDescription: (code) => {
    return api.get(`/weather-description/${code}`);
  },
};

export default api;