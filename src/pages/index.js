import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUrl, getUserPlaylists, setAccessToken, fetchWithAuth, createPlaylist, logout, deletePlaylist } from "../lib/apifetch";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/router";
import { Trash } from "iconsax-react";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const router = useRouter();

  // Hämta användarens profil
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchWithAuth("/me"),
    enabled: isAuthenticated,
  });

  // Hämta spellistor med React Query
  const {
    data: playlists,
    isLoading,
    error,
    refetch: refetchPlaylists,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: getUserPlaylists,
    enabled: isAuthenticated,
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

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!userProfile?.id || !newPlaylistName) return;

    setIsCreating(true);
    try {
      await createPlaylist(userProfile.id, newPlaylistName, newPlaylistDescription);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateForm(false);
      setTimeout(() => {
        refetchPlaylists();
      }, 1000);
    } catch (error) {
      console.error("Fel vid skapande av spellista:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (e, playlist) => {
    e.stopPropagation(); // Förhindrar att spellistkortet klickas
    setPlaylistToDelete(playlist);
  };

  const handleConfirmDelete = async () => {
    if (!playlistToDelete) return;

    try {
      await deletePlaylist(playlistToDelete.id);
      setPlaylistToDelete(null);
      refetchPlaylists();
    } catch (error) {
      console.error("Fel vid borttagning av spellista:", error);
    }
  };

  const handleCancelDelete = () => {
    setPlaylistToDelete(null);
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

  if (isLoading || isLoadingProfile) {
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
        <div className={`${playlistToDelete ? 'blur-sm' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dina Spellistor</h1>
            <div className="flex gap-4">
              <button
                onClick={logout}
                className="text-gray-600 px-4 py-2 rounded-lg hover:cursor-pointer hover:text-gray-800 hover:bg-gray-200"
              >
                Logga ut
              </button>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Skapa ny spellista
                </button>
              )}
            </div>
          </div>

          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Skapa ny spellista</h2>
              <form onSubmit={handleCreatePlaylist}>
                <div className="mb-4">
                  <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700 mb-1">
                    Namn på spellistan
                  </label>
                  <input
                    type="text"
                    id="playlistName"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="playlistDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Beskrivning (valfritt)
                  </label>
                  <textarea
                    id="playlistDescription"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-green-600 transition-colors disabled:bg-gray-400"
                  >
                    {isCreating ? "Skapar..." : "Skapa spellista"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-600 px-4 py-2 rounded-lg hover:cursor-pointer hover:text-gray-800 hover:bg-gray-50"
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists?.items?.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group hover:bg-gray-50"
                onClick={() => router.push(`/playlist/${playlist.id}`)}
              >
                {playlist.images && playlist.images.length > 0 ? (
                  <img 
                    src={playlist.images[0].url} 
                    alt={playlist.name} 
                    className="w-full h-48 object-cover" 
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Ingen bild tillgänglig</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
                  <p className="text-gray-600">{playlist.tracks.total} låtar</p>
                  <button
                    onClick={(e) => handleDeleteClick(e, playlist)}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <Trash color="white" size={20} variant="outline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bekräftelsedialog */}
        {playlistToDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Ta bort spellista</h3>
              <p className="mb-6">
                Ta bort spellistan: "{playlistToDelete.name}"?<br/>
                Detta går inte att ångra.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:cursor-pointer hover:text-gray-800 hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors"
                >
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
