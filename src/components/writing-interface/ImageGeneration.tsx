
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImageGenerationProps {
  onImageGenerated?: (url: string) => void;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState([0.7]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // TODO: Integrate with actual AI image generation API
      const mockUrl = 'https://placekitten.com/400/300';
      setPreviewUrl(mockUrl);
      onImageGenerated?.(mockUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả hình ảnh</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phong cách</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Chân thực</SelectItem>
                  <SelectItem value="artistic">Nghệ thuật</SelectItem>
                  <SelectItem value="cartoon">Hoạt hình</SelectItem>
                  <SelectItem value="sketch">Phác họa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kích thước</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                  <SelectItem value="512x512">512x512</SelectItem>
                  <SelectItem value="256x256">256x256</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chất lượng</label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
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
        </div>
      </Card>

      {previewUrl && (
        <Card className="p-6">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageGeneration;
