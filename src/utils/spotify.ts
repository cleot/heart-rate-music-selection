import { supabase } from "@/integrations/supabase/client";

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const REDIRECT_URI = "http://localhost:8080/callback";
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

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

export const getSpotifyToken = async (code: string) => {
  const response = await supabase.functions.invoke('spotify-token', {
    body: { code }
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