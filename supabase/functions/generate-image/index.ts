
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Interface for request body
interface ImageRequest {
  prompt: string;
  style?: string;
  size?: string;
  quality?: number;
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

  return { user, supabaseClient }
}

// Generate image using DALL-E API from OpenAI
const generateWithDallE = async (
  prompt: string,
  options: {
    style?: string;
    size?: string;
    quality?: number;
  }
) => {
  const API_KEY = Deno.env.get('OPENAI_API_KEY')
  
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  
  const { style = 'realistic', size = '1024x1024', quality = 0.7 } = options
  
  // Add style to prompt if specified
  let enhancedPrompt = prompt
  if (style === 'artistic') {
    enhancedPrompt = `An artistic rendering of: ${prompt}, stylized, vibrant colors`
  } else if (style === 'cartoon') {
    enhancedPrompt = `A cartoon style drawing of: ${prompt}, animated, simple`
  } else if (style === 'sketch') {
    enhancedPrompt = `A pencil sketch of: ${prompt}, detailed drawing, grayscale`
  } else {
    enhancedPrompt = `A realistic photo of: ${prompt}, detailed, high definition`
  }
  
  // Quality parameter mappings (rough approximation)
  const qualityValue = quality >= 0.8 ? 'hd' : 'standard'
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: qualityValue,
        model: "dall-e-3"
      })
    })
    
    const data = await response.json()
    
    if (data.error) {
      throw new Error(`API Error: ${data.error.message || 'Unknown error'}`)
    }
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL in response')
    }
    
    return {
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt
    }
  } catch (error) {
    console.error('Error calling DALL-E API:', error)
    throw error
  }
}

// Main handler function
serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get user from request
    const { user, supabaseClient } = await getUser(req)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Parse request body
    const { prompt, style, size, quality } = await req.json() as ImageRequest

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid prompt' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Generate image
    const result = await generateWithDallE(prompt, { style, size, quality })

    // Save image generation request to database if needed
    try {
      await supabaseClient
        .from('image_generations')
        .insert({
          user_id: user.id,
          prompt: prompt,
          settings: { style, size, quality },
          image_url: result.imageUrl
        })
    } catch (dbError) {
      console.error('Error saving to database:', dbError)
      // Continue even if DB save fails
    }

    // Return success
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error handling request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
