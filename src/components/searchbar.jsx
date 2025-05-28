import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchTracks } from "../lib/apifetch";
import { SearchNormal1, Add, CloseCircle } from "iconsax-react";

export default function SearchBar({ onTrackSelect }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Sökresultat
  const {
    data: searchResults,
    isLoading: isSearching,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchTracks(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Sök efter låtar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <SearchNormal1
          color="gray"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <CloseCircle color="gray" size={20} />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Sökresultat</h2>
          {isSearching ? (
            <p>Laddar sökresultat...</p>
          ) : searchResults?.tracks?.items?.length > 0 ? (
            <div className="space-y-4">
              {searchResults.tracks.items.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {track.album.images[0] && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        className="w-12 h-12 rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{track.name}</h3>
                      <p className="text-gray-600">{track.artists.map(artist => artist.name).join(", ")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTrackSelect(track)}
                    className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Add color="green" size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Inga resultat hittades</p>
          )}
        </div>
      )}
    </div>
  );
}
