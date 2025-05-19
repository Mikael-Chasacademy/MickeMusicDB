import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUrl, getUserPlaylists, setAccessToken } from "../lib/apifetch";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hämta spellistor med React Query
  const {
    data: playlists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: getUserPlaylists,
    enabled: isAuthenticated, // Kör bara när användaren är inloggad
  });

  useEffect(() => {
    // Kontrollera om vi har en access token i localStorage
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Välkommen till Musikbiblioteket</h1>
          <button onClick={handleLogin} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
            Logga in med Spotify
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Laddar spellistor...</p>
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
        <h1 className="text-3xl font-bold mb-6">Dina Spellistor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists?.items?.map((playlist) => (
            <div key={playlist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {playlist.images[0] && <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
                <p className="text-gray-600">{playlist.tracks.total} låtar</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
