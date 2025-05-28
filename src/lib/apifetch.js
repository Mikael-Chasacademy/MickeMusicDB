import { API_CONFIG } from "../config/apiconfig";

const BASE_URL = "https://api.spotify.com/v1";
let accessToken = null;

// Client Credentials Flow
let clientCredentialsToken = null;
let clientCredentialsTokenExpiry = null;

async function getClientCredentialsToken() {
  if (clientCredentialsToken && clientCredentialsTokenExpiry > Date.now()) {
    return clientCredentialsToken;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  clientCredentialsToken = data.access_token;
  clientCredentialsTokenExpiry = Date.now() + (data.expires_in * 1000);
  return clientCredentialsToken;
}

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: API_CONFIG.clientId,
    response_type: "code",
    redirect_uri: API_CONFIG.redirectUri,
    scope: API_CONFIG.scopes,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getAccessToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: API_CONFIG.redirectUri,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`).toString("base64")}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  return response.json();
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  if (response.status === 204 || options.method === 'DELETE' || options.method === 'PUT') {
    return null;
  }

  return response.json();
};

export async function searchTracks(query) {
  const token = await getClientCredentialsToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
}

export const getUserPlaylists = async () => {
  return fetchWithAuth("/me/playlists");
};

export const createPlaylist = async (userId, name, description = "") => {
  return fetchWithAuth(`/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      public: false,
    }),
  });
};

export const addTracksToPlaylist = async (playlistId, uris) => {
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });
};

export const removeTrackFromPlaylist = async (playlistId, trackUri) => {
  return fetchWithAuth(`/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: [{ uri: trackUri }]
    }),
  });
};

export const logout = () => {
  localStorage.removeItem("spotify_access_token");
  accessToken = null;
  window.location.href = "/";
};

export const deletePlaylist = async (playlistId) => {
  return fetchWithAuth(`/playlists/${playlistId}/followers`, {
    method: "DELETE",
  });
};

export const updatePlaylist = async (playlistId, name, description) => {
  return fetchWithAuth(`/playlists/${playlistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });
};

export async function getDeezerTopTracks() {
  try {
    const response = await fetch('/api/deezer/top-tracks');
    if (!response.ok) {
      throw new Error('Kunde inte hämta topplåtar från Deezer');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fel vid hämtning av topplåtar:', error);
    throw error;
  }
}

export async function searchSpotifyTrackByTitleAndArtist(title, artist) {
  try {
    const token = await getClientCredentialsToken();
    const query = `${title} artist:${artist}`;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Kunde inte söka efter låt i Spotify');
    }
    
    const data = await response.json();
    return data.tracks.items[0] || null;
  } catch (error) {
    console.error('Fel vid sökning av låt:', error);
    throw error;
  }
}
 