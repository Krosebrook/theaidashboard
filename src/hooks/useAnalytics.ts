import { useState, useCallback, useEffect } from 'react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenue: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  userGrowth: number;
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 125847,
    uniqueVisitors: 45623,
    bounceRate: 32.5,
    avgSessionDuration: 245,
    conversionRate: 3.8,
    revenue: 12847
  });

  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 45623,
    activeUsers: 12847,
    newUsers: 2847,
    returningUsers: 9876,
    userGrowth: 15.3
  });

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const generateTrafficData = useCallback((days: number = 30) => {
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      data.push(Math.floor(Math.random() * 5000) + 1000);
    }

    return {
      labels,
      datasets: [{
        label: 'Page Views',
        data,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    };
  }, []);

  const generateUserData = useCallback((days: number = 30) => {
    const labels = [];
    const newUsers = [];
    const returningUsers = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      newUsers.push(Math.floor(Math.random() * 200) + 50);
      returningUsers.push(Math.floor(Math.random() * 800) + 200);
    }

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsers,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
          label: 'Returning Users',
          data: returningUsers,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)'
        }
      ]
    };
  }, []);

  const generateRevenueData = useCallback((months: number = 12) => {
    const labels = [];
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      data.push(Math.floor(Math.random() * 10000) + 5000);
    }

    return {
      labels,
      datasets: [{
        label: 'Revenue ($)',
        data,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }]
    };
  }, []);

  const fetchAnalytics = useCallback(async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      
      // Update analytics data with simulated values
      setAnalyticsData({
        pageViews: Math.floor(Math.random() * 100000) + 50000,
        uniqueVisitors: Math.floor(Math.random() * 50000) + 20000,
        bounceRate: Math.floor(Math.random() * 20) + 25,
        avgSessionDuration: Math.floor(Math.random() * 200) + 150,
        conversionRate: Math.floor(Math.random() * 5) + 2,
        revenue: Math.floor(Math.random() * 20000) + 10000
      });

      setUserMetrics({
        totalUsers: Math.floor(Math.random() * 50000) + 30000,
        activeUsers: Math.floor(Math.random() * 15000) + 8000,
        newUsers: Math.floor(Math.random() * 3000) + 1500,
        returningUsers: Math.floor(Math.random() * 12000) + 6000,
        userGrowth: Math.floor(Math.random() * 30) + 5
      });

      setChartData(generateTrafficData(days));
      
    } finally {
      setIsLoading(false);
    }
  }, [generateTrafficData]);

  const getTopPages = useCallback(() => {
    return [
      { path: '/', views: 15847, uniqueViews: 12456 },
      { path: '/dashboard', views: 8934, uniqueViews: 7234 },
      { path: '/profile', views: 6745, uniqueViews: 5432 },
      { path: '/settings', views: 4567, uniqueViews: 3876 },
      { path: '/help', views: 3456, uniqueViews: 2987 }
    ];
  }, []);

  const getTopReferrers = useCallback(() => {
    return [
      { source: 'google.com', visits: 12847, percentage: 45.2 },
      { source: 'direct', visits: 8934, percentage: 31.4 },
      { source: 'twitter.com', visits: 3456, percentage: 12.1 },
      { source: 'facebook.com', visits: 2134, percentage: 7.5 },
      { source: 'linkedin.com', visits: 1087, percentage: 3.8 }
    ];
  }, []);

  const getDeviceStats = useCallback(() => {
    return {
      desktop: 65.4,
      mobile: 28.7,
      tablet: 5.9
    };
  }, []);

  const getBrowserStats = useCallback(() => {
    return {
      chrome: 68.2,
      safari: 18.4,
      firefox: 8.7,
      edge: 3.9,
      other: 0.8
    };
  }, []);

  const exportData = useCallback((format: 'csv' | 'json' | 'pdf') => {
    // Simulate data export
    const data = {
      analytics: analyticsData,
      users: userMetrics,
      topPages: getTopPages(),
      referrers: getTopReferrers(),
      devices: getDeviceStats(),
      browsers: getBrowserStats(),
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    return data;
  }, [analyticsData, userMetrics, getTopPages, getTopReferrers, getDeviceStats, getBrowserStats]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 10),
        uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 3)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    analyticsData,
    userMetrics,
    chartData,
    isLoading,
    fetchAnalytics,
    generateTrafficData,
    generateUserData,
    generateRevenueData,
    getTopPages,
    getTopReferrers,
    getDeviceStats,
    getBrowserStats,
    exportData
  };
};