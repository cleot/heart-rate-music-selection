import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
  
  return new Response(
    JSON.stringify({ SPOTIFY_CLIENT_ID: clientId }),
    { 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      } 
    },
  )
})