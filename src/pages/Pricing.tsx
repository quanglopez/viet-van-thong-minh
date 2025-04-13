
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubscriptionPlans from '@/components/SubscriptionPlans'; // Changed to default import

const PricingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Chọn gói phù hợp với nhu cầu của bạn</h1>
            <p className="text-xl text-gray-600">
              Các gói dịch vụ linh hoạt cho mọi nhu cầu và ngân sách
            </p>
          </div>
          
          <SubscriptionPlans />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
