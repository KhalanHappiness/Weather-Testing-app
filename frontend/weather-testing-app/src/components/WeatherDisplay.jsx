import ForecastCard from './ForecastCard';

function WeatherDisplay({ location, weatherData }) {
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

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  };

  if (!weatherData) return null;

  const { current, forecast } = weatherData;

  return (
    <div className="w-full max-w-4xl mt-8">
      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-2xl p-8 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">{location.name}</h2>
            <p className="text-blue-100">{location.admin1}, {location.country}</p>
          </div>
          <div className="text-6xl">
            {getWeatherEmoji(current.weather_code)}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="text-6xl font-bold">
            {current.temperature}°C
          </div>
          <div className="text-xl text-blue-100">
            {getWeatherDescription(current.weather_code)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-400">
          <div>
            <div className="text-blue-200 text-sm">Humidity</div>
            <div className="text-2xl font-semibold">{current.humidity}%</div>
          </div>
          <div>
            <div className="text-blue-200 text-sm">Wind Speed</div>
            <div className="text-2xl font-semibold">{current.wind_speed} km/h</div>
          </div>
          <div>
            <div className="text-blue-200 text-sm">Precipitation</div>
            <div className="text-2xl font-semibold">{current.precipitation} mm</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, index) => (
            <ForecastCard key={index} forecast={day} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;