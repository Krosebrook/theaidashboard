import React from 'react';
import { Bot, Zap } from 'lucide-react';
import type { Agent } from '../types';

interface AgentPanelProps {
  agents: Agent[];
  selectedAgent: string;
  setSelectedAgent: (agentId: string) => void;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ 
  agents, 
  selectedAgent, 
  setSelectedAgent 
}) => {
  const quickActions = [
    { icon: '🌐', text: 'Generate Web App', gradient: 'from-blue-500 to-cyan-500' },
    { icon: '📱', text: 'Build Mobile App', gradient: 'from-green-500 to-emerald-500' },
    { icon: '🖥️', text: 'Create Desktop App', gradient: 'from-purple-500 to-pink-500' },
    { icon: '⚡', text: 'Deploy Edge Functions', gradient: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="w-96 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-600" />
          AI Agent Fleet
        </h3>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          All Systems Active
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
              selectedAgent === agent.id 
                ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md' 
                : 'border-gray-200 hover:border-purple-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${agent.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <agent.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{agent.name}</h4>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{agent.description}</p>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 2).map(cap => (
                    <span key={cap} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {cap}
                    </span>
                  ))}
                  {agent.capabilities.length > 2 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{agent.capabilities.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          Quick Actions
        </h4>
        <div className="space-y-2">
          {quickActions.map(action => (
            <button 
              key={action.text}
              className={`w-full p-3 bg-gradient-to-r ${action.gradient} hover:shadow-lg rounded-lg text-white text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]`}
            >
              <span className="mr-2">{action.icon}</span>
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;