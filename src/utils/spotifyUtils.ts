import { supabase } from "@/integrations/supabase/client";

export const getPlaylistTracks = async (playlistUrl: string, token: string) => {
  // Extract playlist ID from Spotify URL
  const playlistId = playlistUrl.split('/').pop()?.split('?')[0];
  
  if (!playlistId) {
    throw new Error('Invalid playlist URL');
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch playlist tracks');
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    uri: item.track.uri,
    name: item.track.name,
    artist: item.track.artists[0].name,
    albumArt: item.track.album.images[0]?.url,
  }));
};

export const queueTrack = async (trackUri: string, token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ uri: trackUri }),
  });

  if (!response.ok) {
    throw new Error('Failed to queue track');
  }
};