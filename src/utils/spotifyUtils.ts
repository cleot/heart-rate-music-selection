export const getPlaylistTracks = async (playlistUrl: string, token: string) => {
  try {
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
      if (response.status === 401) {
        throw new Error('Spotify token expired. Please reconnect.');
      }
      throw new Error(`Failed to fetch playlist tracks: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid playlist data received');
    }

    return data.items
      .filter(item => item.track && !item.track.is_local) // Filter out local tracks and null tracks
      .map((item: any) => ({
        uri: item.track.uri,
        name: item.track.name,
        artist: item.track.artists[0].name,
        albumArt: item.track.album.images[0]?.url,
      }));
  } catch (error) {
    console.error('Error in getPlaylistTracks:', error);
    throw error;
  }
};

export const queueTrack = async (trackUri: string, token: string) => {
  console.log('Queueing track:', trackUri);
  
  try {
    // First check if there's an active device
    const deviceResponse = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (deviceResponse.status === 204 || deviceResponse.status === 404) {
      throw new Error('No active Spotify device found. Please start playback in Spotify first.');
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Queue error response:', errorText);
      throw new Error(`Failed to queue track (${response.status})`);
    }

    return true;
  } catch (error) {
    console.error('Error in queueTrack:', error);
    throw error;
  }
};