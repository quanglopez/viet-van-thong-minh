import React, { useState, useEffect } from 'react';
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
  CheckSquare,
  Save,
  History,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWithGemini } from "@/utils/geminiAI";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ToneStyleTemplates, { ToneTemplate } from "./ToneStyleTemplates";
import ContentHistory, { SavedContent } from "./ContentHistory";
import { v4 as uuidv4 } from 'uuid';

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
  const [selectedToneTemplateId, setSelectedToneTemplateId] = useState<string | null>(null);
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [contentTitle, setContentTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("template");

  useEffect(() => {
    const savedContentData = localStorage.getItem('savedContents');
    if (savedContentData) {
      try {
        const parsedData = JSON.parse(savedContentData).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setSavedContents(parsedData);
      } catch (error) {
        console.error("Error loading saved content:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (savedContents.length > 0) {
      localStorage.setItem('savedContents', JSON.stringify(savedContents));
    }
  }, [savedContents]);

  const handleSelectToneTemplate = (template: ToneTemplate) => {
    setSelectedToneTemplateId(template.id);
    setTone(template.settings.tone);
    setDialect(template.settings.dialect);
    setVoiceStyle(template.settings.voiceStyle);
    setTemperature([template.settings.temperature]);
    
    toast({
      title: "Mẫu giọng điệu đã được áp dụng",
      description: `Đã áp dụng "${template.name}" cho nội dung của bạn.`,
    });
  };

  const handleSaveContent = () => {
    if (!generatedContent || !contentTitle.trim()) {
      toast({
        title: "Không thể lưu",
        description: "Vui lòng tạo nội dung và nhập tiêu đề trước khi lưu.",
        variant: "destructive",
      });
      return;
    }

    const newContent: SavedContent = {
      id: uuidv4(),
      title: contentTitle,
      content: generatedContent,
      prompt: prompt,
      timestamp: new Date(),
      category: selectedCategory && selectedTemplate ? `${selectedCategory} - ${selectedTemplate}` : undefined,
      settings: {
        tone,
        dialect,
        voiceStyle,
        temperature: temperature[0],
        contentType,
        targetLength
      }
    };

    setSavedContents(prevContents => [newContent, ...prevContents]);
    setShowSaveDialog(false);
    setContentTitle("");

    toast({
      title: "Đã lưu nội dung",
      description: "Nội dung của bạn đã được lưu vào lịch sử.",
    });
  };

  const handleDeleteContent = (id: string) => {
    setSavedContents(prevContents => prevContents.filter(item => item.id !== id));
    
    toast({
      title: "Đã xóa nội dung",
      description: "Nội dung đã được xóa khỏi lịch sử.",
    });
  };

  const handleEditContent = (id: string, updates: Partial<SavedContent>) => {
    setSavedContents(prevContents => 
      prevContents.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    
    toast({
      title: "Đã cập nhật nội dung",
      description: "Nội dung đã được cập nhật thành công.",
    });
  };

  const handleSelectFromHistory = (content: SavedContent) => {
    setGeneratedContent(content.content);
    setPrompt(content.prompt);
    
    if (content.settings) {
      setTone(content.settings.tone);
      setDialect(content.settings.dialect);
      setVoiceStyle(content.settings.voiceStyle);
      setTemperature([content.settings.temperature]);
      setContentType(content.settings.contentType);
      setTargetLength(content.settings.targetLength);
    }
    
    if (content.category) {
      const [category, template] = content.category.split(" - ");
      setSelectedCategory(category);
      setSelectedTemplate(template);
    }
    
    setActiveTab("template");
    
    toast({
      title: "Đã tải nội dung",
      description: "Nội dung đã lưu đã được tải vào trình soạn thảo.",
    });
  };

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="template" className="text-lg py-3">
                <FileText className="mr-2" size={18} /> Tạo mới
              </TabsTrigger>
              <TabsTrigger value="styles" className="text-lg py-3">
                <Palette className="mr-2" size={18} /> Giọng điệu
              </TabsTrigger>
              <TabsTrigger value="history" className="text-lg py-3">
                <History className="mr-2" size={18} /> Lịch sử
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

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Yêu cầu của bạn</label>
                    <Textarea
                      placeholder={selectedTemplate 
                        ? "Nhập thông tin chi tiết về nhu cầu của bạn..." 
                        : "Nhập yêu cầu nội dung của bạn..."}
                      className="min-h-[120px] mb-2"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    {selectedTemplate && (
                      <p className="text-sm text-gray-500">
                        Ví dụ: Tên sản phẩm, đặc điểm, đối tượng khách hàng, ...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="styles">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-4">Chọn giọng điệu và phong cách</h3>
                  <p className="text-gray-600 mb-6">
                    Lựa chọn các mẫu giọng điệu và phong cách để tối ưu hóa nội dung của bạn
                  </p>
                  <ToneStyleTemplates 
                    onSelectTemplate={handleSelectToneTemplate} 
                    selectedTemplateId={selectedToneTemplateId}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-4">Lịch sử nội dung đã tạo</h3>
                  <p className="text-gray-600 mb-6">
                    Truy cập và quản lý những nội dung bạn đã lưu trước đây
                  </p>
                  <ContentHistory
                    savedContents={savedContents}
                    onSelect={handleSelectFromHistory}
                    onDelete={handleDeleteContent}
                    onEdit={handleEditContent}
                  />
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowSaveDialog(true)}
                      >
                        <Save size={16} className="mr-1" />
                        Lưu nội dung
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

                  {showSaveDialog && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Lưu nội dung này</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="content-title" className="mb-1 block">Tiêu đề</Label>
                          <Input
                            id="content-title"
                            placeholder="Nhập tiêu đề để lưu..."
                            value={contentTitle}
                            onChange={(e) => setContentTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveContent} className="flex-1">
                            <Save className="mr-2 h-4 w-4" /> Lưu nội dung
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowSaveDialog(false);
                              setContentTitle("");
                            }}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
