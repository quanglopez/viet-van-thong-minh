
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Palette, History } from "lucide-react";
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
import { templateCategories } from "./writing-interface/data";
import { ToneTemplate } from "./ToneStyleTemplates";
import { SavedContent } from "./ContentHistory";
import { WritingInterfaceProps } from "./writing-interface/types";

const WritingInterface: React.FC<WritingInterfaceProps> = () => {
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

  // Load saved content from localStorage
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

  // Save content to localStorage when it changes
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
              <PromptForm
                templateCategories={templateCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                prompt={prompt}
                setPrompt={setPrompt}
              />
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

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <AdvancedSettings
                dialect={dialect}
                setDialect={setDialect}
                tone={tone}
                setTone={setTone}
                voiceStyle={voiceStyle}
                setVoiceStyle={setVoiceStyle}
                contentType={contentType}
                setContentType={setContentType}
                targetLength={targetLength}
                setTargetLength={setTargetLength}
                seoOptimize={seoOptimize}
                setSeoOptimize={setSeoOptimize}
                temperature={temperature}
                setTemperature={setTemperature}
              />

              <GenerateButton
                onClick={handleGenerate}
                isGenerating={isGenerating}
                disabled={isGenerating || !prompt.trim()}
              />

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
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default WritingInterface;
