import { useState } from "react";
import { CloseCircle } from "iconsax-react";
import { addTracksToPlaylist } from "../lib/apifetch";

export default function AddToPlaylist({ 
  track, 
  playlists = [], 
  onClose,
  onSuccess 
}) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylists(prev => {
      if (prev.find(p => p.id === playlist.id)) {
        return prev.filter(p => p.id !== playlist.id);
      }
      return [...prev, playlist];
    });
  };

  const handleAddToPlaylists = async () => {
    if (!track || selectedPlaylists.length === 0) return;

    setIsAdding(true);
    try {
      for (const playlist of selectedPlaylists) {
        await addTracksToPlaylist(playlist.id, [track.uri]);
      }
      if (onSuccess) {
        await onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error("Fel vid tillägg av låt:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedPlaylists([]);
    if (onClose) {
      onClose();
    }
  };

  if (!track) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lägg till i spellista</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              <CloseCircle color="red" size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {track.album.images[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-12 h-12 rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{track.name}</h3>
                <p className="text-gray-600 text-sm">
                  {track.artists.map(artist => artist.name).join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto mb-4">
            {playlists.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Inga spellistor tillgängliga</p>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.some(p => p.id === playlist.id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div>
                    <h3 className="font-medium">{playlist.name}</h3>
                    <p className="text-gray-600 text-sm">{playlist.tracks.total} låtar</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddToPlaylists}
              disabled={selectedPlaylists.length === 0 || isAdding}
              className={`px-6 py-2 rounded-full ${
                selectedPlaylists.length > 0 && !isAdding
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isAdding ? "Lägger till..." : "Klar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
