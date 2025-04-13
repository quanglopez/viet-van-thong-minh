
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AnalyticsData, TopicAnalysis } from './types';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const { contentGenerated, averageLength, topCategories, dailyStats, topicAnalysis = [] } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tổng quan</CardTitle>
          <CardDescription>
            Tổng quan về hoạt động tạo nội dung của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/40">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Nội dung đã tạo</p>
                <p className="text-3xl font-bold">{contentGenerated}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/40">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Độ dài trung bình</p>
                <p className="text-3xl font-bold">{averageLength}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục phổ biến</CardTitle>
          <CardDescription>
            Các danh mục nội dung được sử dụng nhiều nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động theo thời gian</CardTitle>
          <CardDescription>
            Số lượng nội dung được tạo trong 7 ngày gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="generations" fill="#8884d8" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân tích chủ đề</CardTitle>
          <CardDescription>
            Các chủ đề và tương tác của người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicAnalysis.map((topic) => (
              <div key={topic.topic} className="space-y-1">
                <div className="flex justify-between">
                  <p className="font-medium">{topic.topic}</p>
                  <p className="text-sm text-muted-foreground">{topic.count} nội dung</p>
                </div>
                <div className="relative h-2 w-full bg-muted rounded overflow-hidden">
                  <div
                    className="absolute h-full bg-primary"
                    style={{
                      width: `${(topic.engagement / 100) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Tương tác: {topic.engagement}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
