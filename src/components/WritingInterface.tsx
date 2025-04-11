
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Languages, RefreshCw, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templateCategories = [
  {
    category: "Bán lẻ & E-commerce",
    templates: [
      "Mô tả sản phẩm tối ưu SEO",
      "Email marketing theo mùa",
      "Bài viết blog cho thương hiệu",
      "Nội dung quảng cáo Facebook"
    ]
  },
  {
    category: "Bất động sản",
    templates: [
      "Mô tả bất động sản chuyên nghiệp",
      "Email tiếp cận khách hàng tiềm năng",
      "Bài viết phân tích thị trường",
      "Nội dung landing page dự án"
    ]
  },
  {
    category: "Nhà hàng & F&B",
    templates: [
      "Mô tả món ăn hấp dẫn",
      "Quảng cáo khuyến mãi đặc biệt",
      "Nội dung cho menu điện tử",
      "Bài viết blog về ẩm thực"
    ]
  }
];

const WritingInterface = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialect, setDialect] = useState("neutral");
  const [tone, setTone] = useState("professional");
  const [voiceStyle, setVoiceStyle] = useState("written");

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập yêu cầu nội dung của bạn",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const sampleResponses = [
        "Nhà hàng Hương Việt tự hào giới thiệu thực đơn mới với các món ăn đậm đà hương vị Việt Nam truyền thống. Từ phở bò thơm ngon đến bánh xèo giòn rụm, mỗi món ăn đều được chế biến từ những nguyên liệu tươi ngon nhất, mang đến cho thực khách trải nghiệm ẩm thực đích thực của Việt Nam.",
        "Căn hộ cao cấp tại The Sunshine Residence sẽ mang đến cho gia đình bạn không gian sống lý tưởng. Với diện tích 85m², gồm 2 phòng ngủ, 2 phòng tắm cùng không gian sinh hoạt chung rộng rãi, căn hộ được thiết kế thông minh, tối ưu công năng sử dụng. Tận hưởng cuộc sống tiện nghi với đầy đủ tiện ích cao cấp: hồ bơi, phòng gym, khu vui chơi trẻ em và an ninh 24/7.",
        "Khóa học 'Marketing Online Hiệu Quả' cung cấp cho học viên những kiến thức và kỹ năng cần thiết để xây dựng chiến lược marketing số thành công. Chương trình học được thiết kế bởi các chuyên gia hàng đầu với hơn 10 năm kinh nghiệm trong ngành, giúp học viên nắm vững các công cụ digital marketing hiện đại và áp dụng hiệu quả vào thực tiễn kinh doanh."
      ];
      
      setGeneratedContent(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
      setIsGenerating(false);
      
      toast({
        title: "Tạo nội dung thành công!",
        description: "Nội dung của bạn đã được tạo.",
      });
    }, 2000);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trải nghiệm công cụ viết nội dung</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tạo nội dung chất lượng cao phù hợp với văn hóa Việt Nam chỉ trong vài giây
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="template" className="text-lg py-3">
                <FileText className="mr-2" size={18} /> Theo mẫu
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-lg py-3">
                <Sparkles className="mr-2" size={18} /> Tùy chỉnh
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template">
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

                  {selectedTemplate && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Thông tin cụ thể</label>
                      <Textarea
                        placeholder="Nhập thông tin chi tiết về nhu cầu của bạn..."
                        className="min-h-[120px] mb-2"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Ví dụ: Tên sản phẩm, đặc điểm, đối tượng khách hàng, ...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Yêu cầu của bạn</label>
                    <Textarea
                      placeholder="Nhập yêu cầu nội dung của bạn..."
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="min-w-[200px] flex-1">
                  <label className="block text-sm font-medium mb-2">Giọng địa phương</label>
                  <Select value={dialect} onValueChange={setDialect}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Trung lập</SelectItem>
                      <SelectItem value="northern">Miền Bắc</SelectItem>
                      <SelectItem value="central">Miền Trung</SelectItem>
                      <SelectItem value="southern">Miền Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[200px] flex-1">
                  <label className="block text-sm font-medium mb-2">Giọng điệu</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                      <SelectItem value="friendly">Thân thiện</SelectItem>
                      <SelectItem value="persuasive">Thuyết phục</SelectItem>
                      <SelectItem value="formal">Trang trọng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="min-w-[200px] flex-1">
                  <label className="block text-sm font-medium mb-2">Văn phong</label>
                  <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="written">Văn viết</SelectItem>
                      <SelectItem value="spoken">Văn nói</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()} 
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

              {generatedContent && (
                <div className="mt-8 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Nội dung đã tạo</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings size={16} className="mr-1" />
                        Chỉnh sửa
                      </Button>
                      <Button variant="outline" size="sm">
                        <Languages size={16} className="mr-1" />
                        Chuyển đổi
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md text-left">
                    {generatedContent}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default WritingInterface;
