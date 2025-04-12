
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SeoScore {
  score: number;
  category: string;
  suggestions: string[];
}

interface SeoAnalysisProps {
  content: string;
}

const SeoAnalysis: React.FC<SeoAnalysisProps> = ({ content }) => {
  const analyzeSeo = (text: string): SeoScore[] => {
    const scores: SeoScore[] = [];
    
    // Keyword density
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const keywordDensity = Math.max(...Object.values(wordFreq).map(freq => (freq / wordCount) * 100));
    scores.push({
      score: keywordDensity > 2 ? 100 : keywordDensity > 1 ? 80 : 60,
      category: "Mật độ từ khóa",
      suggestions: keywordDensity < 1 ? ["Tăng tần suất sử dụng từ khóa chính"] : []
    });

    // Content length
    const lengthScore = wordCount > 300 ? 100 : (wordCount / 300) * 100;
    scores.push({
      score: lengthScore,
      category: "Độ dài nội dung",
      suggestions: wordCount < 300 ? ["Nội dung nên dài ít nhất 300 từ"] : []
    });

    // Readability
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentences;
    const readabilityScore = avgWordsPerSentence < 20 ? 100 : (20 / avgWordsPerSentence) * 100;
    scores.push({
      score: readabilityScore,
      category: "Khả năng đọc",
      suggestions: avgWordsPerSentence > 20 ? ["Rút ngắn câu để dễ đọc hơn"] : []
    });

    return scores;
  };

  const seoScores = analyzeSeo(content);
  const overallScore = Math.round(seoScores.reduce((acc, curr) => acc + curr.score, 0) / seoScores.length);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Phân tích SEO</h3>
          <Badge variant={overallScore > 80 ? "success" : overallScore > 60 ? "warning" : "destructive"}>
            {overallScore}/100
          </Badge>
        </div>

        <div className="space-y-6">
          {seoScores.map((score, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{score.category}</span>
                <span className="text-sm text-gray-500">{Math.round(score.score)}%</span>
              </div>
              <Progress value={score.score} className="h-2" />
              {score.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-center text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {suggestion}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SeoAnalysis;
