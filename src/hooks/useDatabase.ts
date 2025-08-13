import { useState, useCallback } from 'react';
import type { DatabaseTable, DatabaseField } from '../types';

interface QueryResult {
  data: any[];
  rowCount: number;
  executionTime: number;
  columns: string[];
}

interface DatabaseConnection {
  host: string;
  database: string;
  status: 'connected' | 'disconnected' | 'error';
  lastPing: string;
}

export const useDatabase = () => {
  const [connection, setConnection] = useState<DatabaseConnection>({
    host: 'localhost:5432',
    database: 'social_media_app',
    status: 'connected',
    lastPing: new Date().toISOString()
  });

  const [queryHistory, setQueryHistory] = useState<Array<{
    id: string;
    query: string;
    result: QueryResult;
    timestamp: string;
  }>>([]);

  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = useCallback(async (query: string): Promise<QueryResult> => {
    setIsExecuting(true);
    
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const result = simulateQueryExecution(query);
      
      // Add to history
      setQueryHistory(prev => [{
        id: Date.now().toString(),
        query,
        result,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]); // Keep last 10 queries
      
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const optimizeQuery = useCallback((query: string): string => {
    // Simulate query optimization
    let optimized = query;
    
    // Add indexes suggestion
    if (query.toLowerCase().includes('where') && !query.toLowerCase().includes('index')) {
      optimized += '\n-- Suggestion: Consider adding an index on the WHERE clause columns';
    }
    
    // Add LIMIT suggestion
    if (!query.toLowerCase().includes('limit') && query.toLowerCase().includes('select')) {
      optimized += '\n-- Suggestion: Add LIMIT clause to prevent large result sets';
    }
    
    return optimized;
  }, []);

  const generateSchema = useCallback((tableName: string, fields: DatabaseField[]): string => {
    const fieldDefinitions = fields.map(field => {
      let definition = `  ${field.name} ${field.type}`;
      if (field.constraint) {
        definition += ` ${field.constraint}`;
      }
      return definition;
    }).join(',\n');

    return `CREATE TABLE ${tableName} (\n${fieldDefinitions}\n);`;
  }, []);

  const analyzePerformance = useCallback((query: string) => {
    // Simulate performance analysis
    const analysis = {
      estimatedCost: Math.floor(Math.random() * 1000),
      estimatedRows: Math.floor(Math.random() * 10000),
      indexUsage: Math.random() > 0.5 ? 'Index Scan' : 'Sequential Scan',
      recommendations: [
        'Consider adding an index on frequently queried columns',
        'Use LIMIT to reduce result set size',
        'Consider query caching for repeated queries'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    return analysis;
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnection(prev => ({
        ...prev,
        status: 'connected',
        lastPing: new Date().toISOString()
      }));
      
      return true;
    } catch (error) {
      setConnection(prev => ({
        ...prev,
        status: 'error'
      }));
      return false;
    }
  }, []);

  return {
    connection,
    queryHistory,
    isExecuting,
    executeQuery,
    optimizeQuery,
    generateSchema,
    analyzePerformance,
    testConnection
  };
};

// Helper function to simulate query execution
const simulateQueryExecution = (query: string): QueryResult => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('select')) {
    // Simulate SELECT results
    const sampleData = generateSampleData(queryLower);
    return {
      data: sampleData,
      rowCount: sampleData.length,
      executionTime: Math.floor(Math.random() * 200) + 50,
      columns: extractColumns(query)
    };
  } else if (queryLower.includes('insert')) {
    return {
      data: [],
      rowCount: 1,
      executionTime: Math.floor(Math.random() * 100) + 20,
      columns: []
    };
  } else if (queryLower.includes('update')) {
    return {
      data: [],
      rowCount: Math.floor(Math.random() * 10) + 1,
      executionTime: Math.floor(Math.random() * 150) + 30,
      columns: []
    };
  } else if (queryLower.includes('delete')) {
    return {
      data: [],
      rowCount: Math.floor(Math.random() * 5) + 1,
      executionTime: Math.floor(Math.random() * 100) + 25,
      columns: []
    };
  }
  
  return {
    data: [],
    rowCount: 0,
    executionTime: 0,
    columns: []
  };
};

const generateSampleData = (query: string) => {
  if (query.includes('users')) {
    return [
      { id: 'usr_001', username: 'sarah.chen', email: 'sarah@example.com', created_at: '2024-01-15' },
      { id: 'usr_002', username: 'mike.dev', email: 'mike@example.com', created_at: '2024-01-16' },
      { id: 'usr_003', username: 'alex.ui', email: 'alex@example.com', created_at: '2024-01-17' }
    ];
  } else if (query.includes('posts')) {
    return [
      { id: 'post_001', title: 'Getting Started with React', user_id: 'usr_001', likes_count: 42 },
      { id: 'post_002', title: 'Database Design Patterns', user_id: 'usr_002', likes_count: 38 },
      { id: 'post_003', title: 'UI/UX Best Practices', user_id: 'usr_003', likes_count: 55 }
    ];
  }
  
  return [];
};

const extractColumns = (query: string): string[] => {
  const selectMatch = query.match(/select\s+(.*?)\s+from/i);
  if (selectMatch) {
    const columns = selectMatch[1].split(',').map(col => col.trim());
    return columns.includes('*') ? ['id', 'name', 'created_at'] : columns;
  }
  return [];
};