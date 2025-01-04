import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
  
  return new Response(
    JSON.stringify({ SPOTIFY_CLIENT_ID: clientId }),
    { headers: { "Content-Type": "application/json" } },
  )
})