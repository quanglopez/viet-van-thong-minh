
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface AdvancedSettingsProps {
  dialect: string;
  setDialect: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  voiceStyle: string;
  setVoiceStyle: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  targetLength: string;
  setTargetLength: (value: string) => void;
  seoOptimize: boolean;
  setSeoOptimize: (value: boolean) => void;
  temperature: number[];
  setTemperature: (value: number[]) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  dialect,
  setDialect,
  tone,
  setTone,
  voiceStyle,
  setVoiceStyle,
  contentType,
  setContentType,
  targetLength,
  setTargetLength,
  seoOptimize,
  setSeoOptimize,
  temperature,
  setTemperature
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Giọng địa phương</label>
          <Select value={dialect} onValueChange={setDialect}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Trung lập</SelectItem>
              <SelectItem value="northern">Miền Bắc</SelectItem>
              <SelectItem value="central">Miền Trung</SelectItem>
              <SelectItem value="southern">Miền Nam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Giọng điệu</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Chuyên nghiệp</SelectItem>
              <SelectItem value="friendly">Thân thiện</SelectItem>
              <SelectItem value="persuasive">Thuyết phục</SelectItem>
              <SelectItem value="formal">Trang trọng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Văn phong</label>
          <Select value={voiceStyle} onValueChange={setVoiceStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="written">Văn viết</SelectItem>
              <SelectItem value="spoken">Văn nói</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Loại nội dung</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Chung</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="social">Mạng xã hội</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="product">Mô tả sản phẩm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Độ dài</label>
          <Select value={targetLength} onValueChange={setTargetLength}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Ngắn (&lt; 300 từ)</SelectItem>
              <SelectItem value="medium">Trung bình (500-800 từ)</SelectItem>
              <SelectItem value="long">Dài (1000-1500 từ)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="seo" 
            checked={seoOptimize}
            onCheckedChange={setSeoOptimize}
          />
          <Label htmlFor="seo">Tối ưu SEO</Label>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Độ sáng tạo: {temperature[0].toFixed(1)}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-1" />
                Chi tiết
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <h3 className="font-medium mb-2">Độ sáng tạo là gì?</h3>
              <p className="text-sm text-gray-600">
                Độ sáng tạo thấp (0.1-0.3) sẽ tạo ra nội dung nhất quán, chính xác. 
                Độ sáng tạo cao (0.7-1.0) sẽ tạo ra nội dung đa dạng, sáng tạo hơn.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <Slider
          value={temperature}
          onValueChange={setTemperature}
          min={0.1}
          max={1.0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Chính xác</span>
          <span>Sáng tạo</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
