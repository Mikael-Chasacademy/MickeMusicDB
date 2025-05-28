import { useQuery } from "@tanstack/react-query";
import { getDeezerTopTracks, searchSpotifyTrackByTitleAndArtist } from "../../lib/apifetch";
import { Add } from "iconsax-react";
import { useState } from "react";

export default function Chart({ onTrackSelect }) {
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [error, setError] = useState(null);

  const {
    data: topTracks,
    isLoading,
    error: tracksError
  } = useQuery({
    queryKey: ["deezerTopTracks"],
    queryFn: getDeezerTopTracks
  });

  const handleTrackClick = async (track) => {
    setIsLoadingTrack(true);
    setError(null);
    try {
      const spotifyTrack = await searchSpotifyTrackByTitleAndArtist(track.title, track.artist.name);
      if (spotifyTrack) {
        onTrackSelect(spotifyTrack);
      } else {
        setError('Kunde inte hitta låten i Spotify');
      }
    } catch (error) {
      setError('Ett fel uppstod vid sökning av låten');
      console.error('Fel vid sökning av låt:', error);
    } finally {
      setIsLoadingTrack(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Laddar topplåtar...</p>
      </div>
    );
  }

  if (tracksError) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-red-500">Ett fel uppstod: {tracksError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {topTracks?.data?.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-4 flex-1">
            {track.album?.cover_medium && (
              <img
                src={track.album.cover_medium}
                alt={track.title}
                className="w-12 h-12 rounded"
              />
            )}
            <div>
              <h3 className="font-semibold">{track.title}</h3>
              <p className="text-gray-600">{track.artist.name}</p>
            </div>
          </div>
          <button
            onClick={() => handleTrackClick(track)}
            disabled={isLoadingTrack}
            className="p-2 text-gray-600 hover:text-gray-800 active:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Add color="green" size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
