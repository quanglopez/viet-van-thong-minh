
import { toast } from "@/hooks/use-toast";

// Replaced Gemini API with OpenRouter API using Gemini 2.5 Pro Preview model
const OPENROUTER_API_KEY = ""; // This should be added through Supabase secrets
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
    const { 
      temperature = 0.7, 
      maxTokens = 1024, 
      tone = "professional", 
      dialect = "neutral", 
      voiceStyle = "written",
      seoOptimize = false,
      targetLength = "medium",
      contentType = "general"
    } = options;
    
    // Format system message based on options
    let systemMessage = `Bạn là trợ lý viết nội dung AI cho người Việt. Hãy viết nội dung ${tone === "professional" ? "chuyên nghiệp" : tone === "friendly" ? "thân thiện" : tone === "persuasive" ? "thuyết phục" : "trang trọng"}.`;
    
    // Add dialect preference
    if (dialect === "northern") {
      systemMessage += " Sử dụng ngôn ngữ và từ vựng phổ biến ở miền Bắc Việt Nam.";
    } else if (dialect === "central") {
      systemMessage += " Sử dụng ngôn ngữ và từ vựng phổ biến ở miền Trung Việt Nam.";
    } else if (dialect === "southern") {
      systemMessage += " Sử dụng ngôn ngữ và từ vựng phổ biến ở miền Nam Việt Nam.";
    }
    
    // Add voice style
    systemMessage += ` Sử dụng ${voiceStyle === "written" ? "văn viết" : "văn nói"}.`;
    
    // Add SEO optimization if selected
    if (seoOptimize) {
      systemMessage += " Tối ưu hóa nội dung cho SEO với các heading, từ khóa phù hợp, và cấu trúc tốt cho tìm kiếm.";
    }
    
    // Add target length guideline
    if (targetLength === "short") {
      systemMessage += " Viết nội dung ngắn gọn, súc tích, dưới 300 từ.";
    } else if (targetLength === "medium") {
      systemMessage += " Viết nội dung vừa phải, khoảng 500-800 từ.";
    } else if (targetLength === "long") {
      systemMessage += " Viết nội dung dài, chi tiết, khoảng 1000-1500 từ.";
    }
    
    // Add content type guidance
    if (contentType === "blog") {
      systemMessage += " Viết dưới dạng bài blog có cấu trúc rõ ràng với phần giới thiệu, nội dung chính, và kết luận.";
    } else if (contentType === "social") {
      systemMessage += " Viết nội dung ngắn gọn, thu hút, phù hợp cho mạng xã hội với emoji và ngôn ngữ tương tác.";
    } else if (contentType === "email") {
      systemMessage += " Viết email chuyên nghiệp với lời chào, nội dung chính, và lời kết phù hợp.";
    } else if (contentType === "product") {
      systemMessage += " Viết mô tả sản phẩm thu hút, tập trung vào đặc điểm và lợi ích, với lời kêu gọi hành động.";
    }
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin, // OpenRouter requires this for attribution
      "X-Title": "VietVan AI Content Generator" // Your app's name
    };

    const requestBody = {
      model: "google/gemini-2-5-pro-preview", // Using Gemini 2.5 Pro Preview via OpenRouter
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 0.9,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("AI API Error:", data.error);
      return {
        text: "",
        error: `Lỗi API: ${data.error.message || "Không thể kết nối đến dịch vụ AI"}`,
      };
    }

    const generatedText = data.choices?.[0]?.message?.content || "";
    const usedTokens = data.usage?.total_tokens || 0;

    return {
      text: generatedText,
      usedTokens,
    };
  } catch (error) {
    console.error("Error calling AI API:", error);
    return {
      text: "",
      error: `Lỗi kết nối: ${error instanceof Error ? error.message : "Không thể kết nối đến dịch vụ AI"}`,
    };
  }
}
