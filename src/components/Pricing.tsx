
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0đ",
    description: "Trải nghiệm cơ bản",
    features: [
      "10 bài viết mỗi tháng",
      "Truy cập template cơ bản",
      "Giới hạn 500 từ mỗi bài",
      "Không hỗ trợ SEO",
      "Không phân tích văn phong"
    ],
    cta: "Dùng miễn phí",
    popular: false,
  },
  {
    name: "Cá nhân",
    price: "149.000đ",
    billingPeriod: "/tháng",
    description: "Dành cho cá nhân, blogger",
    features: [
      "30 bài viết mỗi tháng",
      "Truy cập toàn bộ template",
      "Không giới hạn số từ",
      "Tối ưu SEO cơ bản",
      "Chỉnh sửa giọng điệu",
      "Chuyển đổi định dạng",
      "Hỗ trợ email ưu tiên"
    ],
    cta: "Đăng ký ngay",
    popular: true,
  },
  {
    name: "Doanh nghiệp nhỏ",
    price: "299.000đ",
    billingPeriod: "/tháng",
    description: "Dành cho đội nhỏ",
    features: [
      "100 bài viết mỗi tháng",
      "Truy cập toàn bộ template",
      "Không giới hạn số từ",
      "Tối ưu SEO nâng cao",
      "Phân tích văn phong của bạn",
      "3 người dùng",
      "Hỗ trợ trực tuyến ưu tiên",
    ],
    cta: "Đăng ký ngay",
    popular: false,
  },
  {
    name: "Doanh nghiệp",
    price: "499.000đ",
    billingPeriod: "/tháng",
    description: "Giải pháp doanh nghiệp",
    features: [
      "Không giới hạn bài viết",
      "Template tùy chỉnh",
      "AI tùy chỉnh riêng",
      "SEO chuyên sâu",
      "Phân tích văn phong nâng cao",
      "10+ người dùng",
      "Hỗ trợ chuyên viên riêng",
    ],
    cta: "Liên hệ",
    popular: false,
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bảng giá đơn giản, minh bạch</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Tất cả các gói đều bao gồm các tính năng cơ bản.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl overflow-hidden shadow-md ${
                plan.popular ? 'ring-2 ring-vn-red relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 w-full text-center bg-vn-red text-white py-1 text-sm font-medium">
                  Phổ biến nhất
                </div>
              )}
              <div className={`p-6 ${plan.popular ? 'pt-9' : ''}`}>
                <div className="text-center pb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.billingPeriod && (
                      <span className="text-gray-500 ml-1">{plan.billingPeriod}</span>
                    )}
                  </div>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center">
                      <Check size={18} className="text-vn-leaf min-w-[18px]" />
                      <span className="ml-2 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-vn-red hover:bg-vn-red/90' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
