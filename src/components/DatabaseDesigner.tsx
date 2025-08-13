import React from 'react';
import { 
  Database, Settings, Plus, RefreshCw, CheckCircle, 
  Brain, Zap
} from 'lucide-react';
import { databaseTables } from '../data/mockData';
import { useDatabase } from '../hooks/useDatabase';
import type { DatabaseField } from '../types';

const DatabaseDesigner: React.FC = () => {
  const {
    connection,
    queryHistory,
    isExecuting,
    executeQuery,
    optimizeQuery,
    generateSchema,
    analyzePerformance,
    testConnection
  } = useDatabase();

  const [selectedQuery, setSelectedQuery] = React.useState('SELECT id, email, username, first_name, last_name, created_at FROM users WHERE created_at > \'2024-01-01\' ORDER BY created_at DESC LIMIT 50;');
  const [queryResult, setQueryResult] = React.useState<any>(null);
  const userFields: DatabaseField[] = [
    { name: 'id', type: 'UUID', constraint: 'PK', icon: '🔑' },
    { name: 'email', type: 'VARCHAR(255)', constraint: 'UNIQUE', icon: '📧' },
    { name: 'username', type: 'VARCHAR(50)', constraint: 'UNIQUE', icon: '👤' },
    { name: 'password_hash', type: 'VARCHAR(255)', constraint: 'NOT NULL', icon: '🔒' },
    { name: 'first_name', type: 'VARCHAR(100)', constraint: '', icon: '👤' },
    { name: 'last_name', type: 'VARCHAR(100)', constraint: '', icon: '👤' },
    { name: 'avatar_url', type: 'TEXT', constraint: '', icon: '🖼️' },
    { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', icon: '⏰' }
  ];

  const postFields: DatabaseField[] = [
    { name: 'id', type: 'UUID', constraint: 'PK', icon: '🔑' },
    { name: 'user_id', type: 'UUID', constraint: 'FK → users.id', icon: '👤' },
    { name: 'title', type: 'VARCHAR(255)', constraint: 'NOT NULL', icon: '📝' },
    { name: 'content', type: 'TEXT', constraint: '', icon: '📄' },
    { name: 'media_urls', type: 'JSON', constraint: '', icon: '📱' },
    { name: 'likes_count', type: 'INTEGER', constraint: 'DEFAULT 0', icon: '❤️' },
    { name: 'comments_count', type: 'INTEGER', constraint: 'DEFAULT 0', icon: '💬' },
    { name: 'is_published', type: 'BOOLEAN', constraint: 'DEFAULT true', icon: '🌐' },
    { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', icon: '⏰' },
    { name: 'updated_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', icon: '🔄' }
  ];

  const commentFields: DatabaseField[] = [
    { name: 'id', type: 'UUID', constraint: 'PK', icon: '🔑' },
    { name: 'post_id', type: 'UUID', constraint: 'FK → posts.id', icon: '📝' },
    { name: 'user_id', type: 'UUID', constraint: 'FK → users.id', icon: '👤' },
    { name: 'parent_id', type: 'UUID', constraint: 'FK → comments.id', icon: '🔗' },
    { name: 'content', type: 'TEXT', constraint: 'NOT NULL', icon: '💬' },
    { name: 'likes_count', type: 'INTEGER', constraint: 'DEFAULT 0', icon: '❤️' },
    { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT NOW()', icon: '⏰' }
  ];

  const renderTable = (tableName: string, fields: DatabaseField[], color: string) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h4 className={`font-bold ${color} flex items-center gap-2`}>
          <Database className="w-5 h-5" />
          {tableName}
        </h4>
        <div className="flex items-center gap-1">
          {tableName === 'comments' && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          )}
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {fields.map(field => (
          <div key={field.name} className={`flex items-center justify-between p-2 hover:${color.replace('text-', 'bg-').replace('-900', '-50')} rounded`}>
            <div className="flex items-center gap-2">
              <span>{field.icon}</span>
              <span className="font-medium">{field.name}</span>
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-xs">{field.type}</div>
              {field.constraint && (
                <div className={`${color.replace('-900', '-600')} text-xs font-medium`}>{field.constraint}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      {/* Schema Explorer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Database Schema</h3>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={testConnection}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
            connection.status === 'connected' 
              ? 'text-green-600 bg-green-50' 
              : connection.status === 'error'
              ? 'text-red-600 bg-red-50'
              : 'text-yellow-600 bg-yellow-50'
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>
              {connection.status === 'connected' ? 'Connected to PostgreSQL' :
               connection.status === 'error' ? 'Connection Error' :
               'Connecting...'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-3">
            {databaseTables.map(table => (
              <div key={table.name} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-900">{table.name}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    table.status === 'optimized' ? 'bg-green-500' :
                    table.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{table.fields} fields • {table.relations} relations</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      table.status === 'optimized' ? 'bg-green-100 text-green-700' :
                      table.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {table.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Data Assistant */}
        <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            Data AI Assistant
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => setSelectedQuery(optimizeQuery(selectedQuery))}
              className="w-full text-left p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
            >
              🔍 Optimize table indexes
            </button>
            <button 
              onClick={() => analyzePerformance(selectedQuery)}
              className="w-full text-left p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
            >
              ⚡ Suggest query improvements
            </button>
            <button className="w-full text-left p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              🔗 Auto-detect relationships
            </button>
          </div>
        </div>
      </div>

      {/* Visual Schema Designer */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Visual Schema Designer</h3>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                Add Table
              </button>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium">
                Generate API
              </button>
              <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium">
                Deploy Schema
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="grid grid-cols-3 gap-6 h-full relative">
            {renderTable('users', userFields, 'text-blue-900')}
            {renderTable('posts', postFields, 'text-green-900')}
            {renderTable('comments', commentFields, 'text-purple-900')}

            {/* Relationship Lines - SVG Overlay */}
            <svg className="absolute inset-0 pointer-events-none" style={{zIndex: 1}}>
              {/* User to Posts relationship */}
              <line x1="320" y1="150" x2="380" y2="180" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
              {/* User to Comments relationship */}
              <line x1="320" y1="200" x2="760" y2="180" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              {/* Post to Comments relationship */}
              <line x1="700" y1="250" x2="760" y2="220" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Query Builder */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Smart Query Builder</h3>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Optimization</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Table</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option>users</option>
              <option>posts</option>
              <option>comments</option>
              <option>likes</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Operation</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option>SELECT</option>
              <option>INSERT</option>
              <option>UPDATE</option>
              <option>DELETE</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Fields</label>
            <div className="space-y-2 max-h-32 overflow-auto border border-gray-200 rounded-lg p-2">
              {['id', 'email', 'username', 'first_name', 'last_name', 'created_at'].map(field => (
                <label key={field} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="text-purple-600" />
                  <span className="text-sm text-gray-700">{field}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Conditions</label>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="WHERE condition..."
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              />
              <input 
                type="text" 
                placeholder="ORDER BY..."
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              />
              <input 
                type="text" 
                placeholder="LIMIT..."
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Generated Query Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Generated Query</div>
            <textarea
              value={selectedQuery}
              onChange={(e) => setSelectedQuery(e.target.value)}
              className="w-full bg-gray-900 text-green-400 p-3 rounded font-mono text-xs resize-none h-24"
            />
          </div>

          <div className="space-y-2">
            <button 
              onClick={async () => {
                const result = await executeQuery(selectedQuery);
                setQueryResult(result);
              }}
              disabled={isExecuting}
              className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium"
            >
              {isExecuting ? 'Executing...' : 'Execute Query'}
            </button>
              Execute Query
            </button>
            <button className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm">
              Optimize Query
            </button>
            <button className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm">
              Explain Plan
            </button>
          </div>
        </div>

        {/* Query Results Preview */}
        <div className="border-t border-gray-100 p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Query Results {queryResult && `(${queryResult.rowCount} rows, ${queryResult.executionTime}ms)`}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-xs">
            {queryResult ? (
              <div className="space-y-2">
                {queryResult.columns.length > 0 && (
                  <div className="grid gap-2 font-mono font-semibold" style={{gridTemplateColumns: `repeat(${queryResult.columns.length}, 1fr)`}}>
                    {queryResult.columns.map((col: string) => (
                      <div key={col}>{col}</div>
                    ))}
                  </div>
                )}
                {queryResult.data.slice(0, 5).map((row: any, index: number) => (
                  <div key={index} className="grid gap-2 font-mono" style={{gridTemplateColumns: `repeat(${queryResult.columns.length}, 1fr)`}}>
                    {queryResult.columns.map((col: string) => (
                      <div key={col}>{row[col]}</div>
                    ))}
                  </div>
                ))}
                {queryResult.data.length > 5 && (
                  <div className="text-gray-500 text-center">... and {queryResult.data.length - 5} more rows</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center">Execute a query to see results</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDesigner;