import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SubscriptionPlans from '@/components/SubscriptionPlans';

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gói dịch vụ phù hợp với nhu cầu của bạn</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn và bắt đầu sáng tạo nội dung tiếng Việt chất lượng cao.
            </p>
          </div>
        </section>
        
        {/* Subscription Plans */}
        <SubscriptionPlans />
        
        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Token là gì và cách chúng được tính?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Token là đơn vị đo lường sử dụng trong mô hình ngôn ngữ AI. Mỗi token tương đương với khoảng 4 ký tự tiếng Việt. 
                    Khi bạn tạo nội dung, chúng tôi tính cả số token trong yêu cầu của bạn và trong văn bản được tạo ra. 
                    Ví dụ, một bài viết 1000 từ thường sử dụng khoảng 2000-3000 token.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Tôi có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào không?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Có, bạn có thể thay đổi gói dịch vụ bất cứ lúc nào từ trang hồ sơ của mình. 
                    Nếu bạn nâng cấp, chúng tôi sẽ tính phí chênh lệch theo tỷ lệ cho thời gian còn lại của chu kỳ thanh toán. 
                    Nếu bạn hạ cấp, thay đổi sẽ có hiệu lực vào đầu chu kỳ thanh toán tiếp theo.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Điều gì xảy ra nếu tôi sử dụng hết token trong tháng?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Khi bạn sử dụng hết token hàng tháng, bạn sẽ không thể tạo thêm nội dung mới cho đến khi giới hạn của bạn được làm mới vào đầu tháng tiếp theo. 
                    Bạn có thể chọn nâng cấp gói dịch vụ để có thêm token hoặc mua thêm token nếu bạn cần sử dụng ngay.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Có chính sách hoàn tiền không?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày kể từ ngày đăng ký gói trả phí. 
                    Nếu vì bất kỳ lý do gì bạn không hài lòng với dịch vụ, bạn có thể yêu cầu hoàn tiền đầy đủ trong thời gian này. 
                    Sau 7 ngày, chúng tôi không cung cấp hoàn tiền cho thời gian còn lại của chu kỳ thanh toán.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Tôi có thể sử dụng nội dung được tạo cho mục đích thương mại không?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Có, bạn sở hữu tất cả nội dung được tạo bằng dịch vụ của chúng tôi và có thể sử dụng cho bất kỳ mục đích nào, bao gồm cả sử dụng thương mại. 
                    Tuy nhiên, chúng tôi khuyến nghị bạn nên xem lại và chỉnh sửa nội dung trước khi xuất bản để đảm bảo độ chính xác và phù hợp với thương hiệu của bạn.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-6">Dữ liệu của tôi có được bảo mật không?</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    Chúng tôi coi trọng quyền riêng tư và bảo mật dữ liệu của bạn. Nội dung bạn tạo ra chỉ có thể được truy cập bởi tài khoản của bạn. 
                    Chúng tôi không sử dụng nội dung của bạn để huấn luyện các mô hình AI của mình. 
                    Để biết thêm chi tiết, vui lòng xem Chính sách Quyền riêng tư của chúng tôi.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng cao chất lượng nội dung của bạn?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Đăng ký ngay hôm nay và trải nghiệm sức mạnh của AI trong việc tạo nội dung tiếng Việt chất lượng cao.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/#demo" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Dùng thử miễn phí
              </a>
              <a href="/auth" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Đăng ký tài khoản
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
