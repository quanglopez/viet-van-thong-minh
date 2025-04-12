import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, User, History, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi tài khoản."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      
      toast({
        variant: "destructive",
        title: "Lỗi đăng xuất",
        description: "Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại."
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">VietVan AI</span>
              <Badge variant="outline" className="ml-2 hidden sm:inline-flex">Beta</Badge>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-primary' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
            >
              Trang chủ
            </Link>
            <Link 
              to="/history" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/history' 
                  ? 'text-primary' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
            >
              Lịch sử nội dung
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/pricing' 
                  ? 'text-primary' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
            >
              Bảng giá
            </Link>
          </div>

          {/* User menu or auth buttons */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.email}</span>
                      <span className="text-xs text-muted-foreground">Tài khoản cá nhân</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Tạo nội dung</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="flex items-center cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>Lịch sử nội dung</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/auth">Đăng nhập</Link>
                </Button>
                <Button asChild className="hidden sm:flex">
                  <Link to="/auth?signup=true">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
              onClick={toggleMenu}
            >
              Trang chủ
            </Link>
            <Link 
              to="/history" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/history' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
              onClick={toggleMenu}
            >
              Lịch sử nội dung
            </Link>
            <Link 
              to="/pricing" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/pricing' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-foreground/60 hover:text-primary hover:bg-muted'
              }`}
              onClick={toggleMenu}
            >
              Bảng giá
            </Link>
            {user && (
              <>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/profile' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={toggleMenu}
                >
                  Hồ sơ cá nhân
                </Link>
                <button 
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground/60 hover:text-primary hover:bg-muted"
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
