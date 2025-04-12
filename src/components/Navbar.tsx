
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || user.email} />
                    <AvatarFallback>
                      {user.user_metadata.full_name 
                        ? getInitials(user.user_metadata.full_name) 
                        : user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.user_metadata.full_name || 'Người dùng'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="font-medium" asChild>
                <Link to="/auth">Đăng nhập</Link>
              </Button>
              <Button className="bg-vn-red hover:bg-vn-red/90 font-medium" asChild>
                <Link to="/auth?tab=register">Đăng ký</Link>
              </Button>
            </>
          )}
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
            
            {user ? (
              <div className="border-t pt-4 mt-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback>
                      {user.user_metadata.full_name 
                        ? getInitials(user.user_metadata.full_name) 
                        : user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.user_metadata.full_name || 'Người dùng'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="block py-2 hover:text-vn-red transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </div>
                </Link>
                <button 
                  className="w-full flex items-center py-2 hover:text-vn-red transition-colors text-red-600" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" className="w-full font-medium" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link>
                </Button>
                <Button className="w-full bg-vn-red hover:bg-vn-red/90 font-medium" asChild>
                  <Link to="/auth?tab=register" onClick={() => setIsMenuOpen(false)}>Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
