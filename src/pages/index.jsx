import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUrl, getUserPlaylists, setAccessToken, fetchWithAuth, createPlaylist, logout, deletePlaylist } from "../lib/apifetch";
import AddToPlaylist from "../components/addtoplaylist";
import Chart from "./playlist/chart";
import Navbar from "../components/navbar";
import MyPlaylists from "./playlist/myplaylists";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [activeView, setActiveView] = useState("playlists");
  const [selectedTrack, setSelectedTrack] = useState(null);
  

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
    e.stopPropagation(); // Förhindrar att spellistkortet klickas när man försöker radera
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

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
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
    <div className="min-h-screen bg-gray-100">
      {/* låtar som söks från sökrutan vissas via onTrackSelect */}
      <Navbar 
        onTrackSelect={handleTrackSelect}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />

      {/* Main content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${playlistToDelete ? 'blur-sm' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setActiveView("chart")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === "chart"
                      ? "bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Topplista
                </button>
                <button
                  onClick={() => setActiveView("playlists")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === "playlists"
                      ? "bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Spellistor
                </button>
              </div>
              {!showCreateForm && activeView === "playlists" && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Skapa ny spellista
                </button>
              )}
            </div>

            {activeView === "playlists" ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">your playlists</h2>
              <MyPlaylists
                playlists={playlists}
                onDeleteClick={handleDeleteClick}
                showCreateForm={showCreateForm}
                onCreatePlaylist={setShowCreateForm}
                newPlaylistName={newPlaylistName}
                setNewPlaylistName={setNewPlaylistName}
                newPlaylistDescription={newPlaylistDescription}
                setNewPlaylistDescription={setNewPlaylistDescription}
                handleCreatePlaylist={handleCreatePlaylist}
                isCreating={isCreating}
              />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Top 50 Hit-list</h2>
                <Chart onTrackSelect={handleTrackSelect} />
              </div>
            )}
          </div>

          {/* Bekräftelsedialog */}
          {playlistToDelete && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Ta bort spellista</h3>
                <p className="text-gray-600 mb-6">
                  Är du säker på att du vill ta bort spellistan "{playlistToDelete.name}"?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Playlist Dialog */}
      {/* krävs då alla låtar från searchbar vissas upp här i index.jsx */}
      {selectedTrack && (
        <AddToPlaylist
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
          playlists={playlists?.items || []}
        />
      )}
    </div>
  );
}
