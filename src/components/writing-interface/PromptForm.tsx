
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TemplateCategory {
  category: string;
  templates: string[];
}

interface PromptFormProps {
  templateCategories: TemplateCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  templateCategories,
  selectedCategory,
  setSelectedCategory,
  selectedTemplate,
  setSelectedTemplate,
  prompt,
  setPrompt
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Chọn danh mục</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục ngành nghề" />
            </SelectTrigger>
            <SelectContent>
              {templateCategories.map((cat) => (
                <SelectItem key={cat.category} value={cat.category}>
                  {cat.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Chọn mẫu</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu nội dung" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories
                  .find((cat) => cat.category === selectedCategory)
                  ?.templates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Yêu cầu của bạn</label>
          <Textarea
            placeholder={selectedTemplate 
              ? "Nhập thông tin chi tiết về nhu cầu của bạn..." 
              : "Nhập yêu cầu nội dung của bạn..."}
            className="min-h-[120px] mb-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {selectedTemplate && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Ví dụ: Tên sản phẩm, đặc điểm, đối tượng khách hàng, ...
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Gợi ý:</span>
                <button 
                  className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setPrompt(prompt + " Tập trung vào điểm mạnh sản phẩm")}
                >
                  + Điểm mạnh
                </button>
                <button
                  className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200" 
                  onClick={() => setPrompt(prompt + " Nhấn mạnh lợi ích cho người dùng")}
                >
                  + Lợi ích
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptForm;
