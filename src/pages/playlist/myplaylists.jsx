import { useRouter } from "next/router";
import DeleteBtn from "../../components/deletebtn";

export default function MyPlaylists({ 
  playlists, 
  onDeleteClick, 
  showCreateForm, 
  onCreatePlaylist,
  newPlaylistName,
  setNewPlaylistName,
  newPlaylistDescription,
  setNewPlaylistDescription,
  handleCreatePlaylist,
  isCreating
}) {
  const router = useRouter();

  return (
    <>
        {/* skapa spellista */}
      {showCreateForm && (
        <div className="bg-white rounded-lg p-6 mb-6">
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
                onClick={() => onCreatePlaylist(false)}
                className="text-gray-600 px-4 py-2 rounded-lg hover:cursor-pointer hover:text-gray-800 hover:bg-gray-50"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}

        {/* mina spellistor */}
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
                <span className="text-gray-400">Ingen bild</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
              <p className="text-gray-600 text-sm">{playlist.tracks.total} låtar</p>
            </div>
            <DeleteBtn onClick={(e) => onDeleteClick(e, playlist)} />
          </div>
        ))}
      </div>
    </>
  );
}
