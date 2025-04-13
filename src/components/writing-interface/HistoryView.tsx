
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SavedContent } from '../writing-interface/types';

interface HistoryViewProps {
  savedContents: SavedContent[];
  onSelect: (content: SavedContent) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<SavedContent>) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
  savedContents,
  onSelect,
  onDelete,
  onEdit
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4">Lịch sử nội dung đã tạo</h3>
        <p className="text-gray-600 mb-6">
          Truy cập và quản lý những nội dung bạn đã lưu trước đây
        </p>
        <div className="space-y-4">
          {savedContents.length === 0 ? (
            <p className="text-gray-500 text-center">Chưa có nội dung nào được lưu</p>
          ) : (
            savedContents.map((content) => (
              <div 
                key={content.id} 
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelect(content)}
              >
                <h4 className="font-medium mb-1">{content.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{content.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(content.created_at).toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(content);
                      }}
                    >
                      Chọn
                    </button>
                    <button 
                      className="text-xs text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(content.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
