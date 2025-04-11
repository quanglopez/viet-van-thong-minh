
import React from 'react';
import { Check, FileText, Globe, Languages, MessagesSquare, Settings, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: <FileText className="text-vn-red" size={32} />,
    title: "Template theo ngành nghề",
    description: "F&B, BĐS, giáo dục, du lịch, bán lẻ, thẩm mỹ và nhiều lĩnh vực khác."
  },
  {
    icon: <Sparkles className="text-vn-gold" size={32} />,
    title: "Chuẩn SEO tiếng Việt",
    description: "Tự động tối ưu từ khoá, heading, meta, ngôn ngữ hành động."
  },
  {
    icon: <Globe className="text-vn-leaf" size={32} />,
    title: "Viết lại với giọng địa phương",
    description: "Bắc – Trung – Nam, văn nói vs văn viết, formal vs friendly."
  },
  {
    icon: <Check className="text-vn-ocean" size={32} />,
    title: "Thư viện mẫu câu theo tâm lý người Việt",
    description: "Gợi ý CTA, tiêu đề hấp dẫn, đoạn mở bài thu hút."
  },
  {
    icon: <Settings className="text-vn-red" size={32} />,
    title: "Học giọng viết từ nội dung cũ",
    description: "Upload blog, post cũ để AI phân tích văn phong → tự động bắt chước phong cách riêng."
  },
  {
    icon: <Zap className="text-vn-gold" size={32} />,
    title: "Chuyển đổi định dạng thông minh",
    description: "Viết blog → tóm tắt thành post Facebook, email, caption ngắn..."
  },
  {
    icon: <MessagesSquare className="text-vn-leaf" size={32} />,
    title: "Viết bài theo trend Việt",
    description: "Cập nhật các xu hướng mạng xã hội, từ khóa hot trong nước."
  },
  {
    icon: <Languages className="text-vn-ocean" size={32} />,
    title: "Phối hợp giọng AI",
    description: "Kết hợp với TTS để chuyển bài viết thành audio giọng miền, dùng cho podcast hoặc video."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Tính năng nổi bật</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Việt Văn Thông Minh được thiết kế đặc biệt cho người Việt với các tính năng tối ưu cho nhu cầu nội địa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm card-hover"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
