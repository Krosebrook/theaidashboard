import React from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Activity, 
  Bell, Zap 
} from 'lucide-react';
import { projectMetrics, projectStats } from '../data/mockData';
import { useSecurity } from '../hooks/useSecurity';

const SecurityCenter: React.FC = () => {
  const {
    securityChecks,
    alerts,
    metrics,
    isScanning,
    runSecurityScan,
    resolveAlert,
    blockIP,
    generateSecurityReport
  } = useSecurity();

  const securitySafeguards = [
    { name: 'Code Execution Sandboxing', status: 'active', description: 'Docker isolation with resource limits' },
    { name: 'AI Agent Constraints', status: 'active', description: 'Behavioral limits and validation' },
    { name: 'Input Sanitization', status: 'active', description: 'XSS and injection protection' },
    { name: 'Access Control Matrix', status: 'active', description: 'Role-based permissions' },
    { name: 'Data Encryption', status: 'active', description: 'AES-256 at rest and in transit' },
    { name: 'Compliance Monitoring', status: 'active', description: 'GDPR, HIPAA, SOC2 compliance' }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Security Command Center</h2>
          <p className="text-gray-600 mt-2">Enterprise-grade security monitoring and compliance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{metrics.complianceScore}%</div>
            <div className="text-sm text-gray-500">Security Score</div>
          </div>
          <button 
            onClick={() => runSecurityScan('full')}
            disabled={isScanning}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg"
          >
            {isScanning ? 'Scanning...' : 'Run Full Security Scan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {securityChecks.map(check => (
          <div key={check.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{check.name}</h3>
              {check.status === 'passed' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <div className="text-3xl font-bold mb-2 text-gray-900">{check.score}%</div>
            <div className={`text-sm mb-2 ${
              check.status === 'passed' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {check.status === 'passed' ? 'All checks passed' : 'Review required'}
            </div>
            <div className="text-xs text-gray-500">Last check: {check.lastCheck}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            Active Security Safeguards
          </h3>
          <div className="space-y-4">
            {securitySafeguards.map(safeguard => (
              <div key={safeguard.name} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-green-900">{safeguard.name}</div>
                  <div className="text-sm text-green-700">{safeguard.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-600" />
            Real-time Threat Monitoring
          </h3>
          <div className="space-y-6">
            {projectMetrics.map(metric => (
              <div key={metric.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      metric.trend === 'up' ? 'bg-green-500' :
                      metric.trend === 'down' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    metric.good ? 'bg-green-500' : 'bg-red-500'
                  }`} style={{width: metric.name === 'Error Rate' ? '2%' : '75%'}}></div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
              {alerts.slice(0, 3).map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className={`w-4 h-4 ${
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <span className={`font-medium ${
                        alert.type === 'critical' ? 'text-red-900' :
                        alert.type === 'warning' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {alert.title}
                      </span>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                  <div className={`text-sm ${
                    alert.type === 'critical' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.description}
                  </div>
                  <div className={`text-xs mt-1 ${
                    alert.type === 'critical' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;