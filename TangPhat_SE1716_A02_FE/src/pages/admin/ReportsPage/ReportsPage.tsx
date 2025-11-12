import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar } from 'lucide-react';
import { NewsStatistic } from '@/types/admin.types';
import { reportService } from '@/services/report.service';
import { toast } from 'react-hot-toast';

const ReportsPage = () => {
  const [statistics, setStatistics] = useState<NewsStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    try {
      setLoading(true);
      const data = await reportService.getStatistics({ startDate, endDate });
      setStatistics(data);
      toast.success(`Report generated with ${data.length} articles`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10" />
            News Statistics Reports
          </h1>
          <p className="text-blue-200">Generate reports for news articles by date range</p>
        </motion.div>

        {/* Date Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
        >
          <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
        </motion.div>

        {/* Statistics Table */}
        {statistics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                Found {statistics.length} articles from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Article ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Created Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Created By</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <motion.tr
                      key={stat.newsArticleId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono text-sm">{stat.newsArticleId}</td>
                      <td className="px-6 py-4 text-white font-medium max-w-md truncate" title={stat.newsTitle}>
                        {stat.newsTitle}
                      </td>
                      <td className="px-6 py-4 text-blue-200">{stat.categoryName}</td>
                      <td className="px-6 py-4 text-blue-200">
                        {new Date(stat.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-blue-200">{stat.createdByName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          stat.newsStatus 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {stat.newsStatus ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && statistics.length === 0 && startDate && endDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center"
          >
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-300 opacity-50" />
            <p className="text-xl text-blue-200">No articles found in the selected date range</p>
            <p className="text-sm text-blue-300 mt-2">Try selecting a different date range</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
