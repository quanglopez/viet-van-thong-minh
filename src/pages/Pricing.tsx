
import React from 'react';
import { CheckCircle2, CircleDollarSign, BadgePlus, Users, Rocket } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck } from 'lucide-react';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  popular = false 
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[]; 
  buttonText: string;
  popular?: boolean;
}) => {
  return (
    <Card className={`shadow-lg ${popular ? 'border-vn-red border-2 relative' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-vn-red text-white px-4 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
          Phổ biến nhất
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Miễn phí" && <span className="text-muted-foreground">/tháng</span>}
        </div>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full py-6 ${popular ? 'bg-vn-red hover:bg-vn-red/90' : ''}`}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Gói dịch vụ phù hợp với mọi nhu cầu</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chọn gói dịch vụ phù hợp với nhu cầu của bạn và bắt đầu tạo nội dung chất lượng ngay hôm nay.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <PricingCard 
                title="Miễn phí" 
                price="Miễn phí" 
                description="Dành cho người mới bắt đầu muốn trải nghiệm." 
                features={[
                  "10 bài viết mỗi tháng",
                  "Mẫu cơ bản",
                  "Giọng điệu tiêu chuẩn",
                  "Giới hạn 500 từ/bài",
                ]}
                buttonText="Bắt đầu miễn phí"
              />
              
              <PricingCard 
                title="Cá nhân" 
                price="149K" 
                description="Dành cho cá nhân sáng tạo nội dung." 
                features={[
                  "50 bài viết mỗi tháng",
                  "Tất cả mẫu cơ bản",
                  "Tùy chọn giọng điệu",
                  "Giọng địa phương Bắc-Trung-Nam",
                  "Tối ưu SEO cơ bản",
                  "Không giới hạn độ dài",
                ]}
                buttonText="Đăng ký ngay"
                popular={true}
              />
              
              <PricingCard 
                title="Doanh nghiệp nhỏ" 
                price="299K" 
                description="Dành cho doanh nghiệp vừa và nhỏ." 
                features={[
                  "150 bài viết mỗi tháng",
                  "Tất cả mẫu chuyên nghiệp",
                  "Hỗ trợ tất cả giọng điệu",
                  "Phân tích văn phong từ nội dung",
                  "Tối ưu SEO nâng cao",
                  "Chuyển đổi định dạng",
                ]}
                buttonText="Đăng ký ngay"
              />
              
              <PricingCard 
                title="Doanh nghiệp" 
                price="499K" 
                description="Giải pháp cho doanh nghiệp lớn." 
                features={[
                  "Không giới hạn lượt dùng",
                  "Nhiều người dùng (5 tài khoản)",
                  "API tích hợp",
                  "AI học phong cách thương hiệu",
                  "Đào tạo và hỗ trợ ưu tiên",
                  "Báo cáo và phân tích",
                ]}
                buttonText="Liên hệ tư vấn"
              />
            </div>
            
            <div className="mt-20 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Câu hỏi thường gặp</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Tôi có thể nâng cấp hoặc hạ cấp gói dịch vụ của mình không?</h3>
                  <p className="text-gray-600">Có, bạn có thể thay đổi gói dịch vụ bất kỳ lúc nào. Việc nâng cấp sẽ có hiệu lực ngay lập tức, và việc hạ cấp sẽ có hiệu lực vào kỳ thanh toán tiếp theo.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Tôi thanh toán bằng phương thức nào?</h3>
                  <p className="text-gray-600">Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và các ví điện tử phổ biến như MoMo, ZaloPay, và VNPay.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Tôi có được hoàn tiền nếu không hài lòng không?</h3>
                  <p className="text-gray-600">Có, chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Vẫn còn thắc mắc?</h2>
              <p className="text-gray-600 mb-6">Liên hệ với đội ngũ hỗ trợ của chúng tôi để được giải đáp.</p>
              <Button variant="outline" size="lg" className="px-8">
                Liên hệ hỗ trợ
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
