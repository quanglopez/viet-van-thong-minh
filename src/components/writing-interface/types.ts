
import { ToneTemplate as DBToneTemplate, ContentTemplate, UserContent, UsageStatistics, ContentAnalytics } from "@/types/database";
import { ToneTemplate as UIToneTemplate } from "@/components/ToneStyleTemplates";

export interface TopicAnalysis {
  topic: string;
  count: number;
  engagement: number;
}

export interface ContentMetrics {
  wordCount: number;
  readingTime: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  seoScore: number;
}

export interface WritingInterfaceProps {
  // Add any props here if needed in the future
}

export interface ContentGenerationSettings {
  dialect: string;
  tone: string;
  voiceStyle: string;
  seoOptimize: boolean;
  contentType: string;
  targetLength: string;
  temperature: number[];
}

export interface AnalyticsData {
  contentGenerated: number;
  averageLength: number;
  topCategories: { name: string; count: number; }[];
  dailyStats: { date: string; generations: number; engagementScore: number; }[];
  topicAnalysis: TopicAnalysis[];
}

export interface SavedContent extends UserContent {
  timestamp?: Date; // For backward compatibility
}

// Add a helper function to convert between different ToneTemplate types
export const convertDBToneTemplateToUI = (template: DBToneTemplate): UIToneTemplate => {
  return {
    id: template.id,
    name: template.name,
    description: template.description || "",
    icon: getIconForTemplate(template.name),
    settings: template.settings as UIToneTemplate["settings"],
    is_system: template.is_system,
    created_at: template.created_at,
    updated_at: template.updated_at,
    user_id: template.user_id
  };
};

// Helper function to get an icon based on template name
function getIconForTemplate(name: string) {
  // Simple implementation, you might want to enhance this
  import { BadgeCheck, Lightbulb, SendHorizontal, BookOpen, PencilRuler, PenLine } from "lucide-react";
  
  switch (name.toLowerCase()) {
    case 'chuyên nghiệp':
      return <BadgeCheck className="h-6 w-6 text-blue-500" />;
    case 'sáng tạo':
      return <Lightbulb className="h-6 w-6 text-amber-500" />;
    case 'thuyết phục':
      return <SendHorizontal className="h-6 w-6 text-green-500" />;
    case 'thân thiện':
      return <BookOpen className="h-6 w-6 text-purple-500" />;
    case 'học thuật':
      return <PencilRuler className="h-6 w-6 text-indigo-500" />;
    case 'báo chí':
      return <PenLine className="h-6 w-6 text-red-500" />;
    default:
      return <BadgeCheck className="h-6 w-6 text-gray-500" />;
  }
}
