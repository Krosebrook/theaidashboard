import React, { useState } from 'react';
import {
  TestTube, Play, CheckCircle, XCircle, Clock, TrendingUp,
  Sparkles, FileCode, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import { useQualityLabs } from '../hooks/useQualityLabs';

const QualityLabs: React.FC = () => {
  const {
    testSuites,
    activeTestRun,
    aiGenerations,
    selectedSuite,
    setSelectedSuite,
    runAllTests,
    runTestSuite,
    generateAITests,
    getTestResults,
    getTestStats
  } = useQualityLabs();

  const [showAIPanel, setShowAIPanel] = useState(false);
  const [componentName, setComponentName] = useState('');
  const stats = getTestStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'unit': return 'from-blue-500 to-cyan-500';
      case 'integration': return 'from-purple-500 to-pink-500';
      case 'e2e': return 'from-green-500 to-emerald-500';
      case 'performance': return 'from-orange-500 to-red-500';
      case 'security': return 'from-red-500 to-rose-500';
      case 'accessibility': return 'from-teal-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const selectedSuiteData = testSuites.find(s => s.id === selectedSuite);
  const testResults = selectedSuiteData ? getTestResults(selectedSuite) : [];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quality Labs</h1>
              <p className="text-sm text-gray-600">AI-powered testing and automation suite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Test Generator
            </button>
            <button
              onClick={runAllTests}
              disabled={activeTestRun?.status === 'running'}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4" />
              Run All Tests
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              </div>
              <FileCode className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPassed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalFailed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.passRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coverage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCoverage}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Test Generation Panel */}
      {showAIPanel && (
        <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="Enter component name (e.g., UserProfile, Dashboard, LoginForm)"
              className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                if (componentName.trim()) {
                  generateAITests(componentName);
                  setComponentName('');
                }
              }}
              disabled={!componentName.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all"
            >
              Generate Tests
            </button>
          </div>

          {/* AI Generations Progress */}
          {aiGenerations.length > 0 && (
            <div className="mt-4 space-y-2">
              {aiGenerations.slice(-3).map(gen => (
                <div key={gen.id} className="bg-white border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{gen.component}</span>
                    <span className="text-xs text-gray-600">
                      {gen.status === 'completed' ? `${gen.testsGenerated} tests generated` : 'Generating...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${gen.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-12 text-right">{Math.round(gen.progress)}%</span>
                  </div>
                  {gen.status === 'completed' && (
                    <div className="mt-2 text-xs text-green-600">
                      Coverage increased by +{gen.coverage}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Test Run Progress */}
      {activeTestRun && activeTestRun.status === 'running' && (
        <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="font-medium text-gray-900">Running tests...</span>
            </div>
            <span className="text-sm text-gray-600">
              {activeTestRun.passedTests} / {activeTestRun.totalTests} tests completed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${activeTestRun.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-16 text-right">{Math.round(activeTestRun.progress)}%</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Test Suites List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Test Suites</h3>
          </div>
          <div className="p-2 space-y-2">
            {testSuites.map(suite => (
              <div
                key={suite.id}
                onClick={() => setSelectedSuite(suite.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedSuite === suite.id
                    ? 'bg-gradient-to-r ' + getTypeColor(suite.type) + ' text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${selectedSuite === suite.id ? 'text-white' : 'text-gray-900'}`}>
                    {suite.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedSuite === suite.id
                      ? 'bg-white/20 text-white'
                      : getStatusColor(suite.status)
                  }`}>
                    {suite.status}
                  </span>
                </div>
                <div className={`grid grid-cols-3 gap-2 text-xs ${
                  selectedSuite === suite.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  <div>
                    <div className="font-medium">{suite.tests}</div>
                    <div>tests</div>
                  </div>
                  <div>
                    <div className="font-medium">{suite.coverage > 0 ? `${suite.coverage}%` : 'N/A'}</div>
                    <div>coverage</div>
                  </div>
                  <div>
                    <div className="font-medium">{suite.duration}</div>
                    <div>duration</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${selectedSuite === suite.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {suite.lastRun}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runTestSuite(suite.id);
                    }}
                    className={`p-1 rounded hover:bg-white/20 transition-all ${
                      selectedSuite === suite.id ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedSuiteData && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedSuiteData.name}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">{selectedSuiteData.passed} passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-gray-600">{selectedSuiteData.failed} failed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600">{selectedSuiteData.duration}</span>
                    </div>
                  </div>
                </div>

                {selectedSuiteData.coverage > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Code Coverage</span>
                      <span className="text-sm font-bold text-gray-900">{selectedSuiteData.coverage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getTypeColor(selectedSuiteData.type)} h-2 rounded-full`}
                        style={{ width: `${selectedSuiteData.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Results List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Test Results</h3>
                {testResults.map(result => (
                  <div
                    key={result.id}
                    className={`border rounded-lg p-4 ${
                      result.status === 'passed'
                        ? 'bg-green-50 border-green-200'
                        : result.status === 'failed'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {result.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : result.status === 'failed' ? (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{result.name}</p>
                          {result.error && (
                            <p className="text-sm text-red-600 mt-1 font-mono">{result.error}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{result.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityLabs;
