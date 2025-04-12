
import React, { useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';

interface DocumentImportProps {
  onContentImported: (content: string) => void;
}

const DocumentImport: React.FC<DocumentImportProps> = ({ onContentImported }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        onContentImported(content);
      };
      reader.readAsText(file);
    });
  }, [onContentImported]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Thả tệp vào đây...' : 'Kéo và thả tệp hoặc click để chọn'}
        </p>
        <p className="text-sm text-gray-500">
          Hỗ trợ các định dạng: TXT, MD, DOC, DOCX
        </p>
      </div>
    </Card>
  );
};

export default DocumentImport;
