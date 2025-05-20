import { useQuery } from "@tanstack/react-query";
import { getTopTracks, searchTracks } from "../lib/apifetch";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: topTracks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topTracks"],
    queryFn: getTopTracks,
  });

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchTracks(searchQuery),
    enabled: isSearching && searchQuery.length > 0,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Laddar populära låtar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Ett fel uppstod: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sök efter: Låtar, Artister eller Album</h1>
        
        {/* Sökruta */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök efter låtar, artister eller album..."
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sök
            </button>
          </div>
        </form>

        {/* Sökresultat */}
        {isSearching && (
          <div className="mb-8">
            {isSearchLoading ? (
              <p className="text-xl">Söker...</p>
            ) : searchError ? (
              <p className="text-xl text-red-500">Ett fel uppstod vid sökning: {searchError.message}</p>
            ) : searchResults && (
              <div>
                {/* Låtar */}
                {searchResults.tracks?.items?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Låtar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.tracks.items.map((track) => (
                        <div key={track.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          {track.album.images[0] && (
                            <img 
                              src={track.album.images[0].url} 
                              alt={track.name} 
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{track.name}</h3>
                            <p className="text-gray-600">{track.artists.map(artist => artist.name).join(", ")}</p>
                            <p className="text-gray-500 text-sm mt-1">Album: {track.album.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artister */}
                {searchResults.artists?.items?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Artister</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.artists.items.map((artist) => (
                        <div key={artist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          {artist.images[0] && (
                            <img 
                              src={artist.images[0].url} 
                              alt={artist.name} 
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                            <p className="text-gray-600">{artist.genres?.join(", ") || "Inga genrer tillgängliga"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Album */}
                {searchResults.albums?.items?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Album</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.albums.items.map((album) => (
                        <div key={album.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          {album.images[0] && (
                            <img 
                              src={album.images[0].url} 
                              alt={album.name} 
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{album.name}</h3>
                            <p className="text-gray-600">{album.artists.map(artist => artist.name).join(", ")}</p>
                            <p className="text-gray-500 text-sm mt-1">{album.release_date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Populära låtar (visas bara när vi inte söker) */}
        {!isSearching && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Populära Låtar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topTracks?.tracks?.items?.map((item) => (
                <div key={item.track.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {item.track.album.images[0] && (
                    <img 
                      src={item.track.album.images[0].url} 
                      alt={item.track.name} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.track.name}</h3>
                    <p className="text-gray-600">{item.track.artists.map(artist => artist.name).join(", ")}</p>
                    <p className="text-gray-500 text-sm mt-1">Album: {item.track.album.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
    </div>
  );
}
