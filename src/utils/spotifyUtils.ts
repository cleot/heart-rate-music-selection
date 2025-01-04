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
  console.log('Queueing track:', trackUri);
  
  const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (response.status === 404) {
    throw new Error('No active device found. Please start playback in Spotify first.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Queue error response:', errorText);
    throw new Error(`Failed to queue track (${response.status})`);
  }
};