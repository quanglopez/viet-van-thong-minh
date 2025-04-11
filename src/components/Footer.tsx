
import React from 'react';
import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
import { Instagram, Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Việt Văn Thông Minh</h3>
            <p className="text-gray-400 mb-4">
              Công cụ viết nội dung AI được tối ưu hoàn toàn cho tiếng Việt, với các template, giọng điệu và chiến lược phù hợp đặc thù văn hóa địa phương.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Sản phẩm</h4>
            <ul className="space-y-2">
              <li><Link to="/templates" className="text-gray-400 hover:text-white transition-colors">Thư viện mẫu</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Bảng giá</Link></li>
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Tính năng</Link></li>
              <li><Link to="/updates" className="text-gray-400 hover:text-white transition-colors">Cập nhật</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Trung tâm hỗ trợ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors">Tài liệu hướng dẫn</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-vn-gold" />
                <a href="tel:0708684608" className="text-gray-400 hover:text-white transition-colors">0708684608</a>
              </li>
              <li className="flex items-center">
                <MessageSquare size={16} className="mr-2 text-vn-gold" />
                <a href="https://zalo.me/0708684608" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Zalo: 0708684608</a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-vn-gold" />
                <span className="text-gray-400">Landmark 81, Quận Bình Thạnh, TPHCM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Việt Văn Thông Minh. Đã đăng ký bản quyền.</p>
            <div className="flex mt-4 md:mt-0">
              <Link to="/terms" className="mr-4 hover:text-white transition-colors">Điều khoản sử dụng</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
