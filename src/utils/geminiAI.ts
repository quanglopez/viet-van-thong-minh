
import { toast } from "@/hooks/use-toast";

const GEMINI_API_KEY = "AIzaSyAb9uuBbJnZafJ6wNWpN4wL46-1V4sSwd4";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

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
  targetLength?: number;
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
    
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemMessage + "\n\n" + prompt }]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
        topP: 0.9,
      },
    };

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return {
        text: "",
        error: `Lỗi API: ${data.error.message || "Không thể kết nối đến dịch vụ AI"}`,
      };
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usedTokens = data.usageMetadata?.promptTokenCount + data.usageMetadata?.candidatesTokenCount || 0;

    return {
      text: generatedText,
      usedTokens,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: "",
      error: `Lỗi kết nối: ${error instanceof Error ? error.message : "Không thể kết nối đến dịch vụ AI"}`,
    };
  }
}
