import { useState, useCallback } from 'react';
import type { TestSuite, TestResult, TestRun, AITestGeneration } from '../types';

export const useQualityLabs = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'unit',
      name: 'Unit Tests',
      type: 'unit',
      status: 'passed',
      coverage: 94,
      tests: 487,
      passed: 485,
      failed: 2,
      duration: '12.4s',
      lastRun: '5 min ago'
    },
    {
      id: 'integration',
      name: 'Integration Tests',
      type: 'integration',
      status: 'passed',
      coverage: 87,
      tests: 152,
      passed: 152,
      failed: 0,
      duration: '45.2s',
      lastRun: '10 min ago'
    },
    {
      id: 'e2e',
      name: 'End-to-End Tests',
      type: 'e2e',
      status: 'failed',
      coverage: 78,
      tests: 43,
      passed: 40,
      failed: 3,
      duration: '3m 22s',
      lastRun: '1 hour ago'
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      type: 'performance',
      status: 'passed',
      coverage: 0,
      tests: 28,
      passed: 27,
      failed: 1,
      duration: '5m 12s',
      lastRun: '2 hours ago'
    },
    {
      id: 'security',
      name: 'Security Tests',
      type: 'security',
      status: 'passed',
      coverage: 0,
      tests: 64,
      passed: 64,
      failed: 0,
      duration: '1m 34s',
      lastRun: '30 min ago'
    },
    {
      id: 'accessibility',
      name: 'Accessibility Tests',
      type: 'accessibility',
      status: 'passed',
      coverage: 92,
      tests: 89,
      passed: 89,
      failed: 0,
      duration: '23.8s',
      lastRun: '15 min ago'
    }
  ]);

  const [activeTestRun, setActiveTestRun] = useState<TestRun | null>(null);
  const [aiGenerations, setAiGenerations] = useState<AITestGeneration[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<string>('unit');

  // Run all tests
  const runAllTests = useCallback(async () => {
    const testRun: TestRun = {
      id: `run-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'running',
      progress: 0,
      totalTests: testSuites.reduce((sum, suite) => sum + suite.tests, 0),
      passedTests: 0,
      failedTests: 0,
      duration: '0s'
    };

    setActiveTestRun(testRun);

    // Simulate test execution
    const interval = setInterval(() => {
      setActiveTestRun(prev => {
        if (!prev || prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }

        const newProgress = Math.min(prev.progress + Math.random() * 10, 100);
        const isComplete = newProgress >= 100;

        return {
          ...prev,
          progress: newProgress,
          status: isComplete ? 'completed' : 'running',
          passedTests: isComplete ? prev.totalTests - 6 : Math.floor((newProgress / 100) * prev.totalTests),
          failedTests: isComplete ? 6 : 0,
          duration: isComplete ? '9m 15s' : `${Math.floor(newProgress / 10)}m ${Math.floor((newProgress % 10) * 6)}s`
        };
      });
    }, 500);

    // Update test suites after completion
    setTimeout(() => {
      setTestSuites(prev => prev.map(suite => ({
        ...suite,
        lastRun: 'just now',
        status: Math.random() > 0.1 ? 'passed' : (Math.random() > 0.5 ? 'failed' : 'passed')
      })));
    }, 10000);
  }, [testSuites]);

  // Run specific test suite
  const runTestSuite = useCallback(async (suiteId: string) => {
    setTestSuites(prev => prev.map(suite =>
      suite.id === suiteId ? { ...suite, status: 'running', lastRun: 'just now' } : suite
    ));

    // Simulate test execution
    setTimeout(() => {
      setTestSuites(prev => prev.map(suite =>
        suite.id === suiteId ? {
          ...suite,
          status: Math.random() > 0.2 ? 'passed' : 'failed',
          lastRun: 'just now'
        } : suite
      ));
    }, 3000);
  }, []);

  // Generate AI tests for a component
  const generateAITests = useCallback(async (component: string) => {
    const generation: AITestGeneration = {
      id: `gen-${Date.now()}`,
      component,
      status: 'generating',
      progress: 0,
      testsGenerated: 0,
      coverage: 0
    };

    setAiGenerations(prev => [...prev, generation]);

    // Simulate AI test generation
    const interval = setInterval(() => {
      setAiGenerations(prev => prev.map(gen => {
        if (gen.id !== generation.id) return gen;

        const newProgress = Math.min(gen.progress + Math.random() * 15, 100);
        const isComplete = newProgress >= 100;

        return {
          ...gen,
          progress: newProgress,
          status: isComplete ? 'completed' : 'generating',
          testsGenerated: isComplete ? Math.floor(Math.random() * 20) + 15 : Math.floor((newProgress / 100) * 20),
          coverage: isComplete ? Math.floor(Math.random() * 15) + 85 : Math.floor((newProgress / 100) * 85)
        };
      }));

      if (aiGenerations.some(g => g.progress >= 100)) {
        clearInterval(interval);
      }
    }, 400);
  }, [aiGenerations]);

  // Get test results for a specific suite
  const getTestResults = useCallback((suiteId: string): TestResult[] => {
    const mockResults: TestResult[] = [];
    const suite = testSuites.find(s => s.id === suiteId);

    if (!suite) return mockResults;

    // Generate mock test results
    for (let i = 0; i < Math.min(suite.tests, 10); i++) {
      mockResults.push({
        id: `${suiteId}-test-${i}`,
        suiteId,
        name: generateTestName(suite.type, i),
        status: i < suite.passed ? 'passed' : 'failed',
        duration: `${Math.floor(Math.random() * 500)}ms`,
        error: i >= suite.passed ? 'Expected true but got false' : undefined
      });
    }

    return mockResults;
  }, [testSuites]);

  // Get overall test statistics
  const getTestStats = useCallback(() => {
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests, 0);
    const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0);
    const avgCoverage = Math.round(
      testSuites.filter(s => s.coverage > 0).reduce((sum, suite) => sum + suite.coverage, 0) /
      testSuites.filter(s => s.coverage > 0).length
    );

    return {
      totalTests,
      totalPassed,
      totalFailed,
      avgCoverage,
      passRate: Math.round((totalPassed / totalTests) * 100)
    };
  }, [testSuites]);

  return {
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
  };
};

// Helper function to generate test names
const generateTestName = (type: string, index: number): string => {
  const testNames: Record<string, string[]> = {
    unit: [
      'should render component correctly',
      'should handle user input',
      'should validate form data',
      'should call API on submit',
      'should display error messages',
      'should update state correctly',
      'should handle edge cases',
      'should perform calculations accurately',
      'should manage component lifecycle',
      'should handle async operations'
    ],
    integration: [
      'should integrate with authentication service',
      'should connect to database successfully',
      'should handle API responses',
      'should process payment transactions',
      'should send email notifications',
      'should sync data across services',
      'should handle third-party integrations',
      'should manage user sessions',
      'should validate business logic',
      'should handle concurrent requests'
    ],
    e2e: [
      'should complete user registration flow',
      'should navigate through app successfully',
      'should handle checkout process',
      'should display dashboard correctly',
      'should allow user to edit profile',
      'should search and filter results',
      'should upload and display files',
      'should handle multi-step forms',
      'should display notifications',
      'should logout user correctly'
    ],
    performance: [
      'should load page in under 2 seconds',
      'should handle 1000 concurrent users',
      'should render list with 10000 items',
      'should optimize database queries',
      'should minimize bundle size',
      'should cache API responses',
      'should lazy load components',
      'should debounce user input',
      'should prefetch critical resources',
      'should compress images efficiently'
    ],
    security: [
      'should prevent XSS attacks',
      'should sanitize user input',
      'should validate authentication tokens',
      'should enforce HTTPS connections',
      'should protect against CSRF',
      'should implement rate limiting',
      'should encrypt sensitive data',
      'should validate API permissions',
      'should handle session expiration',
      'should prevent SQL injection'
    ],
    accessibility: [
      'should have proper ARIA labels',
      'should support keyboard navigation',
      'should have sufficient color contrast',
      'should provide alt text for images',
      'should have semantic HTML structure',
      'should support screen readers',
      'should have focusable elements',
      'should have descriptive link text',
      'should handle reduced motion',
      'should provide error announcements'
    ]
  };

  const names = testNames[type] || testNames.unit;
  return names[index % names.length];
};
