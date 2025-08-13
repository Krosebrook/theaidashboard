import React from 'react';
import { 
  Plus, Search, Filter, Save, Play, Eye, Share2, 
  GitBranch, Bot, X, RefreshCw, ExternalLink, 
  Maximize2, Terminal, CheckCircle
} from 'lucide-react';
import { useCodeEditor } from '../hooks/useCodeEditor';

const CodeEditor: React.FC = () => {
  const {
    fileTree,
    openTabs,
    activeTab,
    suggestions,
    openFile,
    closeTab,
    updateTabContent,
    saveFile,
    formatCode,
    generateSuggestions,
    applySuggestion,
    runCode,
    setActiveTab
  } = useCodeEditor();

  const renderFileTree = (nodes: any[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
            activeTab === node.id ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => node.type === 'file' && openFile(node)}
        >
          {node.type === 'folder' ? (
            <div className="w-4 h-4 text-blue-500">📁</div>
          ) : (
            <div className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold text-white ${
              getLanguageColor(node.language)
            }`}>
              {getLanguageLabel(node.language)}
            </div>
          )}
          <span className={`flex-1 ${activeTab === node.id ? 'font-medium text-purple-700' : 'text-gray-700'}`}>
            {node.name}
          </span>
          {node.modified && (
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          )}
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  const activeTabData = openTabs.find(tab => tab.id === activeTab);

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'typescript': return 'bg-blue-500';
      case 'javascript': return 'bg-yellow-500';
      case 'json': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'typescript': return 'TS';
      case 'javascript': return 'JS';
      case 'json': return 'JSON';
      default: return 'MD';
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Enhanced File Explorer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Project Explorer</h3>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-green-600" />
              <span>main</span>
              <span className="text-green-600">• 23 commits ahead</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <div className="space-y-1 text-sm">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* AI Code Assistant */}
        <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-600" />
            AI Code Assistant
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => activeTab && formatCode(activeTab)}
              className="w-full text-left p-2 bg-white hover:bg-purple-50 border border-purple-200 rounded text-xs text-purple-700"
            >
              🔧 Optimize this component
            </button>
            <button 
              onClick={() => activeTabData && generateSuggestions(activeTabData.content)}
              className="w-full text-left p-2 bg-white hover:bg-purple-50 border border-purple-200 rounded text-xs text-purple-700"
            >
              🧪 Generate unit tests
            </button>
            <button className="w-full text-left p-2 bg-white hover:bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
              📝 Add documentation
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Tabs */}
        <div className="border-b border-gray-200 bg-white flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1">
            {openTabs.map(tab => (
              <div 
                key={tab.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.modified && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                {tab.name}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Auto-saved</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
              <Save 
                className="w-4 h-4" 
                onClick={() => activeTab && saveFile(activeTab)}
              />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
              onClick={runCode}
            >
              <Play className="w-4 h-4 text-green-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto relative">
          <div className="flex">
            {/* Line Numbers */}
            <div className="bg-gray-800 text-gray-500 p-4 select-none text-right" style={{minWidth: '60px'}}>
              {Array.from({length: 50}, (_, i) => (
                <div key={i + 1} className="leading-6">{i + 1}</div>
              ))}
            </div>
            
            {/* Code Content */}
            <div className="flex-1 p-4">
              {activeTabData ? (
                <textarea
                  value={activeTabData.content}
                  onChange={(e) => updateTabContent(activeTabData.id, e.target.value)}
                  className="w-full h-full bg-transparent text-gray-100 font-mono text-sm resize-none border-none outline-none leading-6"
                  spellCheck={false}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <div>Select a file to start editing</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Code Suggestions Overlay */}
          {suggestions.length > 0 && (
            <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg max-w-sm max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">AI Suggestions ({suggestions.length})</span>
              </div>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map(suggestion => (
                  <div key={suggestion.id} className="border-b border-gray-600 pb-2 last:border-b-0">
                    <div className="text-xs text-gray-300 mb-1">
                      Line {suggestion.line}: {suggestion.message}
                    </div>
                    <div className="flex gap-2">
                      {suggestion.fix && (
                        <button 
                          onClick={() => applySuggestion(suggestion.id)}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                        >
                          Apply
                        </button>
                      )}
                      <button className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs">
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Terminal */}
        <div className="h-40 bg-black text-green-400 border-t border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-medium">Integrated Terminal</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-700 rounded text-gray-400">
                <Plus className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded text-gray-400">
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-3 font-mono text-xs overflow-auto">
            <div className="space-y-1">
              <div>$ npm run dev</div>
              <div className="text-green-300">✓ Local development server started on http://localhost:3000</div>
              <div>$ npm run build</div>
              <div className="text-green-300">✓ Build completed successfully in 12.3s</div>
              <div>$ npm run test</div>
              <div className="text-green-300">✓ All 47 tests passed</div>
              <div className="text-blue-300">ℹ Code coverage: 94.2%</div>
              <div className="flex items-center">
                <span>$ </span>
                <span className="bg-green-400 w-2 h-4 ml-1 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Live Preview Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Live Preview</h4>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live</span>
            </div>
            <div className="text-gray-500">•</div>
            <div className="text-gray-600">localhost:3000</div>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 flex flex-col">
          {/* Device Mockup Controls */}
          <div className="p-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                Desktop
              </button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                Tablet
              </button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                Mobile
              </button>
            </div>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg shadow-lg h-full border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-600">
                    localhost:3000
                  </div>
                </div>
              </div>
              
              <div className="p-6 h-full bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">AI Chat Interface</h2>
                  <p className="text-gray-600 mb-6">Real-time preview of your application</p>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Master Orchestrator</div>
                        <div className="text-xs text-gray-500">Just now</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      Your application is being generated with enterprise-grade security and multi-platform deployment.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="text-sm font-medium text-gray-900 mb-2">Performance</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded text-center">
              <div className="font-bold text-green-700">98</div>
              <div className="text-green-600">Lighthouse</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="font-bold text-blue-700">127ms</div>
              <div className="text-blue-600">Load Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;