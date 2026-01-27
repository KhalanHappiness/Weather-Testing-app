import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import { weatherAPI } from './services/weatherAPI';
import { Cloud, MapPin } from 'lucide-react';
import KenyaWeatherMap from './components/KenyaWeatherMap';

function App() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);
    setLocations([]);
    setWeatherData(null);
    setSelectedLocation(null);

    try {
      const response = await weatherAPI.searchLocation(searchTerm);
      
      if (response.data.locations && response.data.locations.length > 0) {
        setLocations(response.data.locations);
        
        // Auto-select first location if only one result
        if (response.data.locations.length === 1) {
          handleLocationSelect(response.data.locations[0]);
        }
      } else {
        setError('No locations found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search location. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setLoading(true);
    setError(null);

    try {
      const response = await weatherAPI.getWeather(
        location.latitude,
        location.longitude
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Cloud className="text-blue-600" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kenya Weather Search
              </h1>
              <p className="text-gray-600">Real-time weather information across Kenya</p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {showMap ? 'Hide Map' : 'Show Country Map'}
            </button>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">

        {showMap && (
          <div className="mb-8">
          
             <KenyaWeatherMap />
          </div>
          )}


        {/* Search Bar */}
        <div className="flex flex-col items-center">
          <SearchBar onSearch={handleSearch} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl w-full">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Location Selection */}
          {locations.length > 1 && !selectedLocation && (
            <div className="mt-8 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select a location:
              </h2>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 text-left transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-600 mt-1" size={20} />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {location.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {location.admin1 && `${location.admin1}, `}
                          {location.country}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Lat: {location.latitude.toFixed(4)}, 
                          Lon: {location.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Weather Display */}
          {selectedLocation && weatherData && (
            <WeatherDisplay 
              location={selectedLocation} 
              weatherData={weatherData} 
            />
          )}

          {/* Welcome Message (when no search has been made) */}
          {!loading && !weatherData && !error && locations.length === 0 && (
            <div className="mt-16 text-center">
              <div className="text-6xl mb-4">🌤️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to Kenya Weather Search
              </h2>
              <p className="text-gray-600 max-w-md">
                Search for any location in Kenya to get current weather conditions 
                and a 7-day forecast.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl mb-2">🌡️</div>
                  <h3 className="font-semibold text-gray-800">Temperature</h3>
                  <p className="text-sm text-gray-600 mt-1">Real-time temperature data</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl mb-2">💧</div>
                  <h3 className="font-semibold text-gray-800">Precipitation</h3>
                  <p className="text-sm text-gray-600 mt-1">Rainfall measurements</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl mb-2">📅</div>
                  <h3 className="font-semibold text-gray-800">7-Day Forecast</h3>
                  <p className="text-sm text-gray-600 mt-1">Week-ahead predictions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Weather data provided by Open-Meteo API</p>
          <p className="mt-1">Built with React & Flask</p>
        </div>
      </footer>
    </div>
  );
}

export default App;