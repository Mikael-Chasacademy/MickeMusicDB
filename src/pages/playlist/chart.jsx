import { useQuery } from "@tanstack/react-query";
import { getDeezerTopTracks, searchSpotifyTrackByTitleAndArtist } from "../../lib/apifetch";
import { useState } from "react";
import AddBtn from "../../components/addbtn";

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
    <div>
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topTracks?.data?.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group hover:bg-gray-50"
          >
            {track.album?.cover_medium ? (
              <img
                src={track.album.cover_medium}
                alt={track.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Ingen bild</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">{track.title}</h3>
              <p className="text-gray-600 text-sm truncate">{track.artist.name}</p>
            </div>
            <AddBtn onClick={() => handleTrackClick(track)} disabled={isLoadingTrack} floating={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
