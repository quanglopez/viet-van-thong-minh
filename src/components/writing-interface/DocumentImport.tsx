
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DocumentImportProps {
  onContentImported: (content: string) => void;
}

const DocumentImport: React.FC<DocumentImportProps> = ({ onContentImported }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      onContentImported(text);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Nhập tài liệu</h3>
      <div className="space-y-4">
        <div className="flex justify-center items-center border-2 border-dashed rounded-lg p-6">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Tải tài liệu lên
                </>
              )}
            </Button>
          </label>
        </div>
      </div>
    </Card>
  );
};

export default DocumentImport;
