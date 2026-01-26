function ForecastCard({ forecast }) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
      <div className="text-sm text-gray-600 font-semibold mb-2">
        {formatDate(forecast.date)}
      </div>
      <div className="text-4xl mb-2">
        {getWeatherEmoji(forecast.weather_code)}
      </div>
      <div className="flex justify-center gap-3 text-sm">
        <span className="text-red-600 font-semibold">
          ↑ {forecast.temp_max}°C
        </span>
        <span className="text-blue-600 font-semibold">
          ↓ {forecast.temp_min}°C
        </span>
      </div>
      {forecast.precipitation > 0 && (
        <div className="mt-2 text-xs text-blue-600">
          💧 {forecast.precipitation} mm
        </div>
      )}
    </div>
  );
}

export default ForecastCard;
