import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Filter, Trash, Edit, Eye, Download, ArrowUpDown, BookOpenText } from 'lucide-react';
import { getUserContent, deleteContent, UserContent } from '@/utils/contentService';

const ContentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contents, setContents] = useState<UserContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    sortBy: 'newest',
  });
  const [selectedContent, setSelectedContent] = useState<UserContent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchContents();
  }, [user, currentPage, filters, navigate, searchQuery]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      // Parse status filter
      const status = filters.status ? filters.status as 'draft' | 'published' | 'archived' : undefined;
      
      // Get user content
      const result = await getUserContent({
        limit: itemsPerPage,
        page: currentPage,
        status,
        category: filters.category || undefined,
        search: searchQuery || undefined,
      });

      if (result.error) {
        throw result.error;
      }

      setContents(result.data || []);
      setTotalItems(result.count);
      setTotalPages(Math.ceil(result.count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải lịch sử nội dung. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedContent) return;

    try {
      const { error } = await deleteContent(selectedContent.id);

      if (error) {
        throw error;
      }

      // Remove the deleted content from the state
      setContents(contents.filter(content => content.id !== selectedContent.id));
      setTotalItems(prev => prev - 1);
      
      toast({
        title: 'Đã xóa nội dung',
        description: 'Nội dung đã được xóa thành công.',
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi xóa nội dung',
        description: 'Không thể xóa nội dung. Vui lòng thử lại sau.',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedContent(null);
    }
  };

  const handleEditContent = (content: UserContent) => {
    navigate(`/?content=${content.id}`);
  };

  const handleViewContent = (content: UserContent) => {
    setSelectedContent(content);
    // In a real implementation, you might open a modal to view the content
  };

  const handleDownloadContent = (content: UserContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Start and end of pagination
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
      pages.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      pages.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1} 
            />
          </PaginationItem>
          
          {pages}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
              disabled={currentPage === totalPages} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lịch sử nội dung</h1>
          <Button onClick={() => navigate('/')}>Tạo nội dung mới</Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm nội dung..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-auto">
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="archived">Đã lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                      <SelectItem value="Social Media">Mạng xã hội</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="title_asc">Tiêu đề (A-Z)</SelectItem>
                      <SelectItem value="title_desc">Tiêu đề (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon" onClick={fetchContents}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : contents.length > 0 ? (
              <div className="space-y-4">
                {contents.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{content.title}</CardTitle>
                          <CardDescription className="text-xs flex flex-wrap gap-2 items-center">
                            <span>{formatDate(content.created_at)}</span>
                            {content.category && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                {content.category}
                              </span>
                            )}
                            {content.status && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getStatusBadgeClass(content.status)}`}>
                                {content.status === 'published' ? 'Đã xuất bản' : content.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                              </span>
                            )}
                            {content.tokens_used && (
                              <span className="text-muted-foreground">{content.tokens_used} tokens</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewContent(content)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditContent(content)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadContent(content)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  setSelectedContent(content);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Nội dung này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteContent}>Xóa</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm line-clamp-3">{content.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpenText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có nội dung nào</h3>
                <p className="text-muted-foreground mb-6">Bạn chưa tạo nội dung nào hoặc không có kết quả phù hợp với bộ lọc.</p>
                <Button onClick={() => navigate('/')}>Tạo nội dung đầu tiên</Button>
              </div>
            )}
          </CardContent>
          
          {!loading && contents.length > 0 && (
            <CardFooter className="flex flex-col items-center pt-6">
              <div className="text-sm text-muted-foreground mb-4">
                Hiển thị {Math.min(itemsPerPage, contents.length)} của {totalItems} nội dung
              </div>
              {renderPagination()}
            </CardFooter>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentHistory; 