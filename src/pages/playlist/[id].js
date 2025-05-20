import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../lib/apifetch";
import { useEffect, useState } from "react";

export default function PlaylistDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchWithAuth(`/playlists/${id}`),
    enabled: !!id && isAuthenticated,
  });

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
          className="mb-6 text-blue-500 hover:text-blue-600 flex items-center"
        >
          ← Tillbaka till spellistor
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
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

          <div className="border-t border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Låtar</h2>
              <div className="space-y-4">
                {playlist?.tracks?.items?.map((item, index) => (
                  <div
                    key={item.track.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-gray-500 w-8">{index + 1}</span>
                    {item.track.album.images[0] && (
                      <img
                        src={item.track.album.images[0].url}
                        alt={item.track.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.track.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.track.artists.map(artist => artist.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.track.album.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 