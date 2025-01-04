import { supabase } from "@/integrations/supabase/client";

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

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
  const { data: { SPOTIFY_CLIENT_ID } } = await supabase.functions.invoke('get-spotify-client-id');
  
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    show_dialog: "true",
  });

  console.log('Redirect URI:', REDIRECT_URI); // Helpful for debugging

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

export const getSpotifyToken = async (code: string) => {
  const response = await supabase.functions.invoke('spotify-token', {
    body: { code, redirectUri: REDIRECT_URI }
  });
  
  return response.data;
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
