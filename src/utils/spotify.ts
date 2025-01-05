const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

// Get the base URL for the current environment
const getBaseUrl = () => {
  // Check if we're in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  // Otherwise use the current origin (works for production and custom domains)
  return window.location.origin;
};

// Determine the redirect URI based on the environment
const REDIRECT_URI = `${getBaseUrl()}/callback`;

const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
];

export const getSpotifyAuthUrl = async () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    show_dialog: "true",
  });

  console.log('Redirect URI:', REDIRECT_URI);

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

export const getSpotifyToken = async (code: string) => {
  const response = await fetch('/spotify-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get Spotify token');
  }

  return response.json();
};

export const getPlaylistTracks = async (playlistId: string, accessToken: string) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

export const startPlayback = async (uris: string[], accessToken: string) => {
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });
};
