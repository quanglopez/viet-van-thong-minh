
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-display font-bold text-gradient">Việt Văn Thông Minh</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-vn-red transition-colors">Trang chủ</Link>
          <Link to="/templates" className="font-medium hover:text-vn-red transition-colors">Mẫu văn bản</Link>
          <Link to="/pricing" className="font-medium hover:text-vn-red transition-colors">Bảng giá</Link>
          <Link to="/blog" className="font-medium hover:text-vn-red transition-colors">Blog</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="font-medium">Đăng nhập</Button>
          <Button className="bg-vn-red hover:bg-vn-red/90 font-medium">Đăng ký</Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="font-medium py-2 hover:text-vn-red transition-colors" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
            <Link to="/templates" className="font-medium py-2 hover:text-vn-red transition-colors" onClick={() => setIsMenuOpen(false)}>Mẫu văn bản</Link>
            <Link to="/pricing" className="font-medium py-2 hover:text-vn-red transition-colors" onClick={() => setIsMenuOpen(false)}>Bảng giá</Link>
            <Link to="/blog" className="font-medium py-2 hover:text-vn-red transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full font-medium">Đăng nhập</Button>
              <Button className="w-full bg-vn-red hover:bg-vn-red/90 font-medium">Đăng ký</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
