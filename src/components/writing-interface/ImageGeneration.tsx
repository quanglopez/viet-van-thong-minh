
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationProps {
  onImageGenerated: (imageUrl: string) => void;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState<string>("1024x1024");
  const [style, setStyle] = useState<string>("vivid");
  const [quality, setQuality] = useState<number>(1);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data: secretData } = await supabase
        .functions.invoke("get-secret", {
          body: { name: "OPENAI_API_KEY" },
        });

      if (!secretData?.value) {
        throw new Error("API key not found");
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretData.value}`
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size,
          style,
          quality,
          model: "dall-e-3"
        })
      });

      const data = await response.json();
      if (data.data?.[0]?.url) {
        setPreviewUrl(data.data[0].url);
        onImageGenerated(data.data[0].url);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-medium">Tạo hình ảnh AI</h3>
      
      <div className="space-y-4">
        <Input
          placeholder="Mô tả hình ảnh bạn muốn tạo..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Kích thước" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">1024x1024</SelectItem>
              <SelectItem value="1792x1024">1792x1024</SelectItem>
              <SelectItem value="1024x1792">1024x1792</SelectItem>
            </SelectContent>
          </Select>

          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Phong cách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vivid">Sống động</SelectItem>
              <SelectItem value="natural">Tự nhiên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Chất lượng</label>
          <Slider
            value={[quality]}
            onValueChange={([value]) => setQuality(value)}
            max={2}
            step={1}
          />
        </div>

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
