import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Palette, History, Image as ImageIcon, FileUp, Users, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWithGemini } from "@/utils/geminiAI";
import { v4 as uuidv4 } from 'uuid';

// Import refactored components
import PromptForm from "./writing-interface/PromptForm";
import StyleSettings from "./writing-interface/StyleSettings";
import HistoryView from "./writing-interface/HistoryView";
import AdvancedSettings from "./writing-interface/AdvancedSettings";
import GenerateButton from "./writing-interface/GenerateButton";
import GeneratedContent from "./writing-interface/GeneratedContent";
import ComparisonView from "./writing-interface/ComparisonView";
import ImageGeneration from "./writing-interface/ImageGeneration";
import DocumentImport from "./writing-interface/DocumentImport";
import TeamCollaboration from "./writing-interface/TeamCollaboration";
import AnalyticsDashboard from "./writing-interface/AnalyticsDashboard";
import { templateCategories } from "./writing-interface/data";
import { ToneTemplate } from "./ToneStyleTemplates";
import { SavedContent } from "./ContentHistory";
import { WritingInterfaceProps } from "./writing-interface/types";

const WritingInterface: React.FC<WritingInterfaceProps> = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [comparisonContents, setComparisonContents] = useState<Array<{
    id: string;
    content: string;
    settings: { tone: string; dialect: string; };
  }>>([]);
  const [seoMetrics, setSeoMetrics] = useState({
    readability: 0,
    keywordDensity: 0,
    titleOptimization: 0,
    structureScore: 0
  });
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
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

  const handleGenerateComparison = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập yêu cầu nội dung của bạn",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setComparisonContents([]);

    try {
      const toneVariations = [
        { tone: "professional", dialect: "neutral" },
        { tone: "friendly", dialect: "neutral" }
      ];

      const results = await Promise.all(toneVariations.map(async (variation) => {
        let effectivePrompt = prompt;
        if (selectedTemplate && selectedCategory) {
          effectivePrompt = `[${selectedCategory} - ${selectedTemplate}]\n${prompt}`;
        }

        const result = await generateWithGemini(effectivePrompt, {
          temperature: temperature[0],
          maxTokens: 1024,
          tone: variation.tone,
          dialect: variation.dialect,
          voiceStyle,
          seoOptimize,
          targetLength,
          contentType
        });

        if (result.error) {
          throw new Error(result.error);
        }

        return {
          id: uuidv4(),
          content: result.text,
          settings: {
            tone: variation.tone,
            dialect: variation.dialect,
          }
        };
      }));

      setComparisonContents(results);
      setActiveTab("comparison");

      toast({
        title: "So sánh nội dung thành công!",
        description: "Đã tạo các phiên bản khác nhau để so sánh.",
      });
    } catch (error) {
      console.error("Error generating comparison:", error);
      toast({
        title: "Lỗi khi tạo nội dung so sánh",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau.",
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
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="template" className="text-lg py-3">
                <FileText className="mr-2" size={18} /> Tạo mới
              </TabsTrigger>
              <TabsTrigger value="styles" className="text-lg py-3">
                <Palette className="mr-2" size={18} /> Giọng điệu
              </TabsTrigger>
              <TabsTrigger value="history" className="text-lg py-3">
                <History className="mr-2" size={18} /> Lịch sử
              </TabsTrigger>
              <TabsTrigger value="images" className="text-lg py-3">
                <ImageIcon className="mr-2" size={18} /> Hình ảnh
              </TabsTrigger>
              <TabsTrigger value="import" className="text-lg py-3">
                <FileUp className="mr-2" size={18} /> Nhập liệu
              </TabsTrigger>
              <TabsTrigger value="team" className="text-lg py-3">
                <Users className="mr-2" size={18} /> Nhóm
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-lg py-3">
                <BarChart className="mr-2" size={18} /> Thống kê
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <PromptForm
                templateCategories={templateCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                prompt={prompt}
                setPrompt={setPrompt}
              />
              
              <div className="mt-8 space-y-4">
                <GenerateButton 
                  onClick={handleGenerate}
                  isGenerating={isGenerating}
                  disabled={!prompt.trim() || isGenerating}
                />
                
                <div className="text-center">
                  <button
                    onClick={handleGenerateComparison}
                    disabled={!prompt.trim() || isGenerating}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Tạo nhiều phiên bản để so sánh
                  </button>
                </div>
              </div>

              {generatedContent && (
                <GeneratedContent
                  content={generatedContent}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  onSave={() => setShowSaveDialog(true)}
                  showSaveDialog={showSaveDialog}
                  contentTitle={contentTitle}
                  setContentTitle={setContentTitle}
                  handleSaveContent={handleSaveContent}
                  setShowSaveDialog={setShowSaveDialog}
                />
              )}
            </TabsContent>

            <TabsContent value="styles">
              <StyleSettings
                onSelectToneTemplate={handleSelectToneTemplate}
                selectedToneTemplateId={selectedToneTemplateId}
              />
            </TabsContent>

            <TabsContent value="history">
              <HistoryView
                savedContents={savedContents}
                onSelect={handleSelectFromHistory}
                onDelete={handleDeleteContent}
                onEdit={handleEditContent}
              />
            </TabsContent>

            <TabsContent value="comparison">
              {comparisonContents.length > 0 ? (
                <ComparisonView
                  contents={comparisonContents}
                  onCopy={content => {
                    navigator.clipboard.writeText(content);
                    toast({
                      title: "Đã sao chép!",
                      description: "Nội dung đã được sao chép vào clipboard.",
                    });
                  }}
                  onDownload={content => {
                    const blob = new Blob([content], { type: "text/plain" });
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
                  }}
                  onSelect={content => {
                    setGeneratedContent(content);
                    setActiveTab("template");
                    toast({
                      title: "Đã chọn phiên bản",
                      description: "Phiên bản đã chọn sẽ được hiển thị trong trình soạn thảo.",
                    });
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Chưa có nội dung so sánh nào. Vui lòng tạo nội dung so sánh từ tab "Tạo mới".
                  </p>
                  <button
                    onClick={() => setActiveTab("template")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Quay lại tạo nội dung
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images">
              <ImageGeneration onImageGenerated={(url) => {
                setGeneratedContent((prev) => 
                  prev + `\n\n![Generated Image](${url})\n\n`
                );
                
                toast({
                  title: "Đã thêm hình ảnh",
                  description: "Hình ảnh đã được thêm vào nội dung của bạn.",
                });
              }} />
            </TabsContent>

            <TabsContent value="import">
              <DocumentImport onContentImported={(content) => {
                setPrompt(content);
                setActiveTab("template");
              }} />
            </TabsContent>

            <TabsContent value="team">
              <TeamCollaboration
                members={[
                  {
                    id: '1',
                    name: 'Người dùng mẫu',
                    email: 'user@example.com',
                    role: 'editor'
                  }
                ]}
                onInviteMember={(email) => {
                  toast({
                    title: "Đã gửi lời mời",
                    description: `Đã gửi lời mời đến ${email}`,
                  });
                }}
                onUpdateRole={(memberId, role) => {
                  toast({
                    title: "Đã cập nhật vai trò",
                    description: "Thay đổi vai trò thành công",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard
                data={{
                  contentGenerated: 150,
                  averageLength: 750,
                  topCategories: [
                    { name: "Blog", count: 45 },
                    { name: "Mạng xã hội", count: 35 },
                    { name: "Email", count: 20 }
                  ],
                  dailyStats: [
                    { date: "2024-03-01", generations: 12, engagementScore: 85 },
                    { date: "2024-03-02", generations: 15, engagementScore: 88 },
                    { date: "2024-03-03", generations: 10, engagementScore: 82 }
                  ]
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default WritingInterface;
