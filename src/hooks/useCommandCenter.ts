import { useState, useCallback } from 'react';
import type {
  UserPreferences,
  NotificationSettings,
  EditorSettings,
  SecuritySettings,
  Integration,
  APIKey,
  SystemConfig
} from '../types';

export const useCommandCenter = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      slack: false,
      digest: 'daily',
      types: {
        deployments: true,
        security: true,
        testing: true,
        projectUpdates: true
      }
    },
    editor: {
      fontSize: 14,
      tabSize: 2,
      lineNumbers: true,
      wordWrap: true,
      theme: 'vs-dark',
      autoSave: true,
      formatOnSave: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      ipWhitelist: [],
      apiKeyRotation: 90,
      auditLog: true
    }
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      type: 'git',
      status: 'connected',
      icon: ({ className }: { className?: string }) => null,
      config: { repo: 'myorg/myrepo', branch: 'main' },
      lastSync: '2 min ago'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      type: 'cloud',
      status: 'connected',
      icon: ({ className }: { className?: string }) => null,
      config: { projectId: 'prj_abc123' },
      lastSync: '5 min ago'
    },
    {
      id: 'aws',
      name: 'AWS',
      type: 'cloud',
      status: 'disconnected',
      icon: ({ className }: { className?: string }) => null,
      config: {},
      lastSync: undefined
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'communication',
      status: 'connected',
      icon: ({ className }: { className?: string }) => null,
      config: { workspace: 'myteam', channel: '#deployments' },
      lastSync: '1 min ago'
    },
    {
      id: 'datadog',
      name: 'Datadog',
      type: 'monitoring',
      status: 'error',
      icon: ({ className }: { className?: string }) => null,
      config: { apiKey: '***' },
      lastSync: '2 hours ago'
    }
  ]);

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key-1',
      name: 'Production API Key',
      key: 'sk_prod_*********************abc123',
      createdAt: '2024-01-15T10:00:00Z',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write', 'deploy'],
      status: 'active'
    },
    {
      id: 'key-2',
      name: 'Development API Key',
      key: 'sk_dev_*********************xyz789',
      createdAt: '2024-02-01T14:30:00Z',
      lastUsed: '5 min ago',
      permissions: ['read', 'write'],
      status: 'active'
    },
    {
      id: 'key-3',
      name: 'CI/CD Pipeline Key',
      key: 'sk_cicd_*********************def456',
      createdAt: '2023-12-20T08:00:00Z',
      lastUsed: '1 day ago',
      permissions: ['read', 'deploy'],
      status: 'active'
    },
    {
      id: 'key-4',
      name: 'Old Testing Key',
      key: 'sk_test_*********************old999',
      createdAt: '2023-11-10T16:00:00Z',
      lastUsed: 'never',
      permissions: ['read'],
      status: 'revoked'
    }
  ]);

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    maxProjects: 50,
    maxDeployments: 100,
    storageLimit: '500GB',
    apiRateLimit: 1000,
    teamSize: 25,
    retentionDays: 90
  });

  // Update user preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Update notification settings
  const updateNotificationSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setUserPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...updates
      }
    }));
  }, []);

  // Update editor settings
  const updateEditorSettings = useCallback((updates: Partial<EditorSettings>) => {
    setUserPreferences(prev => ({
      ...prev,
      editor: {
        ...prev.editor,
        ...updates
      }
    }));
  }, []);

  // Update security settings
  const updateSecuritySettings = useCallback((updates: Partial<SecuritySettings>) => {
    setUserPreferences(prev => ({
      ...prev,
      security: {
        ...prev.security,
        ...updates
      }
    }));
  }, []);

  // Connect integration
  const connectIntegration = useCallback((integrationId: string, config: Record<string, any>) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'connected', config, lastSync: 'just now' }
        : integration
    ));
  }, []);

  // Disconnect integration
  const disconnectIntegration = useCallback((integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: 'disconnected', config: {}, lastSync: undefined }
        : integration
    ));
  }, []);

  // Create API key
  const createAPIKey = useCallback((name: string, permissions: string[]): APIKey => {
    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name,
      key: `sk_${Math.random().toString(36).substring(2, 15)}*********************${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
      lastUsed: 'never',
      permissions,
      status: 'active'
    };

    setApiKeys(prev => [...prev, newKey]);
    return newKey;
  }, []);

  // Revoke API key
  const revokeAPIKey = useCallback((keyId: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ));
  }, []);

  // Delete API key
  const deleteAPIKey = useCallback((keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  }, []);

  // Update system configuration
  const updateSystemConfig = useCallback((updates: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Export settings
  const exportSettings = useCallback(() => {
    const settings = {
      userPreferences,
      integrations: integrations.map(i => ({
        id: i.id,
        name: i.name,
        status: i.status,
        config: i.config
      })),
      systemConfig,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userPreferences, integrations, systemConfig]);

  // Import settings
  const importSettings = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        if (settings.userPreferences) setUserPreferences(settings.userPreferences);
        if (settings.systemConfig) setSystemConfig(settings.systemConfig);
      } catch (error) {
        console.error('Failed to import settings:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  // Reset settings to defaults
  const resetToDefaults = useCallback(() => {
    setUserPreferences({
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        slack: false,
        digest: 'daily',
        types: {
          deployments: true,
          security: true,
          testing: true,
          projectUpdates: true
        }
      },
      editor: {
        fontSize: 14,
        tabSize: 2,
        lineNumbers: true,
        wordWrap: true,
        theme: 'vs-dark',
        autoSave: true,
        formatOnSave: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        ipWhitelist: [],
        apiKeyRotation: 90,
        auditLog: true
      }
    });
  }, []);

  return {
    userPreferences,
    integrations,
    apiKeys,
    systemConfig,
    updatePreferences,
    updateNotificationSettings,
    updateEditorSettings,
    updateSecuritySettings,
    connectIntegration,
    disconnectIntegration,
    createAPIKey,
    revokeAPIKey,
    deleteAPIKey,
    updateSystemConfig,
    exportSettings,
    importSettings,
    resetToDefaults
  };
};
