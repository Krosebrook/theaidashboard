import React from 'react';
import { Rocket } from 'lucide-react';
import { platforms, deploymentTargets } from '../data/mockData';
import { useDeployment } from '../hooks/useDeployment';

const DeploymentCenter: React.FC = () => {
  const {
    deploymentTargets: targets,
    deploymentLogs,
    isDeploying,
    deploymentProgress,
    deployToTarget,
    rollbackDeployment,
    scaleDeployment,
    getDeploymentMetrics,
    estimateCost
  } = useDeployment();

  const [selectedTarget, setSelectedTarget] = React.useState<string>('');
  const [showLogs, setShowLogs] = React.useState(false);
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Global Deployment Center</h2>
          <p className="text-gray-600 mt-2">Multi-platform deployment with intelligent optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
          <button 
            onClick={() => {
              // Deploy to all platforms
              platforms.forEach(platform => {
                deployToTarget(platform.name, {
                  platform: platform.id,
                  environment: 'production',
                  region: 'us-east-1',
                  autoScale: true
                });
              });
            }}
            disabled={isDeploying}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            {isDeploying ? 'Deploying...' : 'Deploy to All Platforms'}
          </button>
        </div>
      </div>

      {/* Deployment Logs */}
      {showLogs && (
        <div className="mb-8 bg-black text-green-400 rounded-xl p-4 font-mono text-sm max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Deployment Logs</h3>
            {isDeploying && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Deploying... {Math.round(deploymentProgress)}%</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {deploymentLogs.slice(0, 20).map(log => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`text-xs ${
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'warning' ? 'text-yellow-400' :
                  log.level === 'success' ? 'text-green-400' :
                  'text-gray-300'
                }`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-xs">{log.message}</span>
              </div>
            ))}
            {deploymentLogs.length === 0 && (
              <div className="text-gray-500 text-center">No deployment logs yet</div>
            )}
          </div>
        </div>
      )}
          <Rocket className="w-5 h-5" />
          Deploy to All Platforms
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {platforms.map(platform => (
          <div key={platform.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{platform.name}</h3>
                  <div className="text-sm text-gray-600">{platform.tech}</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {platform.status}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Deployment Targets</div>
                <div className="flex flex-wrap gap-1">
                  {platform.deployment.map(target => (
                    <span key={target} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {target}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Platform Features</div>
                <div className="flex flex-wrap gap-1">
                  {platform.features.map(feature => (
                    <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                deployToTarget(platform.name, {
                  platform: platform.id,
                  environment: 'production',
                  region: 'us-east-1',
                  autoScale: true
                });
              }}
              disabled={isDeploying}
              className="w-full mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all"
            >
              Configure Deployment
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-xl text-gray-900 mb-6">Active Deployments</h3>
        <div className="space-y-4">
          {targets.map(target => (
            <div key={target.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${
                  target.status === 'deployed' ? 'bg-green-500' : 
                  target.status === 'review' ? 'bg-yellow-500' :
                  target.status === 'configuring' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-semibold text-gray-900">{target.name}</div>
                  <div className="text-sm text-gray-600">{target.url}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{target.users}</div>
                  <div className="text-gray-500">Users</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{target.uptime}</div>
                  <div className="text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{target.cost}</div>
                  <div className="text-gray-500">Cost</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    target.status === 'deployed' ? 'bg-green-100 text-green-700' :
                    target.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                    target.status === 'configuring' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {target.status}
                  </div>
                  {target.status === 'deployed' && (
                    <button
                      onClick={() => rollbackDeployment(target.name)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    >
                      Rollback
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeploymentCenter;