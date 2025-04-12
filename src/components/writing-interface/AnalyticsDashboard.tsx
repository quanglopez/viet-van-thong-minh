
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  contentGenerated: number;
  averageLength: number;
  topCategories: { name: string; count: number }[];
  dailyStats: Array<{
    date: string;
    generations: number;
    engagementScore: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Nội dung đã tạo</h4>
          <p className="text-3xl font-bold mt-2">{data.contentGenerated}</p>
        </Card>
        
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Độ dài trung bình</h4>
          <p className="text-3xl font-bold mt-2">{data.averageLength} từ</p>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Danh mục phổ biến</h4>
          <div className="mt-2">
            {data.topCategories.slice(0, 3).map((category, index) => (
              <div key={index} className="flex justify-between items-center mt-2">
                <span>{category.name}</span>
                <span className="font-medium">{category.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-medium mb-4">Thống kê theo ngày</h4>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="generations" 
                stroke="#8884d8" 
                name="Số lượt tạo"
              />
              <Line 
                type="monotone" 
                dataKey="engagementScore" 
                stroke="#82ca9d" 
                name="Điểm tương tác"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
