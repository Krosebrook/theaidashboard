import React, { useState } from 'react';
import NavigationSidebar from './components/NavigationSidebar';
import ChatInterface from './components/ChatInterface';
import CodeEditor from './components/CodeEditor';
import DatabaseDesigner from './components/DatabaseDesigner';
import SecurityCenter from './components/SecurityCenter';
import DeploymentCenter from './components/DeploymentCenter';
import AnalyticsHub from './components/AnalyticsHub';
import QualityLabs from './components/QualityLabs';
import ProjectGalaxy from './components/ProjectGalaxy';
import CommandCenter from './components/CommandCenter';
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
        return <QualityLabs />;
      case 'projects':
        return <ProjectGalaxy />;
      case 'settings':
        return <CommandCenter />;
      default:
        return <ChatInterface />;
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