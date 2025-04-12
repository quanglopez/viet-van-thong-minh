
import { SavedContent } from "../ContentHistory";

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
