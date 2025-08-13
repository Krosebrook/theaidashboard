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