import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Folder,
  Tag,
  CheckCircle,
  FileEdit,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { reportService } from '@/services/report.service';
import { toastError, toastSuccess } from '@/utils/toast';
import { NewsArticle } from '@/types/news.types';
import { Category } from '@/types/category.types';

interface ReportData {
  counts: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalAuthors: number;
    totalUsers: number;
    totalCategories: number;
    totalTags: number;
  };
  allNews: NewsArticle[];
  allCategories: Category[];
  allTags: any[];
}

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  
  // Date range state - default to last 30 days
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadReport = async () => {
    setLoading(true);
    try {
      // Fetch all data - now using single Reports API endpoint
      const [counts, allNews, allCategories, allTags] = await Promise.all([
        reportService.getCounts(startDate, endDate),
        reportService.getAllNews(),
        reportService.getAllCategories(),
        reportService.getAllTags(),
      ]);

      setReport({
        counts,
        allNews,
        allCategories,
        allTags,
      });

      toastSuccess('Report generated successfully');
    } catch (error: any) {
      console.error('Error loading report:', error);
      toastError(error.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleGenerateReport = () => {
    // Validate dates
    if (!startDate || !endDate) {
      toastError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (start > end) {
      toastError('Start date must be before end date');
      return;
    }

    if (end > today) {
      toastError('End date cannot be in the future');
      return;
    }

    // Check if date range is too large (e.g., more than 1 year)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      toastError('Date range cannot exceed 365 days');
      return;
    }

    loadReport();
  };

  // Calculate top categories, authors, tags from data
  const getTopCategories = () => {
    if (!report) return [];
    const categoryCounts = new Map<number, { category: Category; count: number }>();
    
    report.allNews.forEach(article => {
      if (article.categoryId) {
        const existing = categoryCounts.get(article.categoryId);
        if (existing) {
          existing.count++;
        } else {
          const category = report.allCategories.find(c => c.categoryId === article.categoryId);
          if (category) {
            categoryCounts.set(article.categoryId, { category, count: 1 });
          }
        }
      }
    });

    return Array.from(categoryCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getTopAuthors = () => {
    if (!report) return [];
    const authorCounts = new Map<number, { id: number; name: string; count: number }>();
    
    report.allNews.forEach(article => {
      if (article.createdById) {
        const existing = authorCounts.get(article.createdById);
        if (existing) {
          existing.count++;
        } else {
          authorCounts.set(article.createdById, { 
            id: article.createdById, 
            name: article.createdByName || 'Unknown', 
            count: 1 
          });
        }
      }
    });

    return Array.from(authorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getTopTags = () => {
    if (!report) return [];
    const tagCounts = new Map<number, { tag: any; count: number }>();
    
    report.allNews.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => {
          const existing = tagCounts.get(tag.tagId);
          if (existing) {
            existing.count++;
          } else {
            tagCounts.set(tag.tagId, { tag, count: 1 });
          }
        });
      }
    });

    return Array.from(tagCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getDailyArticles = () => {
    if (!report) return [];
    
    const dailyCounts = new Map<string, number>();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Initialize all dates in range with 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyCounts.set(dateStr, 0);
    }
    
    // Count articles by date
    report.allNews.forEach(article => {
      if (article.createdDate) {
        const dateStr = article.createdDate.split('T')[0];
        if (dailyCounts.has(dateStr)) {
          dailyCounts.set(dateStr, (dailyCounts.get(dateStr) || 0) + 1);
        }
      }
    });

    const result = Array.from(dailyCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Daily Articles Data:', result);
    console.log('Total news articles:', report.allNews.length);
    
    return result;
  };

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Reports & Analytics
            </h1>
            <p className="text-slate-400">Detailed system activity analysis</p>
          </div>
        </motion.div>

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Date Range:</span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || new Date().toISOString().split('T')[0]}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </motion.div>

        {report && (
          <>
            {/* Statistics Overview Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                icon={<FileText className="w-8 h-8" />}
                title="Total Articles"
                value={report.counts.totalArticles}
                color="from-blue-500 to-cyan-500"
                delay={0.2}
              />
              <StatCard
                icon={<CheckCircle className="w-8 h-8" />}
                title="Published"
                value={report.counts.publishedArticles}
                color="from-green-500 to-emerald-500"
                delay={0.3}
              />
              <StatCard
                icon={<FileEdit className="w-8 h-8" />}
                title="Drafts"
                value={report.counts.draftArticles}
                color="from-orange-500 to-red-500"
                delay={0.4}
              />
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Authors"
                value={report.counts.totalAuthors}
                color="from-purple-500 to-pink-500"
                delay={0.5}
              />
            </motion.div>

            {/* Secondary Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <StatCard
                icon={<Users className="w-7 h-7" />}
                title="Total Users"
                value={report.counts.totalUsers}
                color="from-indigo-500 to-blue-500"
                delay={0.6}
                small
              />
              <StatCard
                icon={<Folder className="w-7 h-7" />}
                title="Total Categories"
                value={report.counts.totalCategories}
                color="from-violet-500 to-purple-500"
                delay={0.7}
                small
              />
              <StatCard
                icon={<Tag className="w-7 h-7" />}
                title="Total Tags"
                value={report.counts.totalTags}
                color="from-pink-500 to-rose-500"
                delay={0.8}
                small
              />
            </motion.div>

            {/* Daily Articles Line Chart - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Daily Articles Trend
              </h3>
              <DailyArticleLineChart data={getDailyArticles()} />
            </motion.div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Top Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Top Categories
                </h3>
                <div className="space-y-3">
                  {getTopCategories().map((item, index) => (
                    <div
                      key={item.category.categoryId}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <span className="text-white font-medium">{item.category.categoryName}</span>
                      </div>
                      <span className="text-blue-400 font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Authors */}
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-400" />
                  Top Authors
                </h3>
                <div className="space-y-3">
                  {getTopAuthors().map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">Author</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold text-lg">{item.count}</p>
                        <p className="text-xs text-green-400">{item.count} articles</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-pink-400" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {getTopTags().map((item) => (
                    <div
                      key={item.tag.tagId}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-full text-white flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <span className="font-medium">{item.tag.tagName}</span>
                      <span className="px-2 py-0.5 bg-pink-500 rounded-full text-xs font-bold">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  delay: number;
  small?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, delay, small }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-${small ? '12' : '14'} h-${small ? '12' : '14'} bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white`}>
        {icon}
      </div>
    </div>
    <p className="text-slate-300 text-sm mb-1">{title}</p>
    <p className={`text-white font-bold ${small ? 'text-2xl' : 'text-3xl'}`}>{value.toLocaleString()}</p>
  </motion.div>
);

// Daily Article Line Chart Component
interface DailyArticleLineChartProps {
  data: Array<{ date: string; count: number }>;
}

const DailyArticleLineChart: React.FC<DailyArticleLineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-400 py-8">No data available</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 400;
  const chartWidth = 1000; // Fixed width for calculations
  const padding = { top: 20, right: 40, bottom: 60, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * innerWidth + padding.left;
    const y = chartHeight - padding.bottom - (item.count / maxCount) * innerHeight;
    return { x, y, ...item };
  });

  // Create smooth curved path using cubic Bezier curves
  const createSmoothPath = (pts: Array<{ x: number; y: number; date: string; count: number }>) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      
      // Calculate control points for smooth curve
      const controlPointX = (current.x + next.x) / 2;
      
      // Use quadratic Bezier curve for smooth transitions
      path += ` Q ${controlPointX} ${current.y}, ${controlPointX} ${(current.y + next.y) / 2}`;
      path += ` Q ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  const linePath = createSmoothPath(points);
  
  // Create path for the area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="w-full" style={{ height: chartHeight + 'px' }}>
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = chartHeight - padding.bottom - (innerHeight * percent) / 100;
          return (
            <g key={percent}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
              <text 
                x={padding.left - 10} 
                y={y + 4} 
                fill="rgba(255, 255, 255, 0.5)" 
                fontSize="12" 
                textAnchor="end"
              >
                {Math.round((maxCount * percent) / 100)}
              </text>
            </g>
          );
        })}

        {/* Area under the line */}
        <path
          d={areaPath}
          fill="url(#lineGradient)"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
              className="hover:r-7 transition-all cursor-pointer"
            />
            {/* Show count on hover */}
            <title>{`${new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${point.count} articles`}</title>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => {
          // Show every nth label to avoid crowding
          const showLabel = data.length <= 10 || index % Math.ceil(data.length / 10) === 0 || index === data.length - 1;
          if (!showLabel) return null;
          
          return (
            <text
              key={`label-${index}`}
              x={point.x}
              y={chartHeight - padding.bottom + 20}
              fill="rgba(255, 255, 255, 0.7)"
              fontSize="11"
              textAnchor="middle"
              transform={`rotate(-45 ${point.x} ${chartHeight - padding.bottom + 20})`}
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          );
        })}

        {/* Y-axis label */}
        <text
          x={padding.left / 2}
          y={chartHeight / 2}
          fill="rgba(255, 255, 255, 0.7)"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90 ${padding.left / 2} ${chartHeight / 2})`}
        >
          Number of Articles
        </text>
      </svg>
    </div>
  );
};

export default ReportsPage;
