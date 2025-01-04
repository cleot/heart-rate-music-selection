import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpotifyToken } from '@/utils/spotify';
import { useToast } from '@/hooks/use-toast';

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const response = await getSpotifyToken(code);
          // Store the token in localStorage or state management
          localStorage.setItem('spotify_access_token', response.access_token);
          localStorage.setItem('spotify_refresh_token', response.refresh_token);
          
          toast({
            title: "Success",
            description: "Successfully connected to Spotify!",
          });
          
          // Redirect back to home page
          navigate('/');
        } catch (error) {
          console.error('Error getting Spotify token:', error);
          toast({
            title: "Error",
            description: "Failed to connect to Spotify. Please try again.",
            variant: "destructive",
          });
          navigate('/');
        }
      } else {
        const error = urlParams.get('error');
        if (error) {
          toast({
            title: "Error",
            description: `Spotify authentication failed: ${error}`,
            variant: "destructive",
          });
        }
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-spotify-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to Spotify...</h1>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default Callback;