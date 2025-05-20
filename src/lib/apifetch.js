import { API_CONFIG } from "../config/apiconfig";

const BASE_URL = "https://api.spotify.com/v1";
let accessToken = null;

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
      Authorization: `Basic ${Buffer.from(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`).toString("base64")}`,
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  return response.json();
};

export const getClientCredentialsToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get client credentials token");
  }

  const data = await response.json();
  return data.access_token;
};

const fetchWithAuth = async (endpoint, options = {}) => {
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

  return response.json();
};

export const searchTracks = async (query) => {
  try {
    const token = await getClientCredentialsToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

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

export const getTopTracks = async () => {
  try {
    const token = await getClientCredentialsToken();
    
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n?market=SE",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
