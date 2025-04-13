
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface ComparisonViewProps {
  contents: Array<{
    id: string;
    content: string;
    settings: {
      tone: string;
      dialect: string;
    };
  }>;
  onCopy: (content: string) => void;
  onDownload: (content: string) => void;
  onSelect: (content: string) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  contents,
  onCopy,
  onDownload,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contents.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              Giọng điệu: {item.settings.tone === "professional" ? "Chuyên nghiệp" : 
                          item.settings.tone === "friendly" ? "Thân thiện" : 
                          item.settings.tone === "persuasive" ? "Thuyết phục" : 
                          "Trung tính"} | 
              Ngôn ngữ: {item.settings.dialect === "northern" ? "Miền Bắc" : 
                        item.settings.dialect === "central" ? "Miền Trung" : 
                        item.settings.dialect === "southern" ? "Miền Nam" : 
                        "Trung tính"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onCopy(item.content)}>
                <Copy size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload(item.content)}>
                <Download size={16} />
              </Button>
            </div>
          </div>
          <div className="prose max-w-none mt-4">
            {item.content}
          </div>
          <Button 
            className="mt-4 w-full"
            variant="secondary"
            onClick={() => onSelect(item.content)}
          >
            Chọn phiên bản này
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default ComparisonView;
