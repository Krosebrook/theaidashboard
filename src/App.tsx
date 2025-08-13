import React, { useState } from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import ChatInterface from './components/ChatInterface';
import CodeEditor from './components/CodeEditor';
import DatabaseDesigner from './components/DatabaseDesigner';
import SecurityCenter from './components/SecurityCenter';
import DeploymentCenter from './components/DeploymentCenter';
import AnalyticsHub from './components/AnalyticsHub';
import ComingSoon from './components/ComingSoon';
import { projectStats } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'editor':
        return <CodeEditor />;
      case 'database':
        return <DatabaseDesigner />;
      case 'security':
        return <SecurityCenter />;
      case 'deploy':
        return <DeploymentCenter />;
      case 'analytics':
        return <AnalyticsHub />;
      case 'testing':
        return <ComingSoon title="Quality Labs" description="Comprehensive testing suite with AI-powered test generation and validation." />;
      case 'projects':
        return <ComingSoon title="Project Galaxy" description="Advanced project management with AI-assisted planning and resource optimization." />;
      case 'settings':
        return <ComingSoon title="Command Center" description="System configuration and advanced settings for enterprise deployment." />;
      default:
        return <ComingSoon title={activeTab} />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <NavigationSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectStats={projectStats}
      />
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;