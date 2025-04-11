
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Trợ lý viết nội dung AI <span className="text-gradient">đầu tiên cho người Việt</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-3xl mx-auto animate-slide-up">
            Công cụ viết nội dung AI được tối ưu hoàn toàn cho tiếng Việt, với các template, giọng điệu và chiến lược phù hợp đặc thù văn hóa địa phương.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <Button className="bg-vn-red hover:bg-vn-red/90 text-lg py-6 px-8">
              Dùng thử miễn phí
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8">
              Xem demo <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
