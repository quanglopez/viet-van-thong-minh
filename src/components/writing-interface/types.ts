
import { ToneTemplate, ContentTemplate, UserContent, UsageStatistics, ContentAnalytics } from "@/types/database";

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
  topicAnalysis?: TopicAnalysis[];
}

export interface SavedContent extends UserContent {
  timestamp?: Date; // For backward compatibility
}
