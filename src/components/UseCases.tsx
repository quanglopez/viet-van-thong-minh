
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const industries = [
  {
    name: "Nhà hàng & F&B",
    tasks: [
      "Viết mô tả món ăn hấp dẫn",
      "Email marketing khuyến mãi",
      "Nội dung cho menu điện tử",
      "Bài viết blog về ẩm thực"
    ]
  },
  {
    name: "Bất động sản",
    tasks: [
      "Mô tả căn hộ, nhà đất chuyên nghiệp",
      "Email tiếp cận khách hàng tiềm năng",
      "Bài viết phân tích thị trường",
      "Content cho landing page dự án"
    ]
  },
  {
    name: "Giáo dục",
    tasks: [
      "Nội dung khóa học trực tuyến",
      "Email thông báo, nhắc học viên",
      "Bài giảng, bài tập sáng tạo",
      "Tài liệu học tập tương tác"
    ]
  },
  {
    name: "Du lịch",
    tasks: [
      "Mô tả điểm đến hấp dẫn",
      "Content trên web du lịch",
      "Lịch trình tour chi tiết",
      "Câu chuyện trải nghiệm địa phương"
    ]
  },
  {
    name: "Bán lẻ & TMĐT",
    tasks: [
      "Mô tả sản phẩm tối ưu SEO",
      "Email marketing theo mùa",
      "Nội dung quảng cáo đa kênh",
      "Tiêu đề thu hút cho landing page"
    ]
  },
  {
    name: "Thẩm mỹ & Spa",
    tasks: [
      "Mô tả dịch vụ chuyên nghiệp",
      "Email chăm sóc khách hàng",
      "Nội dung tư vấn sức khỏe, làm đẹp",
      "Bài viết blog về xu hướng làm đẹp"
    ]
  }
];

const UseCases = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ứng dụng cho nhiều ngành nghề</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Việt Văn Thông Minh có thể giúp bạn tạo nội dung chuyên nghiệp cho nhiều lĩnh vực và công việc khác nhau
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">{industry.name}</h3>
                <ul className="space-y-2 text-gray-700">
                  {industry.tasks.map((task, tIndex) => (
                    <li key={tIndex} className="flex items-baseline">
                      <span className="mr-2 text-vn-red">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
