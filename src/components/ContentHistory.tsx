
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  Calendar, 
  Copy, 
  Trash2, 
  Edit,
  Clock,
  Tag
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export interface SavedContent {
  id: string;
  title: string;
  content: string;
  prompt: string;
  timestamp: Date;
  category?: string;
  settings?: {
    tone: string;
    dialect: string;
    voiceStyle: string;
    temperature: number;
    contentType: string;
    targetLength: string;
  };
}

interface ContentHistoryProps {
  savedContents: SavedContent[];
  onSelect: (content: SavedContent) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<SavedContent>) => void;
}

const ContentHistory: React.FC<ContentHistoryProps> = ({
  savedContents,
  onSelect,
  onDelete,
  onEdit
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const filteredContents = savedContents.filter(
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEditing = (id: string, currentTitle: string) => {
    setEditingTitle(id);
    setNewTitle(currentTitle);
  };

  const handleSaveEdit = (id: string) => {
    if (newTitle.trim()) {
      onEdit(id, { title: newTitle });
    }
    setEditingTitle(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="Tìm kiếm nội dung đã lưu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredContents.length > 0 ? (
          filteredContents.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                {editingTitle === item.id ? (
                  <div className="flex space-x-2">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      autoFocus
                      className="font-medium"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveEdit(item.id)}
                    >
                      Lưu
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSelect(item)}>
                          <Edit className="mr-2 h-4 w-4" /> Sử dụng lại
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(item.content);
                        }}>
                          <Copy className="mr-2 h-4 w-4" /> Sao chép
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStartEditing(item.id, item.title)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Đổi tên
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {item.content}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(item.timestamp), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </div>
                  
                  {item.category && (
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {item.category}
                    </div>
                  )}
                  
                  {item.settings?.tone && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.settings.tone === "professional" ? "Chuyên nghiệp" : 
                       item.settings.tone === "friendly" ? "Thân thiện" : 
                       item.settings.tone === "persuasive" ? "Thuyết phục" : 
                       item.settings.tone === "formal" ? "Trang trọng" : 
                       "Khác"}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onSelect(item)}
                >
                  Sử dụng nội dung này
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Chưa có nội dung nào được lưu"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentHistory;
