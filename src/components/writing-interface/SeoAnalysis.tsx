
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SeoAnalysisProps {
  content: string;
  metrics: {
    readability: number;
    keywordDensity: number;
    titleOptimization: number;
    structureScore: number;
  };
  keywords: string[];
}

const SeoAnalysis: React.FC<SeoAnalysisProps> = ({
  content,
  metrics,
  keywords
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Phân tích SEO</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Độ dễ đọc</span>
            <span>{metrics.readability}%</span>
          </div>
          <Progress value={metrics.readability} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Mật độ từ khóa</span>
            <span>{metrics.keywordDensity}%</span>
          </div>
          <Progress value={metrics.keywordDensity} />
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Từ khóa gợi ý</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span 
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-md text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SeoAnalysis;
