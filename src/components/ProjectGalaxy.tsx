import React, { useState } from 'react';
import {
  Rocket, Plus, Calendar, Users, TrendingUp, CheckCircle,
  Circle, Clock, AlertTriangle, BarChart3, Sparkles, User
} from 'lucide-react';
import { useProjectGalaxy } from '../hooks/useProjectGalaxy';
import type { Task } from '../types';

const ProjectGalaxy: React.FC = () => {
  const {
    projects,
    tasks,
    teamMembers,
    selectedProjectId,
    setSelectedProjectId,
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,
    getProjectMetrics,
    estimateTaskEffort,
    suggestTaskPriority,
    getTeamWorkload
  } = useProjectGalaxy();

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as Task['priority']
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = getProjectTasks(selectedProjectId);
  const projectMetrics = getProjectMetrics(selectedProjectId);
  const teamWorkload = getTeamWorkload();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'review': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'blocked': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4 animate-spin" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const handleCreateTask = () => {
    if (!newTaskData.title.trim()) return;

    const estimatedHours = estimateTaskEffort(newTaskData.description);
    const suggestedPriority = suggestTaskPriority(newTaskData);

    createTask({
      projectId: selectedProjectId,
      title: newTaskData.title,
      description: newTaskData.description,
      status: 'todo',
      priority: suggestedPriority,
      assignee: newTaskData.assignee || undefined,
      dueDate: newTaskData.dueDate || undefined,
      estimatedHours,
      tags: [],
      dependencies: []
    });

    setNewTaskData({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium'
    });
    setShowNewTaskModal(false);
  };

  const tasksByStatus = {
    todo: projectTasks.filter(t => t.status === 'todo'),
    'in-progress': projectTasks.filter(t => t.status === 'in-progress'),
    review: projectTasks.filter(t => t.status === 'review'),
    done: projectTasks.filter(t => t.status === 'done'),
    blocked: projectTasks.filter(t => t.status === 'blocked')
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Galaxy</h1>
              <p className="text-sm text-gray-600">AI-assisted project management and planning</p>
            </div>
          </div>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Project Selector */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedProjectId === project.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      {selectedProject && (
        <div className="border-b border-gray-200 p-6 bg-white">
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedProject.progress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{projectMetrics.tasksCompleted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">In Progress</p>
                  <p className="text-2xl font-bold text-purple-900">{projectMetrics.tasksInProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">Blockers</p>
                  <p className="text-2xl font-bold text-orange-900">{projectMetrics.blockers}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-700">Team Size</p>
                  <p className="text-2xl font-bold text-teal-900">{selectedProject.teamSize}</p>
                </div>
                <Users className="w-8 h-8 text-teal-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700">Efficiency</p>
                  <p className="text-2xl font-bold text-indigo-900">{projectMetrics.teamEfficiency}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {/* To Do Column */}
          <div className="w-80 flex flex-col">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">To Do</h3>
                </div>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {tasksByStatus.todo.length}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasksByStatus.todo.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={(status) => updateTask(task.id, { status })}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="w-80 flex flex-col">
            <div className="bg-blue-100 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">In Progress</h3>
                </div>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full text-sm">
                  {tasksByStatus['in-progress'].length}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasksByStatus['in-progress'].map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={(status) => updateTask(task.id, { status })}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>

          {/* Review Column */}
          <div className="w-80 flex flex-col">
            <div className="bg-purple-100 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Review</h3>
                </div>
                <span className="px-2 py-0.5 bg-purple-200 text-purple-700 rounded-full text-sm">
                  {tasksByStatus.review.length}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasksByStatus.review.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={(status) => updateTask(task.id, { status })}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="w-80 flex flex-col">
            <div className="bg-green-100 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-green-900">Done</h3>
                </div>
                <span className="px-2 py-0.5 bg-green-200 text-green-700 rounded-full text-sm">
                  {tasksByStatus.done.length}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasksByStatus.done.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={(status) => updateTask(task.id, { status })}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>

          {/* Blocked Column */}
          {tasksByStatus.blocked.length > 0 && (
            <div className="w-80 flex flex-col">
              <div className="bg-red-100 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="font-semibold text-red-900">Blocked</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-red-200 text-red-700 rounded-full text-sm">
                    {tasksByStatus.blocked.length}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {tasksByStatus.blocked.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={(status) => updateTask(task.id, { status })}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe the task..."
                />
                {newTaskData.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    AI Estimate: {estimateTaskEffort(newTaskData.description)} hours
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    value={newTaskData.assignee}
                    onChange={(e) => setNewTaskData({ ...newTaskData, assignee: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: Task;
  onUpdateStatus: (status: Task['status']) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}> = ({ task, onUpdateStatus, getStatusColor, getPriorityColor }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{task.assignee || 'Unassigned'}</span>
        </div>
        {task.estimatedHours && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}
      </div>
      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
      <div className="mt-3 flex gap-1">
        {task.tags.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
      <select
        value={task.status}
        onChange={(e) => onUpdateStatus(e.target.value as Task['status'])}
        className={`mt-3 w-full px-2 py-1 border rounded text-xs ${getStatusColor(task.status)}`}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
        <option value="blocked">Blocked</option>
      </select>
    </div>
  );
};

export default ProjectGalaxy;
