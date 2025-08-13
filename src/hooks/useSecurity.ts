import { useState, useCallback, useEffect } from 'react';
import type { SecurityCheck } from '../types';

interface SecurityAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high';
  blockedAttacks: number;
  vulnerabilitiesFound: number;
  complianceScore: number;
  lastScan: string;
}

export const useSecurity = () => {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([
    { name: 'OWASP Top 10', status: 'passed', score: 100, lastCheck: '2 min ago' },
    { name: 'Dependency Vulnerabilities', status: 'passed', score: 98, lastCheck: '5 min ago' },
    { name: 'Code Quality Analysis', status: 'passed', score: 95, lastCheck: '1 min ago' },
    { name: 'Access Control Audit', status: 'passed', score: 100, lastCheck: '10 min ago' },
    { name: 'Data Encryption Check', status: 'passed', score: 100, lastCheck: '3 min ago' },
    { name: 'API Security Scan', status: 'warning', score: 92, lastCheck: '1 min ago' },
    { name: 'Compliance Standards', status: 'passed', score: 97, lastCheck: '15 min ago' },
    { name: 'Penetration Test', status: 'passed', score: 96, lastCheck: '1 hour ago' }
  ]);

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Unusual API Access Pattern',
      description: 'Detected unusual API access pattern from IP 192.168.1.100 - automatically blocked',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Security Scan Completed',
      description: 'Weekly security scan completed successfully with no critical issues found',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved: true
    }
  ]);

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    blockedAttacks: 247,
    vulnerabilitiesFound: 0,
    complianceScore: 98.5,
    lastScan: new Date().toISOString()
  });

  const [isScanning, setIsScanning] = useState(false);

  const runSecurityScan = useCallback(async (scanType: 'quick' | 'full' = 'quick') => {
    setIsScanning(true);
    
    try {
      // Simulate security scan
      const scanDuration = scanType === 'full' ? 5000 : 2000;
      await new Promise(resolve => setTimeout(resolve, scanDuration));
      
      // Update security checks with new results
      setSecurityChecks(prev => prev.map(check => ({
        ...check,
        score: Math.max(90, Math.floor(Math.random() * 10) + 95),
        lastCheck: 'Just now',
        status: Math.random() > 0.1 ? 'passed' : 'warning'
      })));

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        lastScan: new Date().toISOString(),
        vulnerabilitiesFound: Math.floor(Math.random() * 3),
        complianceScore: Math.floor(Math.random() * 5) + 95
      }));

      // Add scan completion alert
      const newAlert: SecurityAlert = {
        id: Date.now().toString(),
        type: 'info',
        title: `${scanType === 'full' ? 'Full' : 'Quick'} Security Scan Completed`,
        description: `Security scan completed successfully. ${scanType === 'full' ? 'Comprehensive' : 'Basic'} analysis performed.`,
        timestamp: new Date().toISOString(),
        resolved: true
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      
    } finally {
      setIsScanning(false);
    }
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  }, []);

  const blockIP = useCallback(async (ipAddress: string) => {
    // Simulate IP blocking
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAlert: SecurityAlert = {
      id: Date.now().toString(),
      type: 'info',
      title: 'IP Address Blocked',
      description: `IP address ${ipAddress} has been blocked from accessing the application`,
      timestamp: new Date().toISOString(),
      resolved: true
    };

    setAlerts(prev => [newAlert, ...prev]);
    setMetrics(prev => ({ ...prev, blockedAttacks: prev.blockedAttacks + 1 }));
  }, []);

  const generateSecurityReport = useCallback(() => {
    const report = {
      summary: {
        overallScore: Math.floor(securityChecks.reduce((sum, check) => sum + check.score, 0) / securityChecks.length),
        passedChecks: securityChecks.filter(check => check.status === 'passed').length,
        totalChecks: securityChecks.length,
        criticalIssues: securityChecks.filter(check => check.status === 'failed').length,
        warnings: securityChecks.filter(check => check.status === 'warning').length
      },
      recommendations: [
        'Enable two-factor authentication for all admin accounts',
        'Implement rate limiting on API endpoints',
        'Regular security training for development team',
        'Automated dependency vulnerability scanning',
        'Regular penetration testing schedule'
      ],
      compliance: {
        gdpr: 98,
        hipaa: 95,
        soc2: 97,
        iso27001: 94
      }
    };

    return report;
  }, [securityChecks]);

  // Simulate real-time security monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate security events
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const eventTypes = [
          { type: 'info', title: 'Login Attempt', description: 'Successful login from new location' },
          { type: 'warning', title: 'Failed Login', description: 'Multiple failed login attempts detected' },
          { type: 'info', title: 'API Usage', description: 'High API usage detected - within normal limits' }
        ];

        const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const newAlert: SecurityAlert = {
          id: Date.now().toString(),
          type: event.type as 'info' | 'warning',
          title: event.title,
          description: event.description,
          timestamp: new Date().toISOString(),
          resolved: false
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    securityChecks,
    alerts,
    metrics,
    isScanning,
    runSecurityScan,
    resolveAlert,
    blockIP,
    generateSecurityReport
  };
};