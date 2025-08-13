import { useState, useCallback } from 'react';
import type { Message, Agent } from '../types';

interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  result?: any;
}

export const useAgentCoordination = () => {
  const [activeTasks, setActiveTasks] = useState<AgentTask[]>([]);
  const [isCoordinating, setIsCoordinating] = useState(false);

  const coordinateAgents = useCallback(async (
    userInput: string,
    agents: Agent[],
    onProgress: (message: Message) => void
  ) => {
    setIsCoordinating(true);
    
    try {
      // 1. Master Orchestrator Analysis
      const analysisTask: AgentTask = {
        id: 'analysis',
        agentId: 'orchestrator',
        description: 'Analyzing requirements and creating execution plan',
        status: 'in-progress',
        progress: 0
      };
      
      setActiveTasks([analysisTask]);
      
      // Simulate orchestrator analysis
      await simulateAgentWork(analysisTask, (progress) => {
        setActiveTasks(prev => prev.map(task => 
          task.id === 'analysis' ? { ...task, progress } : task
        ));
      });

      // Send orchestrator response
      onProgress({
        id: Date.now(),
        type: 'assistant',
        agent: 'Master Orchestrator',
        content: `🧠 **Analysis Complete**: I've analyzed your request and created an execution plan.\n\n✅ **Project Type**: ${detectProjectType(userInput)}\n✅ **Required Agents**: ${getRequiredAgents(userInput).length} specialized agents\n✅ **Estimated Complexity**: ${getComplexityLevel(userInput)}\n✅ **Timeline**: ${getEstimatedTime(userInput)}\n\nInitiating agent coordination...`,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        progress: 25
      });

      // 2. Parallel Agent Execution
      const requiredAgents = getRequiredAgents(userInput);
      const agentTasks = requiredAgents.map(agentId => ({
        id: `task-${agentId}`,
        agentId,
        description: getAgentTaskDescription(agentId, userInput),
        status: 'in-progress' as const,
        progress: 0
      }));

      setActiveTasks(prev => [...prev, ...agentTasks]);

      // Execute agent tasks in parallel
      await Promise.all(agentTasks.map(async (task) => {
        await simulateAgentWork(task, (progress) => {
          setActiveTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, progress } : t
          ));
        });

        // Send agent-specific response
        const agent = agents.find(a => a.id === task.agentId);
        if (agent) {
          onProgress({
            id: Date.now() + Math.random(),
            type: 'assistant',
            agent: agent.name,
            content: generateAgentResponse(task.agentId, userInput),
            timestamp: new Date().toISOString(),
            status: 'delivered',
            progress: 50 + (agentTasks.indexOf(task) * 10)
          });
        }
      }));

      // 3. Final Integration
      onProgress({
        id: Date.now(),
        type: 'assistant',
        agent: 'Master Orchestrator',
        content: `🚀 **Deployment Complete**: Your application is now live!\n\n🌐 **Web App**: https://your-app.vercel.app\n📱 **Mobile**: Built for iOS/Android stores\n🔒 **Security**: 98.5% security score\n📊 **Performance**: Optimized for global scale\n💰 **Cost**: $47/month estimated\n\n**Next Steps:**\n• Review generated code in Code Studio\n• Configure database in Data Architect\n• Monitor security in Security Shield\n• Track analytics in Intelligence Hub`,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        progress: 100
      });

    } catch (error) {
      console.error('Agent coordination failed:', error);
    } finally {
      setIsCoordinating(false);
      setActiveTasks([]);
    }
  }, []);

  return {
    coordinateAgents,
    activeTasks,
    isCoordinating
  };
};

// Helper functions
const simulateAgentWork = (task: AgentTask, onProgress: (progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onProgress(progress);
        resolve();
      } else {
        onProgress(progress);
      }
    }, 300);
  });
};

const detectProjectType = (input: string): string => {
  const keywords = input.toLowerCase();
  if (keywords.includes('social') || keywords.includes('chat')) return 'Social Media Platform';
  if (keywords.includes('ecommerce') || keywords.includes('shop')) return 'E-commerce Platform';
  if (keywords.includes('blog') || keywords.includes('cms')) return 'Content Management System';
  if (keywords.includes('dashboard') || keywords.includes('admin')) return 'Admin Dashboard';
  return 'Custom Web Application';
};

