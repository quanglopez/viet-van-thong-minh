import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Interfaces
interface GenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tone?: string;
  dialect?: string;
  voiceStyle?: string;
  seoOptimize?: boolean;
  targetLength?: string;
  contentType?: string;
}

interface GenerationResponse {
  text: string;
  usedTokens?: number;
  error?: string;
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

// Check if user has enough tokens
const checkTokenAllowance = async (
  supabaseClient: any,
  userId: string,
  estimatedTokens: number
): Promise<boolean> => {
  // Get user profile with subscription info
  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    console.error('Error getting user profile:', error)
    return false
  }

  // Check if we need to reset monthly tokens
  const lastReset = new Date(profile.last_token_reset)
  const now = new Date()
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    // Reset tokens at the beginning of the month
    await supabaseClient
      .from('profiles')
      .update({
        tokens_used: 0,
        last_token_reset: now.toISOString()
      })
      .eq('id', userId)
    
    // Refresh profile data
    const { data: updatedProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (updatedProfile) {
      profile.tokens_used = updatedProfile.tokens_used
    }
  }

  // Check if user has enough tokens
  const availableTokens = profile.monthly_token_limit - profile.tokens_used
  return availableTokens >= estimatedTokens
}

// Update token usage
const updateTokenUsage = async (
  supabaseClient: any,
  userId: string,
  tokensUsed: number,
  prompt: string,
  generatedContent: string,
  settings: any
): Promise<void> => {
  // Update profile tokens used
  await supabaseClient
    .from('profiles')
    .update({
      tokens_used: supabaseClient.rpc('increment', { x: tokensUsed })
    })
    .eq('id', userId)

  // Update usage statistics
  const today = new Date().toISOString().split('T')[0]
  
  // Try to update existing record for today
  const { error } = await supabaseClient
    .from('usage_statistics')
    .update({
      tokens_used: supabaseClient.rpc('increment', { x: tokensUsed }),
      content_count: supabaseClient.rpc('increment', { x: 1 })
    })
    .eq('user_id', userId)
    .eq('date', today)

  // If no record exists for today, create one
  if (error) {
    await supabaseClient
      .from('usage_statistics')
      .insert({
        user_id: userId,
        date: today,
        tokens_used: tokensUsed,
        content_count: 1
      })
  }

  // Save the generated content
  await supabaseClient
    .from('user_content')
    .insert({
      user_id: userId,
      title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      content: generatedContent,
      prompt: prompt,
      tokens_used: tokensUsed,
      settings: settings
    })
}

// Generate content using OpenRouter API
const generateWithOpenRouter = async (
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    systemMessage?: string;
  }
): Promise<GenerationResponse> => {
  const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
  const API_KEY = Deno.env.get('OPENROUTER_API_KEY')

  if (!API_KEY) {
    return {
      text: '',
      error: 'API key not configured'
    }
  }

  const { temperature = 0.7, maxTokens = 1024, systemMessage } = options

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'https://vietvan.app',
    'X-Title': 'VietVan Content Generator'
  }

  const messages = []
  
  if (systemMessage) {
    messages.push({
      role: 'system',
      content: systemMessage
    })
  }
  
  messages.push({
    role: 'user',
    content: prompt
  })

  // Default to Claude Haiku because it's good for Vietnamese content
  // Other options include "anthropic/claude-3-haiku", "anthropic/claude-3-opus", "meta-llama/llama-3-70b-instruct"
  const requestBody = {
    model: "anthropic/claude-3-haiku", 
    messages,
    max_tokens: maxTokens,
    temperature: temperature
  }

  try {
    console.log("Calling OpenRouter API with:", JSON.stringify(requestBody))
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (data.error) {
      console.error('API Error:', data.error)
      return {
        text: '',
        error: `API Error: ${data.error.message || JSON.stringify(data.error)}`
      }
    }

    console.log("OpenRouter response:", JSON.stringify(data))
    return {
      text: data.choices[0].message.content,
      usedTokens: data.usage?.total_tokens || 0
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error)
    return {
      text: '',
      error: `Error: ${error.message || 'Unknown error'}`
    }
  }
}

