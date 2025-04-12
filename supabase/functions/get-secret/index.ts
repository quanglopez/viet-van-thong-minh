import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

interface SecretRequest {
  name: string;
}

// Get authorized user from request
const getUser = async (req: Request) => {
  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Get the user from the request
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  return user
}

// This function securely provides API keys to authenticated users
// The actual API keys are stored as environment variables in Supabase
serve(async (req) => {
  // Check for authorized user
  const user = await getUser(req)
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { headers: { 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Parse request body
  const { name } = await req.json() as SecretRequest
  
  // Only allow certain secrets to be accessed
  const allowedSecrets = [
    'OPENROUTER_API_KEY',
    'CLAUDE_API_KEY',
    'GEMINI_API_KEY',
    'OPENAI_API_KEY'
  ]
  
  if (!allowedSecrets.includes(name)) {
    return new Response(
      JSON.stringify({ error: 'Secret not allowed' }),
      { headers: { 'Content-Type': 'application/json' }, status: 403 }
    )
  }

  // Get the secret value from environment variables
  const value = Deno.env.get(name)
  
  if (!value) {
    return new Response(
      JSON.stringify({ error: 'Secret not found' }),
      { headers: { 'Content-Type': 'application/json' }, status: 404 }
    )
  }

  // Return the secret
  return new Response(
    JSON.stringify({ value }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
