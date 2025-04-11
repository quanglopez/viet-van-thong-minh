
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thanh Hà",
    position: "Content Creator",
    company: "Blog Du lịch Việt",
    content: "Công cụ tuyệt vời cho người sáng tạo nội dung. Việt Văn Thông Minh giúp tôi tiết kiệm 60% thời gian viết bài nhưng vẫn giữ được phong cách riêng.",
    avatar: "HA",
    rating: 5
  },
  {
    name: "Trần Minh Đức",
    position: "Giám đốc Marketing",
    company: "Nhà hàng Phố Xưa",
    content: "Cuối cùng cũng có một công cụ AI thực sự hiểu người Việt. Việc tạo nội dung quảng cáo trở nên dễ dàng với các mẫu đặc thù cho nhà hàng.",
    avatar: "TD",
    rating: 5
  },
  {
    name: "Phạm Thị Lan Anh",
    position: "Chuyên viên BĐS",
    company: "Sunshine Homes",
    content: "Các mẫu mô tả bất động sản chuyên nghiệp, giúp tôi tạo nội dung chất lượng một cách nhanh chóng. Khách hàng đánh giá cao thông tin chi tiết và hấp dẫn.",
    avatar: "LA",
    rating: 4
  },
  {
    name: "Lê Quang Vinh",
    position: "Quản lý",
    company: "Cửa hàng TechVina",
    content: "Đã dùng nhiều công cụ AI nhưng chưa có cái nào hiểu tiếng Việt như thế này. Mô tả sản phẩm giờ đây đúng chuẩn SEO và đọc rất tự nhiên.",
    avatar: "LV",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Người dùng từ nhiều ngành nghề khác nhau đang sử dụng Việt Văn Thông Minh để tạo nội dung chất lượng cao
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < testimonial.rating ? "fill-vn-gold text-vn-gold" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 min-h-[100px]">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-vn-red text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}, {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
