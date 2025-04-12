
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ContentHistory, { SavedContent } from "../ContentHistory";

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
        <ContentHistory
          savedContents={savedContents}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </CardContent>
    </Card>
  );
};

export default HistoryView;