// Format system message based on options
const formatSystemMessage = (options: GenerationRequest): string => {
  const { 
    tone = 'professional', 
    dialect = 'neutral', 
    voiceStyle = 'written',
    seoOptimize = false,
    targetLength = 'medium',
    contentType = 'general'
  } = options
  
  let systemMessage = `Bạn là trợ lý viết nội dung AI cho người Việt. Hãy viết nội dung ${
    tone === 'professional' ? 'chuyên nghiệp' : 
    tone === 'friendly' ? 'thân thiện' : 
    tone === 'persuasive' ? 'thuyết phục' : 'trang trọng'
  }.`
  
  // Add dialect preference
  if (dialect === 'northern') {
    systemMessage += ' Sử dụng ngôn ngữ và từ vựng phổ biến ở miền Bắc Việt Nam.'
  } else if (dialect === 'central') {
    systemMessage += ' Sử d��ng ngôn ngữ và từ vựng phổ biến ở miền Trung Việt Nam.'
  } else if (dialect === 'southern') {
    systemMessage += ' Sử dụng ngôn ngữ và từ vựng phổ biến ở miền Nam Việt Nam.'
  }
  
  // Add voice style
  systemMessage += ` Sử dụng ${voiceStyle === 'written' ? 'văn viết' : 'văn nói'}.`
  
  // Add SEO optimization if selected
  if (seoOptimize) {
    systemMessage += ' Tối ưu hóa nội dung cho SEO với các heading, từ khóa phù hợp, và cấu trúc tốt cho tìm kiếm.'
  }
  
  // Add target length guideline
  if (targetLength === 'short') {
    systemMessage += ' Viết nội dung ngắn gọn, súc tích, dưới 300 từ.'
  } else if (targetLength === 'medium') {
    systemMessage += ' Viết nội dung vừa phải, khoảng 500-800 từ.'
  } else if (targetLength === 'long') {
    systemMessage += ' Viết nội dung dài, chi tiết, khoảng 1000-1500 từ.'
  }
  
  // Add content type guidance
  if (contentType === 'blog') {
    systemMessage += ' Viết dưới dạng bài blog có cấu trúc rõ ràng với phần giới thiệu, nội dung chính, và kết luận.'
  } else if (contentType === 'social') {
    systemMessage += ' Viết nội dung ngắn gọn, thu hút, phù hợp cho mạng xã hội với emoji và ngôn ngữ tương tác.'
  } else if (contentType === 'email') {
    systemMessage += ' Viết email chuyên nghiệp với lời chào, nội dung chính, và lời kết phù hợp.'
  } else if (contentType === 'product') {
    systemMessage += ' Viết mô tả sản phẩm thu hút, tập trung vào đặc điểm và lợi ích, với lời kêu gọi hành động.'
  }
  
  return systemMessage
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
    const requestData: GenerationRequest = await req.json()
    const { 
      prompt, 
      model = 'openrouter', 
      temperature = 0.7, 
      max_tokens = 1024,
      ...otherOptions 
    } = requestData

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid prompt' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Estimate token usage (simple heuristic: ~1 token per 4 characters)
    const estimatedPromptTokens = Math.ceil(prompt.length / 4)
    const estimatedTotalTokens = estimatedPromptTokens + max_tokens

    // Check if user has enough tokens
    const hasEnoughTokens = await checkTokenAllowance(
      supabaseClient,
      user.id,
      estimatedTotalTokens
    )

    if (!hasEnoughTokens) {
      return new Response(
        JSON.stringify({ 
          error: 'Token limit exceeded. Please upgrade your subscription or try again next month.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Prepare the system message
    const systemMessage = formatSystemMessage(requestData)

    // Generate content using OpenRouter
    const result = await generateWithOpenRouter(prompt, {
      temperature,
      maxTokens: max_tokens,
      systemMessage
    })

    // If successful, update token usage
    if (result.text && !result.error) {
      await updateTokenUsage(
        supabaseClient,
        user.id,
        result.usedTokens || estimatedTotalTokens,
        prompt,
        result.text,
        {
          model: 'openrouter',
          temperature,
          max_tokens,
          ...otherOptions
        }
      )
    }

    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error handling request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
