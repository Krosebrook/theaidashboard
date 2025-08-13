import React from 'react';
import { TrendingUp, Settings, Download, RefreshCw } from 'lucide-react';
import { projectStats } from '../data/mockData';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsHub: React.FC = () => {
  const {
    analyticsData,
    userMetrics,
    chartData,
    isLoading,
    fetchAnalytics,
    getTopPages,
    getTopReferrers,
    getDeviceStats,
    getBrowserStats,
    exportData
  } = useAnalytics();

  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d' | '1y'>('30d');

  React.useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange, fetchAnalytics]);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Intelligence Hub</h2>
          <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            onClick={() => fetchAnalytics(timeRange)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => exportData('json')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.entries(analyticsData).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {getTopPages().map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-mono text-sm">{page.path}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{page.uniqueViews.toLocaleString()} unique</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {getTopReferrers().map((referrer, index) => (
              <div key={referrer.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{referrer.source}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{referrer.visits.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{referrer.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Device Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-4">
            {Object.entries(getDeviceStats()).map(([device, percentage]) => (
              <div key={device} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize text-sm font-medium">{device}</span>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <div className="space-y-4">
            {Object.entries(getBrowserStats()).map(([browser, percentage]) => (
              <div key={browser} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize text-sm font-medium">{browser}</span>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;