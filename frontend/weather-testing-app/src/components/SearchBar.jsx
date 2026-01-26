import { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location in Kenya (e.g., Nairobi, Mombasa, Kisumu)..."
          className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none shadow-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Search size={24} />
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;