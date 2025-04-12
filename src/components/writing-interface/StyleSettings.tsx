
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ToneStyleTemplates, { ToneTemplate } from "../ToneStyleTemplates";

interface StyleSettingsProps {
  onSelectToneTemplate: (template: ToneTemplate) => void;
  selectedToneTemplateId: string | null;
}

const StyleSettings: React.FC<StyleSettingsProps> = ({ 
  onSelectToneTemplate, 
  selectedToneTemplateId 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4">Chọn giọng điệu và phong cách</h3>
        <p className="text-gray-600 mb-6">
          Lựa chọn các mẫu giọng điệu và phong cách để tối ưu hóa nội dung của bạn
        </p>
        <ToneStyleTemplates 
          onSelectTemplate={onSelectToneTemplate} 
          selectedTemplateId={selectedToneTemplateId}
        />
      </CardContent>
    </Card>
  );
};

export default StyleSettings;
