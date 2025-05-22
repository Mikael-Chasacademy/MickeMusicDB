import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { fetchWithAuth, removeTrackFromPlaylist } from "../../lib/apifetch";
import { useEffect, useState } from "react";
import { Trash, ArrowLeft2 } from "iconsax-react";

export default function PlaylistDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const {
    data: playlist,
    isLoading,
    error,
    refetch: refetchPlaylist,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchWithAuth(`/playlists/${id}`),
    enabled: !!id && isAuthenticated,
  });

  const handleDeleteClick = (e, track) => {
    e.stopPropagation();
    setTrackToDelete(track);
  };

  const handleConfirmDelete = async () => {
    if (!trackToDelete) return;

    try {
      await removeTrackFromPlaylist(id, trackToDelete.track.uri);
      setTrackToDelete(null);
      refetchPlaylist();
    } catch (error) {
      console.error("Fel vid borttagning av låt:", error);
    }
  };

  const handleCancelDelete = () => {
    setTrackToDelete(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Laddar spellista...</p>
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
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-500 hover:text-blue-600 hover:cursor-pointer flex items-center"
        >
          <ArrowLeft2 color="blue" size={20} />
          Tillbaka till spellistor
          </button>

        <div className={`${trackToDelete ? 'blur-sm' : ''}`}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start gap-6">
              {playlist?.images?.[0] && (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{playlist?.name}</h1>
                <p className="text-gray-600 mb-4">{playlist?.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{playlist?.tracks?.total} låtar</span>
                  <span>{playlist?.followers?.total} följare</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Låtar</h2>
              <div className="border-b border-gray-200 mb-4"></div>
              {playlist?.tracks?.items?.length > 0 ? (
                <div className="space-y-4">
                  {playlist?.tracks?.items?.map((item, index) => (
                    <div
                      key={item.track.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group relative"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 w-8">{index + 1}</span>
                        {item.track.album.images[0] && (
                          <img
                            src={item.track.album.images[0].url}
                            alt={item.track.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{item.track.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.track.artists.map(artist => artist.name).join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{item.track.album.name}</span>
                        <button
                          onClick={(e) => handleDeleteClick(e, item)}
                          className="opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <Trash color="white" size={20} variant="outline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 text-gray-500">
                  <p className="font-semibold">Tomt</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bekräftelsedialog */}
        {trackToDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Ta bort låt</h3>
              <p className="mb-6">
                Ta bort låten: "{trackToDelete.track.name}"?<br/>
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