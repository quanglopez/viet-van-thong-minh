
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CopyCheck, 
  BadgeCheck, 
  Lightbulb, 
  SendHorizontal,
  BookOpen, 
  PencilRuler, 
  PenLine
} from "lucide-react";

// Update the ToneTemplate interface to be compatible with the database type
export interface ToneTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: {
    tone: string;
    dialect: string;
    voiceStyle: string;
    temperature: number;
  };
  // These fields are optional to make it compatible with database type
  is_system?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

const toneTemplates: ToneTemplate[] = [
  {
    id: "professional",
    name: "Chuyên nghiệp",
    description: "Ngôn ngữ trịnh trọng và chính thức cho môi trường công sở",
    icon: <BadgeCheck className="h-6 w-6 text-blue-500" />,
    settings: {
      tone: "professional",
      dialect: "neutral",
      voiceStyle: "written",
      temperature: 0.5,
    }
  },
  {
    id: "creative",
    name: "Sáng tạo",
    description: "Ngôn ngữ hình tượng và đầy cảm hứng cho nội dung sáng tạo",
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    settings: {
      tone: "friendly",
      dialect: "neutral",
      voiceStyle: "written",
      temperature: 0.9,
    }
  },
  {
    id: "persuasive",
    name: "Thuyết phục",
    description: "Ngôn ngữ thuyết phục mạnh mẽ cho nội dung marketing",
    icon: <SendHorizontal className="h-6 w-6 text-green-500" />,
    settings: {
      tone: "persuasive",
      dialect: "neutral", 
      voiceStyle: "written",
      temperature: 0.7,
    }
  },
  {
    id: "casual",
    name: "Thân thiện",
    description: "Ngôn ngữ gần gũi và trò chuyện cho mạng xã hội",
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
    settings: {
      tone: "friendly",
      dialect: "southern",
      voiceStyle: "spoken",
      temperature: 0.8,
    }
  },
  {
    id: "academic",
    name: "Học thuật",
    description: "Ngôn ngữ chính xác và trích dẫn cho nội dung học thuật",
    icon: <PencilRuler className="h-6 w-6 text-indigo-500" />,
    settings: {
      tone: "formal",
      dialect: "neutral",
      voiceStyle: "written",
      temperature: 0.3,
    }
  },
  {
    id: "journalistic",
    name: "Báo chí",
    description: "Ngôn ngữ khách quan và chính xác cho bài báo",
    icon: <PenLine className="h-6 w-6 text-red-500" />,
    settings: {
      tone: "professional",
      dialect: "northern",
      voiceStyle: "written",
      temperature: 0.4,
    }
  },
];

interface ToneStyleTemplatesProps {
  onSelectTemplate: (template: ToneTemplate) => void;
  selectedTemplateId: string | null;
}

const ToneStyleTemplates: React.FC<ToneStyleTemplatesProps> = ({ 
  onSelectTemplate, 
  selectedTemplateId 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {toneTemplates.map((template) => (
        <Card 
          key={template.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTemplateId === template.id ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="bg-primary/10 p-2 rounded-md">{template.icon}</div>
              {selectedTemplateId === template.id && (
                <CopyCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              {template.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ToneStyleTemplates;