const getRequiredAgents = (input: string): string[] => {
  const agents = ['codegen'];
  if (input.toLowerCase().includes('database') || input.toLowerCase().includes('data')) {
    agents.push('database');
  }
  if (input.toLowerCase().includes('secure') || input.toLowerCase().includes('auth')) {
    agents.push('security');
  }
  if (input.toLowerCase().includes('deploy') || input.toLowerCase().includes('host')) {
    agents.push('deploy');
  }
  if (input.toLowerCase().includes('test') || input.toLowerCase().includes('quality')) {
    agents.push('qa');
  }
  return agents;
};

const getComplexityLevel = (input: string): string => {
  const wordCount = input.split(' ').length;
  if (wordCount > 20) return 'High';
  if (wordCount > 10) return 'Medium';
  return 'Low';
};

const getEstimatedTime = (input: string): string => {
  const complexity = getComplexityLevel(input);
  switch (complexity) {
    case 'High': return '8-12 minutes';
    case 'Medium': return '4-8 minutes';
    default: return '2-4 minutes';
  }
};

const getAgentTaskDescription = (agentId: string, input: string): string => {
  switch (agentId) {
    case 'codegen': return 'Generating full-stack application code';
    case 'database': return 'Designing database schema and APIs';
    case 'security': return 'Implementing security measures';
    case 'deploy': return 'Setting up deployment pipeline';
    case 'qa': return 'Creating test suites and quality checks';
    default: return 'Processing request';
  }
};

const generateAgentResponse = (agentId: string, input: string): string => {
  switch (agentId) {
    case 'codegen':
      return `💻 **Code Generation Complete**:\n\n✅ **Frontend**: React/TypeScript with Tailwind CSS\n✅ **Backend**: Node.js/Express with TypeScript\n✅ **Database**: PostgreSQL with Prisma ORM\n✅ **Authentication**: JWT with refresh tokens\n✅ **API**: RESTful endpoints + GraphQL\n✅ **Real-time**: WebSocket integration\n✅ **Testing**: Jest + React Testing Library\n\n📁 **Generated Files**: 47 components, 23 API routes, 12 database models`;
    
    case 'database':
      return `🗄️ **Database Architecture Complete**:\n\n✅ **Schema**: 8 optimized tables with relationships\n✅ **Indexes**: Performance-optimized queries\n✅ **Migrations**: Version-controlled schema changes\n✅ **Backup**: Automated daily backups\n✅ **Scaling**: Read replicas configured\n✅ **Security**: Row-level security enabled\n\n📊 **Performance**: Sub-100ms query times, 99.9% uptime SLA`;
    
    case 'security':
      return `🛡️ **Security Implementation Complete**:\n\n✅ **Authentication**: Multi-factor with TOTP\n✅ **Authorization**: Role-based access control\n✅ **Encryption**: AES-256 data encryption\n✅ **API Security**: Rate limiting + CORS\n✅ **Input Validation**: XSS/SQL injection protection\n✅ **Compliance**: GDPR + HIPAA ready\n✅ **Monitoring**: Real-time threat detection\n\n🔒 **Security Score**: 98.5% (Industry Leading)`;
    
    case 'deploy':
      return `🚀 **Deployment Pipeline Ready**:\n\n✅ **CI/CD**: GitHub Actions workflow\n✅ **Staging**: Automatic preview deployments\n✅ **Production**: Multi-region deployment\n✅ **CDN**: Global content delivery\n✅ **Monitoring**: Uptime + performance tracking\n✅ **Scaling**: Auto-scaling configured\n\n🌍 **Global Reach**: 5 regions, <100ms latency worldwide`;
    
    case 'qa':
      return `🧪 **Quality Assurance Complete**:\n\n✅ **Unit Tests**: 94% code coverage\n✅ **Integration Tests**: API endpoint validation\n✅ **E2E Tests**: User journey automation\n✅ **Performance Tests**: Load testing up to 10K users\n✅ **Accessibility**: WCAG 2.1 AA compliance\n✅ **Security Tests**: Vulnerability scanning\n\n📈 **Quality Score**: 9.2/10 (Excellent)`;
    
    default:
      return 'Task completed successfully';
  }
};