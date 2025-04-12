
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onClick, 
  isGenerating, 
  disabled 
}) => {
  return (
    <div className="flex justify-center">
      <Button 
        onClick={onClick} 
        disabled={disabled} 
        className="bg-vn-red hover:bg-vn-red/90 py-6 px-8 text-lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            Đang tạo nội dung...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Tạo nội dung
          </>
        )}
      </Button>
    </div>
  );
};

export default GenerateButton;
