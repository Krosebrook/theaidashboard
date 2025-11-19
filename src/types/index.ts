export interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  agent?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  progress?: number;
}

export interface Agent {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: 'active' | 'busy' | 'idle';
  description: string;
  capabilities: string[];
}

export interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tech: string;
  status: 'ready' | 'configuring' | 'error';
  deployment: string[];
  features: string[];
}

export interface SecurityCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  lastCheck: string;
}

export interface DeploymentTarget {
  name: string;
  status: 'deployed' | 'review' | 'configuring' | 'failed';
  url: string;
  cost: string;
  users: string;
  uptime: string;
  lastDeploy: string;
}

export interface ProjectMetric {
  name: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  good: boolean;
}

export interface ProjectStats {
  totalProjects: number;
  activeDeployments: number;
  securityScore: number;
  uptime: string;
  monthlyActiveUsers: string;
  costOptimizationSaved: string;
  codeQualityScore: number;
  testCoverage: number;
}

export interface DatabaseTable {
  name: string;
  fields: number;
  relations: number;
  status: 'optimized' | 'warning' | 'new';
}

export interface DatabaseField {
  name: string;
  type: string;
  constraint: string;
  icon: string;
}

// Quality Labs Types
export interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'accessibility';
  status: 'passed' | 'failed' | 'running' | 'pending';
  coverage: number;
  tests: number;
  passed: number;
  failed: number;
  duration: string;
  lastRun: string;
}

export interface TestResult {
  id: string;
  suiteId: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: string;
  error?: string;
}

export interface TestRun {
  id: string;
  timestamp: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: string;
}

export interface AITestGeneration {
  id: string;
  component: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  testsGenerated: number;
  coverage: number;
}

// Project Galaxy Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on-hold' | 'completed' | 'archived';
  progress: number;
  startDate: string;
  endDate?: string;
  teamSize: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  tasksAssigned: number;
  tasksCompleted: number;
  efficiency: number;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  velocity: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface ProjectMetrics {
  velocity: number;
  burndownRate: number;
  tasksCompleted: number;
  tasksInProgress: number;
  teamEfficiency: number;
  blockers: number;
}

// Command Center (Settings) Types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  editor: EditorSettings;
  security: SecuritySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  slack: boolean;
  digest: 'realtime' | 'hourly' | 'daily' | 'weekly';
  types: {
    deployments: boolean;
    security: boolean;
    testing: boolean;
    projectUpdates: boolean;
  };
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  theme: string;
  autoSave: boolean;
  formatOnSave: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  apiKeyRotation: number;
  auditLog: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'git' | 'cloud' | 'ci-cd' | 'monitoring' | 'communication';
  status: 'connected' | 'disconnected' | 'error';
  icon: React.ComponentType<{ className?: string }>;
  config: Record<string, any>;
  lastSync?: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  status: 'active' | 'revoked';
}

export interface SystemConfig {
  maxProjects: number;
  maxDeployments: number;
  storageLimit: string;
  apiRateLimit: number;
  teamSize: number;
  retentionDays: number;
}