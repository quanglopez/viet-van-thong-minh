
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageGenerationProps {
  onImageGenerated: (imageUrl: string) => void;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Integration with image generation will be implemented here
      // For now, using a placeholder
      setPreviewUrl('/placeholder.svg');
      onImageGenerated('/placeholder.svg');
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Tạo hình ảnh AI</h3>
      <div className="space-y-4">
        <Input
          placeholder="Mô tả hình ảnh bạn muốn tạo..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Tạo hình ảnh
            </>
          )}
        </Button>
        
        {previewUrl && (
          <div className="mt-4">
            <img 
              src={previewUrl} 
              alt="Generated preview" 
              className="rounded-lg w-full"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageGeneration;
