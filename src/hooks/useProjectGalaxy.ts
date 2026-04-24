import { useState, useCallback } from 'react';
import type { Project, Task, TeamMember, Sprint, ProjectMetrics } from '../types';

export const useProjectGalaxy = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce platform with AI recommendations',
      status: 'active',
      progress: 67,
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      teamSize: 8,
      priority: 'high',
      tags: ['frontend', 'backend', 'ai', 'payment']
    },
    {
      id: 'proj-2',
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application for iOS and Android',
      status: 'active',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      teamSize: 6,
      priority: 'critical',
      tags: ['mobile', 'security', 'fintech']
    },
    {
      id: 'proj-3',
      name: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting dashboard',
      status: 'active',
      progress: 89,
      startDate: '2023-12-01',
      endDate: '2024-02-28',
      teamSize: 4,
      priority: 'medium',
      tags: ['analytics', 'visualization', 'real-time']
    },
    {
      id: 'proj-4',
      name: 'AI Content Generator',
      description: 'AI-powered content generation tool for marketing',
      status: 'on-hold',
      progress: 23,
      startDate: '2024-01-20',
      teamSize: 3,
      priority: 'low',
      tags: ['ai', 'nlp', 'marketing']
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Implement payment gateway integration',
      description: 'Integrate Stripe payment processing',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2024-02-15',
      estimatedHours: 16,
      actualHours: 8,
      tags: ['backend', 'payment'],
      dependencies: []
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: 'Design product recommendation algorithm',
      description: 'Create AI-based recommendation system',
      status: 'in-progress',
      priority: 'high',
      assignee: 'David Park',
      dueDate: '2024-02-20',
      estimatedHours: 24,
      actualHours: 12,
      tags: ['ai', 'backend'],
      dependencies: []
    },
    {
      id: 'task-3',
      projectId: 'proj-1',
      title: 'Build shopping cart UI',
      description: 'Create responsive shopping cart interface',
      status: 'done',
      priority: 'medium',
      assignee: 'Emily Rodriguez',
      dueDate: '2024-02-10',
      estimatedHours: 12,
      actualHours: 11,
      tags: ['frontend', 'ui'],
      dependencies: []
    },
    {
      id: 'task-4',
      projectId: 'proj-2',
      title: 'Implement biometric authentication',
      description: 'Add Face ID and fingerprint support',
      status: 'todo',
      priority: 'critical',
      assignee: 'Michael Johnson',
      dueDate: '2024-02-25',
      estimatedHours: 20,
      tags: ['mobile', 'security'],
      dependencies: []
    },
    {
      id: 'task-5',
      projectId: 'proj-2',
      title: 'Security audit and penetration testing',
      description: 'Comprehensive security assessment',
      status: 'review',
      priority: 'critical',
      assignee: 'Alex Turner',
      dueDate: '2024-02-18',
      estimatedHours: 32,
      actualHours: 28,
      tags: ['security', 'testing'],
      dependencies: []
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'member-1',
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      avatar: 'SC',
      status: 'available',
      tasksAssigned: 5,
      tasksCompleted: 12,
      efficiency: 94
    },
    {
      id: 'member-2',
      name: 'David Park',
      role: 'AI/ML Engineer',
      avatar: 'DP',
      status: 'busy',
      tasksAssigned: 3,
      tasksCompleted: 8,
      efficiency: 88
    },
    {
      id: 'member-3',
      name: 'Emily Rodriguez',
      role: 'Frontend Developer',
      avatar: 'ER',
      status: 'available',
      tasksAssigned: 4,
      tasksCompleted: 15,
      efficiency: 96
    },
    {
      id: 'member-4',
      name: 'Michael Johnson',
      role: 'Mobile Developer',
      avatar: 'MJ',
      status: 'available',
      tasksAssigned: 6,
      tasksCompleted: 10,
      efficiency: 92
    },
    {
      id: 'member-5',
      name: 'Alex Turner',
      role: 'Security Engineer',
      avatar: 'AT',
      status: 'busy',
      tasksAssigned: 3,
      tasksCompleted: 7,
      efficiency: 91
    }
  ]);

  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: 'sprint-1',
      name: 'Sprint 8 - Payment & Checkout',
      projectId: 'proj-1',
      startDate: '2024-02-01',
      endDate: '2024-02-14',
      status: 'active',
      velocity: 42,
      tasksCompleted: 8,
      tasksTotal: 12
    },
    {
      id: 'sprint-2',
      name: 'Sprint 4 - Security Hardening',
      projectId: 'proj-2',
      startDate: '2024-02-05',
      endDate: '2024-02-19',
      status: 'active',
      velocity: 38,
      tasksCompleted: 6,
      tasksTotal: 10
    }
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');

  // Create new project
  const createProject = useCallback((projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  // Update project
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  }, []);

  // Create new task
  const createTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  // Update task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Get tasks for a project
  const getProjectTasks = useCallback((projectId: string): Task[] => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  // Get project metrics
  const getProjectMetrics = useCallback((projectId: string): ProjectMetrics => {
    const projectTasks = getProjectTasks(projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'done');
    const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress');
    const blockedTasks = projectTasks.filter(t => t.status === 'blocked');

    const totalEstimated = completedTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalActual = completedTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
    const velocity = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;

    return {
      velocity: Math.round(velocity),
      burndownRate: Math.max(0, 100 - velocity),
      tasksCompleted: completedTasks.length,
      tasksInProgress: inProgressTasks.length,
      teamEfficiency: 92,
      blockers: blockedTasks.length
    };
  }, [getProjectTasks]);

  // AI-powered task estimation
  const estimateTaskEffort = useCallback((taskDescription: string): number => {
    // Simple heuristic based on description length and keywords
    const words = taskDescription.toLowerCase().split(' ').length;
    let hours = words * 0.5; // Base estimate

    // Adjust based on complexity keywords
    if (taskDescription.toLowerCase().includes('integration')) hours += 8;
    if (taskDescription.toLowerCase().includes('api')) hours += 4;
    if (taskDescription.toLowerCase().includes('design')) hours += 6;
    if (taskDescription.toLowerCase().includes('security')) hours += 10;
    if (taskDescription.toLowerCase().includes('ai') || taskDescription.toLowerCase().includes('ml')) hours += 12;
    if (taskDescription.toLowerCase().includes('mobile')) hours += 8;
    if (taskDescription.toLowerCase().includes('testing')) hours += 4;

    return Math.max(2, Math.min(40, Math.round(hours)));
  }, []);

  // AI-powered task prioritization
  const suggestTaskPriority = useCallback((task: Partial<Task>): Task['priority'] => {
    let score = 0;

    // Check due date
    if (task.dueDate) {
      const daysUntilDue = Math.ceil(
        (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDue < 3) score += 3;
      else if (daysUntilDue < 7) score += 2;
      else if (daysUntilDue < 14) score += 1;
    }

    // Check dependencies
    if (task.dependencies && task.dependencies.length > 0) score += 2;

    // Check keywords
    const description = (task.description || '').toLowerCase();
    if (description.includes('critical') || description.includes('urgent')) score += 3;
    if (description.includes('security') || description.includes('bug')) score += 2;
    if (description.includes('important')) score += 1;

    if (score >= 5) return 'critical';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }, []);

  // Get team member workload
  const getTeamWorkload = useCallback(() => {
    return teamMembers.map(member => {
      const memberTasks = tasks.filter(t => t.assignee === member.name && t.status !== 'done');
      const totalHours = memberTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

      return {
        ...member,
        currentWorkload: totalHours,
        activeTasks: memberTasks
      };
    });
  }, [teamMembers, tasks]);

  // AI-powered resource allocation
  const suggestTaskAssignment = useCallback((task: Task): string | null => {
    const workload = getTeamWorkload();

    // Filter available team members
    const availableMembers = workload.filter(m => m.status === 'available');

    if (availableMembers.length === 0) return null;

    // Sort by workload and efficiency
    const bestMatch = availableMembers.sort((a, b) => {
      const scoreA = a.efficiency - (a.currentWorkload * 2);
      const scoreB = b.efficiency - (b.currentWorkload * 2);
      return scoreB - scoreA;
    })[0];

    return bestMatch.name;
  }, [getTeamWorkload]);

  return {
    projects,
    tasks,
    teamMembers,
    sprints,
    selectedProjectId,
    setSelectedProjectId,
    createProject,
    updateProject,
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,
    getProjectMetrics,
    estimateTaskEffort,
    suggestTaskPriority,
    getTeamWorkload,
    suggestTaskAssignment
  };
};
