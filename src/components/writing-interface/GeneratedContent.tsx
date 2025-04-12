
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Copy, 
  Download, 
  Save, 
  Settings, 
  Languages, 
  CopyCheck
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContentProps {
  content: string;
  onCopy: () => void;
  onDownload: () => void;
  onSave: () => void;
  showSaveDialog: boolean;
  contentTitle: string;
  setContentTitle: (title: string) => void;
  handleSaveContent: () => void;
  setShowSaveDialog: (show: boolean) => void;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({
  content,
  onCopy,
  onDownload,
  onSave,
  showSaveDialog,
  contentTitle,
  setContentTitle,
  handleSaveContent,
  setShowSaveDialog
}) => {
  const { toast } = useToast();

  return (
    <div className="mt-8 border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Nội dung đã tạo</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy size={16} className="mr-1" />
            Sao chép
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download size={16} className="mr-1" />
            Tải xuống
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave}
          >
            <Save size={16} className="mr-1" />
            Lưu nội dung
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Chỉnh sửa
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Tùy chọn chỉnh sửa</h3>
                <div>
                  <Label className="mb-1 block">Làm ngắn hơn</Label>
                  <Button size="sm" variant="secondary" className="w-full">Rút gọn nội dung</Button>
                </div>
                <div>
                  <Label className="mb-1 block">Làm dài hơn</Label>
                  <Button size="sm" variant="secondary" className="w-full">Mở rộng nội dung</Button>
                </div>
                <div>
                  <Label className="mb-1 block">Giọng khác</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Chuyên nghiệp hơn</SelectItem>
                      <SelectItem value="friendly">Thân thiện hơn</SelectItem>
                      <SelectItem value="persuasive">Thuyết phục hơn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Languages size={16} className="mr-1" />
            Chuyển đổi
          </Button>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-md text-left whitespace-pre-wrap">
        {content}
      </div>

      {showSaveDialog && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Lưu nội dung này</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="content-title" className="mb-1 block">Tiêu đề</Label>
              <Input
                id="content-title"
                placeholder="Nhập tiêu đề để lưu..."
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveContent} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Lưu nội dung
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSaveDialog(false);
                  setContentTitle("");
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedContent;
