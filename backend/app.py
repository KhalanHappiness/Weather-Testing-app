from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Using Open-Meteo API (free, no API key needed)
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Weather API is running'}), 200

@app.route('/api/search-location', methods=['GET'])
def search_location():
    """Search for a location to get coordinates"""
    location = request.args.get('location')
    
    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400
    
    try:
        # Search for the location
        params = {
            'name': location,
            'count': 5,
            'language': 'en',
            'format': 'json'
        }
        
        response = requests.get(GEOCODING_URL, params=params)
        data = response.json()
        
        if 'results' not in data or len(data['results']) == 0:
            return jsonify({'error': 'Location not found'}), 404
        
        # Filter for Kenya locations if possible
        kenya_results = [r for r in data['results'] if r.get('country') == 'Kenya']
        results = kenya_results if kenya_results else data['results'][:5]
        
        return jsonify({
            'locations': [{
                'name': r['name'],
                'country': r.get('country', 'Unknown'),
                'admin1': r.get('admin1', ''),
                'latitude': r['latitude'],
                'longitude': r['longitude']
            } for r in results]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data for specific coordinates"""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    try:
        # Get weather data
        params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
            'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
            'timezone': 'Africa/Nairobi',
            'forecast_days': 7
        }
        
        response = requests.get(WEATHER_URL, params=params)
        data = response.json()
        
        # Format the response
        current = data.get('current', {})
        daily = data.get('daily', {})
        
        weather_data = {
            'current': {
                'temperature': current.get('temperature_2m'),
                'humidity': current.get('relative_humidity_2m'),
                'precipitation': current.get('precipitation'),
                'wind_speed': current.get('wind_speed_10m'),
                'weather_code': current.get('weather_code'),
                'time': current.get('time')
            },
            'forecast': []
        }
        
        # Add 7-day forecast
        if daily and 'time' in daily:
            for i in range(len(daily['time'])):
                weather_data['forecast'].append({
                    'date': daily['time'][i],
                    'temp_max': daily['temperature_2m_max'][i],
                    'temp_min': daily['temperature_2m_min'][i],
                    'precipitation': daily['precipitation_sum'][i],
                    'weather_code': daily['weather_code'][i]
                })
        
        return jsonify(weather_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Weather code descriptions
@app.route('/api/weather-description/<int:code>', methods=['GET'])
def get_weather_description(code):
    """Get description for weather code"""
    descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    }
    
    return jsonify({
        'code': code,
        'description': descriptions.get(code, 'Unknown')
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Using port 5001 to avoid conflict