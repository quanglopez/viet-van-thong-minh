import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Edit, Key, LogOut, Trash, History, BookOpenText, BarChart3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Profile = Tables<"profiles">;
type UserContent = Tables<'user_content'>;

const ProfilePage = () => {
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [contentHistory, setContentHistory] = useState<UserContent[]>([]);
  const [usageStats, setUsageStats] = useState({
    contentCount: 0,
    totalTokensUsed: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        setUsername(data.username || "");
        setFullName(data.full_name || "");

        // Fetch user content (most recent 10)
        const { data: contentData, error: contentError } = await supabase
          .from('user_content')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (contentError) throw contentError;
        setContentHistory(contentData || []);

        // Fetch aggregate statistics
        const { data: statsData, error: statsError } = await supabase
          .from('content_analytics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        
        if (statsData) {
          setUsageStats({
            contentCount: statsData.total_content_count || 0,
            totalTokensUsed: statsData.total_tokens_used || 0
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin hồ sơ."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin hồ sơ của bạn đã được cập nhật."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể cập nhật hồ sơ."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // If user is not logged in, redirect to login page
  if (!user && !isLoading) {
    return <Navigate to="/auth" replace />;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vn-red" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSubscriptionName = (tier: string | null | undefined) => {
    switch (tier) {
      case 'free': return 'Miễn phí';
      case 'basic': return 'Cơ bản';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Doanh nghiệp';
      default: return 'Không xác định';
    }
  };

  const getTokenUsagePercentage = () => {
    if (!profile) return 0;
    return Math.min(100, Math.round((profile.tokens_used / profile.monthly_token_limit) * 100));
  };

  const getSubscriptionColor = (tier: string | null | undefined) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Thông tin tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile ? getInitials(profile.full_name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xl font-semibold">{profile?.full_name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
                <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                    />
                    <p className="text-sm text-muted-foreground">
                      Email không thể thay đổi
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-vn-red hover:bg-vn-red/90"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="history" className="flex-1">
            <History className="mr-2 h-4 w-4" />
            Lịch sử nội dung
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart3 className="mr-2 h-4 w-4" />
            Thống kê sử dụng
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử nội dung</CardTitle>
              <CardDescription>Các nội dung gần đây bạn đã tạo</CardDescription>
            </CardHeader>
            <CardContent>
              {contentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Bạn chưa tạo nội dung nào</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                    Tạo nội dung đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentHistory.map((content) => (
                    <Card key={content.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{content.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {formatDate(content.created_at)}
                              {content.category && ` • ${content.category}`}
                              {content.status && ` • ${content.status === 'published' ? 'Đã xuất bản' : content.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}`}
                            </CardDescription>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm line-clamp-3">{content.content}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-2 flex justify-between bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          {content.tokens_used} tokens
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/?content=' + content.id)}>
                          Chỉnh sửa
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            {contentHistory.length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
                  Xem tất cả
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê sử dụng</CardTitle>
              <CardDescription>Thống kê về việc sử dụng nền tảng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tổng nội dung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{usageStats.contentCount}</div>
                    <p className="text-sm text-muted-foreground mt-1">Số nội dung đã tạo</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tổng token đã sử dụng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{usageStats.totalTokensUsed}</div>
                    <p className="text-sm text-muted-foreground mt-1">Tổng lượng token đã sử dụng</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Token đã dùng tháng này</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{profile?.tokens_used || 0}</div>
                    <div className="mt-2">
                      <Progress value={getTokenUsagePercentage()} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{profile?.tokens_used || 0}</span>
                        <span>{profile?.monthly_token_limit || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Trung bình token/nội dung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {usageStats.contentCount > 0 
                        ? Math.round(usageStats.totalTokensUsed / usageStats.contentCount) 
                        : 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Token trung bình mỗi nội dung</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Quản lý API keys để tích hợp với hệ thống của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex mt-1">
                    <Input id="apiKey" type="password" value="••••••••••••••••••••••" readOnly className="flex-1" />
                    <Button variant="outline" className="ml-2">Hiển thị</Button>
                    <Button variant="outline" className="ml-2">Tạo mới</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    API Key cho phép bạn tích hợp VietVan với ứng dụng của bạn.
                  </p>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="font-medium mb-2">Giới hạn API</h3>
                  <p className="text-sm text-muted-foreground">
                    Với gói {getSubscriptionName(profile?.subscription_tier)}, bạn có thể gọi
                    {' '}<span className="font-medium">100 requests/giờ</span> và
                    {' '}<span className="font-medium">{profile?.monthly_token_limit} tokens/tháng</span>.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Để nâng cấp giới hạn API, vui lòng nâng cấp gói dịch vụ của bạn.
                  </p>
                  <Button className="mt-4">Nâng cấp gói dịch vụ</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button variant="destructive" onClick={handleSignOut} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </CardFooter>
    </div>
  );
};

export default ProfilePage;
