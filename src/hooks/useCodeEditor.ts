import { useState, useCallback } from 'react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
  children?: FileNode[];
  modified?: boolean;
}

interface EditorTab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  modified: boolean;
}

interface CodeSuggestion {
  id: string;
  type: 'optimization' | 'bug' | 'style' | 'security';
  message: string;
  line: number;
  severity: 'info' | 'warning' | 'error';
  fix?: string;
}

export const useCodeEditor = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            {
              id: 'chat-interface',
              name: 'ChatInterface.tsx',
              type: 'file',
              path: 'src/components/ChatInterface.tsx',
              language: 'typescript',
              content: `import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, Send } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className="mb-4">
            <div className="font-medium">{message.type}</div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};`,
              modified: true
            }
          ]
        },
        {
          id: 'app',
          name: 'App.tsx',
          type: 'file',
          path: 'src/App.tsx',
          language: 'typescript',
          content: `import React from 'react';
import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
}

export default App;`
        }
      ]
    }
  ]);

  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);

  const openFile = useCallback((file: FileNode) => {
    if (file.type !== 'file' || !file.content) return;

    const existingTab = openTabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return;
    }

    const newTab: EditorTab = {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.content,
      language: file.language || 'text',
      modified: false
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, [openTabs]);

  const closeTab = useCallback((tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[0].id : null);
    }
  }, [activeTab, openTabs]);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setOpenTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, modified: true }
        : tab
    ));

    // Update file tree
    setFileTree(prev => updateFileContent(prev, tabId, content));
  }, []);

  const saveFile = useCallback(async (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;

    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));

    setOpenTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, modified: false } : t
    ));

    // Update file tree
    setFileTree(prev => updateFileModified(prev, tabId, false));
  }, [openTabs]);

  const formatCode = useCallback((tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;

    // Simple code formatting simulation
    let formatted = tab.content;
    
    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
      const indented = '  '.repeat(indentLevel) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      return indented;
    });

    formatted = formattedLines.join('\n');
    updateTabContent(tabId, formatted);
  }, [openTabs, updateTabContent]);

  const generateSuggestions = useCallback((content: string) => {
    const suggestions: CodeSuggestion[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for console.log statements
      if (line.includes('console.log')) {
        suggestions.push({
          id: `console-${index}`,
          type: 'style',
          message: 'Consider removing console.log statements in production',
          line: index + 1,
          severity: 'warning',
          fix: line.replace(/console\.log\([^)]*\);?\s*/, '')
        });
      }

      // Check for missing error handling
      if (line.includes('fetch(') && !content.includes('catch')) {
        suggestions.push({
          id: `error-handling-${index}`,
          type: 'bug',
          message: 'Add error handling for fetch requests',
          line: index + 1,
          severity: 'error'
        });
      }

      // Check for inline styles
      if (line.includes('style={{')) {
        suggestions.push({
          id: `inline-style-${index}`,
          type: 'optimization',
          message: 'Consider using CSS classes instead of inline styles',
          line: index + 1,
          severity: 'info'
        });
      }

      // Check for hardcoded values
      if (line.match(/['"][^'"]*\d+[^'"]*['"]/)) {
        suggestions.push({
          id: `hardcoded-${index}`,
          type: 'optimization',
          message: 'Consider extracting hardcoded values to constants',
          line: index + 1,
          severity: 'info'
        });
      }
    });

    setSuggestions(suggestions);
  }, []);

  const applySuggestion = useCallback((suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion || !suggestion.fix || !activeTab) return;

    const tab = openTabs.find(t => t.id === activeTab);
    if (!tab) return;

    const lines = tab.content.split('\n');
    lines[suggestion.line - 1] = suggestion.fix;
    const newContent = lines.join('\n');

    updateTabContent(activeTab, newContent);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, [suggestions, activeTab, openTabs, updateTabContent]);

  const createFile = useCallback((parentPath: string, name: string, type: 'file' | 'folder') => {
    const newNode: FileNode = {
      id: `${parentPath}/${name}`,
      name,
      type,
      path: `${parentPath}/${name}`,
      content: type === 'file' ? '' : undefined,
      language: type === 'file' ? getLanguageFromExtension(name) : undefined,
      children: type === 'folder' ? [] : undefined
    };

    setFileTree(prev => addFileToTree(prev, parentPath, newNode));
  }, []);

  const deleteFile = useCallback((filePath: string) => {
    setFileTree(prev => removeFileFromTree(prev, filePath));
    
    // Close tab if file is open
    const openTab = openTabs.find(tab => tab.path === filePath);
    if (openTab) {
      closeTab(openTab.id);
    }
  }, [openTabs, closeTab]);

  const runCode = useCallback(async () => {
    if (!activeTab) return;

    const tab = openTabs.find(t => t.id === activeTab);
    if (!tab) return;

    // Simulate code execution
    console.log('Running code:', tab.content);
    
    // For demo purposes, just show a success message
    return { success: true, output: 'Code executed successfully!' };
  }, [activeTab, openTabs]);

  return {
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
    createFile,
    deleteFile,
    runCode,
    setActiveTab
  };
};

// Helper functions
const updateFileContent = (nodes: FileNode[], fileId: string, content: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === fileId) {
      return { ...node, content, modified: true };
    }
    if (node.children) {
      return { ...node, children: updateFileContent(node.children, fileId, content) };
    }
    return node;
  });
};

const updateFileModified = (nodes: FileNode[], fileId: string, modified: boolean): FileNode[] => {
  return nodes.map(node => {
    if (node.id === fileId) {
      return { ...node, modified };
    }
    if (node.children) {
      return { ...node, children: updateFileModified(node.children, fileId, modified) };
    }
    return node;
  });
};

const addFileToTree = (nodes: FileNode[], parentPath: string, newNode: FileNode): FileNode[] => {
  return nodes.map(node => {
    if (node.path === parentPath && node.type === 'folder') {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: addFileToTree(node.children, parentPath, newNode) };
    }
    return node;
  });
};

const removeFileFromTree = (nodes: FileNode[], filePath: string): FileNode[] => {
  return nodes.filter(node => {
    if (node.path === filePath) return false;
    if (node.children) {
      node.children = removeFileFromTree(node.children, filePath);
    }
    return true;
  });
};

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx': return 'typescript';
    case 'js':
    case 'jsx': return 'javascript';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'text';
  }
};