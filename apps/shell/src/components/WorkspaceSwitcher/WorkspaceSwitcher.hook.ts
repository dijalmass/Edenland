import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Workspace, Client } from './WorkspaceSwitcher.types';

export const useWorkspaceSwitcher = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const [allWorkspaces, active] = await Promise.all([
        invoke<Workspace[]>('get_workspaces'),
        invoke<Workspace>('get_active_workspace')
      ]);
      
      // Sort by ID
      setWorkspaces(allWorkspaces.sort((a, b) => a.id - b.id));
      setActiveWorkspaceId(active.id);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchWorkspace = async (id: number) => {
    try {
      await invoke('switch_workspace', { id });
      setActiveWorkspaceId(id);
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  };

  const getWorkspaceClients = async (id: number): Promise<Client[]> => {
    try {
      return await invoke<Client[]>('get_workspace_clients', { workspaceId: id });
    } catch (error) {
      console.error(`Failed to fetch clients for workspace ${id}:`, error);
      return [];
    }
  };

  const focusWindow = async (address: string) => {
    try {
      await invoke('focus_window', { address });
    } catch (error) {
      console.error(`Failed to focus window ${address}:`, error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    
    // Refresh periodically or on focus (could use an event listener if Hyprland emitted events via Tauri)
    const interval = setInterval(fetchWorkspaces, 1000);
    return () => clearInterval(interval);
  }, [fetchWorkspaces]);

  return {
    workspaces,
    activeWorkspaceId,
    loading,
    switchWorkspace,
    getWorkspaceClients,
    focusWindow,
    refresh: fetchWorkspaces
  };
};
