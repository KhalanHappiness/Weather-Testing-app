import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { weatherAPI } from '../services/weatherAPI';
import 'leaflet/dist/leaflet.css';

function KenyaWeatherMap() {
  const [weatherPoints, setWeatherPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Major cities and towns across Kenya with their coordinates
  const kenyaLocations = [
    { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
    { name: 'Mombasa', lat: -4.0435, lon: 39.6682 },
    { name: 'Kisumu', lat: -0.0917, lon: 34.7680 },
    { name: 'Nakuru', lat: -0.3031, lon: 36.0800 },
    { name: 'Eldoret', lat: 0.5143, lon: 35.2698 },
    { name: 'Thika', lat: -1.0332, lon: 37.0690 },
    { name: 'Malindi', lat: -3.2167, lon: 40.1167 },
    { name: 'Garissa', lat: -0.4536, lon: 39.6401 },
    { name: 'Kitale', lat: 1.0167, lon: 35.0000 },
    { name: 'Machakos', lat: -1.5177, lon: 37.2634 },
    { name: 'Nyeri', lat: -0.4197, lon: 36.9470 },
    { name: 'Meru', lat: 0.0469, lon: 37.6500 },
    { name: 'Kakamega', lat: 0.2827, lon: 34.7519 },
    { name: 'Lamu', lat: -2.2717, lon: 40.9020 },
    { name: 'Lodwar', lat: 3.1167, lon: 35.5986 },
    { name: 'Mandera', lat: 3.9366, lon: 41.8550 },
    { name: 'Wajir', lat: 1.7471, lon: 40.0573 },
    { name: 'Marsabit', lat: 2.3284, lon: 37.9908 },
    { name: 'Embu', lat: -0.5310, lon: 37.4575 },
    { name: 'Kericho', lat: -0.3676, lon: 35.2839 },
  ];

  useEffect(() => {
    fetchAllWeather();
  }, []);

  const fetchAllWeather = async () => {
    setLoading(true);
    const weatherData = [];

    // Fetch weather for all locations (in batches to avoid overwhelming the API)
    for (const location of kenyaLocations) {
      try {
        const response = await weatherAPI.getWeather(location.lat, location.lon);
        weatherData.push({
          ...location,
          weather: response.data.current
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching weather for ${location.name}:`, error);
      }
    }

    setWeatherPoints(weatherData);
    setLoading(false);
  };

  const getTemperatureColor = (temp) => {
    // Color gradient based on temperature
    if (temp >= 35) return '#dc2626'; // Hot - Red
    if (temp >= 30) return '#f97316'; // Warm - Orange
    if (temp >= 25) return '#fbbf24'; // Mild - Yellow
    if (temp >= 20) return '#84cc16'; // Cool - Light Green
    if (temp >= 15) return '#10b981'; // Cold - Green
    return '#3b82f6'; // Very Cold - Blue
  };

  const getWeatherEmoji = (code) => {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Kenya Weather Distribution
        </h3>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather data across Kenya...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Kenya Weather Distribution
        </h3>
        <button
          onClick={fetchAllWeather}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Temperature Legend */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-700 mb-2">Temperature Scale</div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>&lt;15°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <span>15-20°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#84cc16' }}></div>
            <span>20-25°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>
            <span>25-30°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
            <span>30-35°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
            <span>&gt;35°C</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[500px] rounded-lg overflow-hidden border-2 border-gray-200">
        <MapContainer
          center={[0.0236, 37.9062]} // Center of Kenya
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {weatherPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.lat, point.lon]}
              radius={12}
              fillColor={getTemperatureColor(point.weather.temperature)}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="text-center p-2" style={{ minWidth: '150px' }}>
                  <div className="text-xl mb-2">
                    {getWeatherEmoji(point.weather.weather_code)}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{point.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-xl" style={{ color: getTemperatureColor(point.weather.temperature) }}>
                      {point.weather.temperature}°C
                    </div>
                    <div className="text-gray-600">
                      💧 Humidity: {point.weather.humidity}%
                    </div>
                    <div className="text-gray-600">
                      🌧️ Precipitation: {point.weather.precipitation} mm
                    </div>
                    <div className="text-gray-600">
                      💨 Wind: {point.weather.wind_speed} km/h
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600">Locations</div>
          <div className="text-2xl font-bold text-blue-600">{weatherPoints.length}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600">Hottest</div>
          <div className="text-2xl font-bold text-red-600">
            {Math.max(...weatherPoints.map(p => p.weather.temperature)).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600">Coolest</div>
          <div className="text-2xl font-bold text-green-600">
            {Math.min(...weatherPoints.map(p => p.weather.temperature)).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600">Avg Temp</div>
          <div className="text-2xl font-bold text-purple-600">
            {(weatherPoints.reduce((sum, p) => sum + p.weather.temperature, 0) / weatherPoints.length).toFixed(1)}°C
          </div>
        </div>
      </div>
    </div>
  );
}

export default KenyaWeatherMap;