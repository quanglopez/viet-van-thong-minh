
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
import { 
  FileText, 
  Languages, 
  RefreshCw, 
  Settings, 
  Sparkles,
  Copy,
  Download,
  Share2,
  Sliders,
  BookOpen,
  CheckSquare 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWithGemini } from "@/utils/geminiAI";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [seoOptimize, setSeoOptimize] = useState(false);
  const [contentType, setContentType] = useState("general");
  const [targetLength, setTargetLength] = useState("medium");
  const [temperature, setTemperature] = useState([0.7]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập yêu cầu nội dung của bạn",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let effectivePrompt = prompt;
      
      if (selectedTemplate && selectedCategory) {
        effectivePrompt = `[${selectedCategory} - ${selectedTemplate}]\n${prompt}`;
      }
      
      const result = await generateWithGemini(effectivePrompt, {
        temperature: temperature[0],
        maxTokens: 1024,
        tone,
        dialect,
        voiceStyle,
        seoOptimize,
        targetLength,
        contentType
      });
      
      if (result.error) {
        toast({
          title: "Lỗi tạo nội dung",
          description: result.error,
          variant: "destructive",
        });
        setGeneratedContent("");
      } else {
        setGeneratedContent(result.text);
        toast({
          title: "Tạo nội dung thành công!",
          description: "Nội dung của bạn đã được tạo bằng Gemini 1.5 Pro.",
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Lỗi hệ thống",
        description: "Có lỗi xảy ra khi tạo nội dung, vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Đã sao chép!",
      description: "Nội dung đã được sao chép vào clipboard.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "viet-van-content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Đã tải xuống!",
      description: "Nội dung đã được tải xuống dưới dạng file văn bản.",
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trải nghiệm công cụ viết nội dung</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tạo nội dung chất lượng cao phù hợp với văn hóa Việt Nam chỉ trong vài giây với Gemini 1.5 Pro
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <div>
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

                  <div>
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
                  
                  <div>
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
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại nội dung</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Chung</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="social">Mạng xã hội</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="product">Mô tả sản phẩm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Độ dài</label>
                    <Select value={targetLength} onValueChange={setTargetLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Ngắn (&lt; 300 từ)</SelectItem>
                        <SelectItem value="medium">Trung bình (500-800 từ)</SelectItem>
                        <SelectItem value="long">Dài (1000-1500 từ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="seo" 
                      checked={seoOptimize}
                      onCheckedChange={setSeoOptimize}
                    />
                    <Label htmlFor="seo">Tối ưu SEO</Label>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Độ sáng tạo: {temperature[0].toFixed(1)}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <h3 className="font-medium mb-2">Độ sáng tạo là gì?</h3>
                      <p className="text-sm text-gray-600">
                        Độ sáng tạo thấp (0.1-0.3) sẽ tạo ra nội dung nhất quán, chính xác. 
                        Độ sáng tạo cao (0.7-1.0) sẽ tạo ra nội dung đa dạng, sáng tạo hơn.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Chính xác</span>
                  <span>Sáng tạo</span>
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
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy size={16} className="mr-1" />
                        Sao chép
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download size={16} className="mr-1" />
                        Tải xuống
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings size={16} className="mr-1" />
                            Chỉnh sửa
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                          <div className="space-y-4">
                            <h3 className="font-medium">Tùy chọn chỉnh sửa</h3>
                            <div>
                              <Label className="mb-1 block">Làm ngắn hơn</Label>
                              <Button size="sm" variant="secondary" className="w-full">Rút gọn nội dung</Button>
                            </div>
                            <div>
                              <Label className="mb-1 block">Làm dài hơn</Label>
                              <Button size="sm" variant="secondary" className="w-full">Mở rộng nội dung</Button>
                            </div>
                            <div>
                              <Label className="mb-1 block">Giọng khác</Label>
                              <Select defaultValue="professional">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="professional">Chuyên nghiệp hơn</SelectItem>
                                  <SelectItem value="friendly">Thân thiện hơn</SelectItem>
                                  <SelectItem value="persuasive">Thuyết phục hơn</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button variant="outline" size="sm">
                        <Languages size={16} className="mr-1" />
                        Chuyển đổi
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md text-left whitespace-pre-wrap">
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
