import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface GeminiResponse {
  text: string;
  usedTokens?: number;
  error?: string;
}

export async function generateWithGemini(prompt: string, options: {
  temperature?: number;
  maxTokens?: number;
  tone?: string;
  dialect?: string;
  voiceStyle?: string;
  seoOptimize?: boolean;
  targetLength?: string;
  contentType?: string;
} = {}): Promise<GeminiResponse> {
  try {
    // Call our Supabase Edge Function for content generation
    const { data, error } = await supabase.functions.invoke("generate-content", {
      body: {
        prompt,
        model: "claude", // Using Claude by default
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1024,
        tone: options.tone || "professional",
        dialect: options.dialect || "neutral",
        voiceStyle: options.voiceStyle || "written",
        seoOptimize: options.seoOptimize || false,
        targetLength: options.targetLength || "medium",
        contentType: options.contentType || "general"
      },
    });

    if (error) {
      console.error("Error generating content:", error);
      return {
        text: "",
        error: `Lỗi: ${error.message || "Không thể kết nối đến dịch vụ AI"}`,
      };
    }

    return {
      text: data.text || "",
      usedTokens: data.usedTokens,
      error: data.error
    };
  } catch (error) {
    console.error("Error calling AI API:", error);
    return {
      text: "",
      error: `Lỗi kết nối: ${error instanceof Error ? error.message : "Không thể kết nối đến dịch vụ AI"}`,
    };
  }
}
