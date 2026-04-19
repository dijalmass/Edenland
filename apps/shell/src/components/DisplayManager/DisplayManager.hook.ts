import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Monitor, Workspace } from './DisplayManager.types';

export const useDisplay = () => {
  const [brightness, setBrightness] = useState(100);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDisplayData = useCallback(async () => {
    try {
      const [b, m, w] = await Promise.all([
        invoke<number>('get_brightness'),
        invoke<Monitor[]>('get_monitors'),
        invoke<Workspace[]>('get_workspaces')
      ]);
      setBrightness(b);
      setMonitors(m);
      setWorkspaces(w);
    } catch (error) {
      console.error('Failed to fetch display data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisplayData();
  }, [fetchDisplayData]);

  const updateBrightness = async (value: number) => {
    try {
      await invoke('set_brightness', { percentage: value });
      setBrightness(value);
    } catch (error) {
      console.error('Failed to set brightness:', error);
    }
  };

  const applyMonitorConfig = async (name: string, res: string, pos: string, scale: string) => {
    try {
      await invoke('apply_monitor_config', { name, res, pos, scale });
      await fetchDisplayData();
    } catch (error) {
      console.error('Failed to apply monitor config:', error);
    }
  };

  const setWorkspaceToMonitor = async (workspaceId: number, monitorName: string) => {
    try {
      await invoke('set_workspace_monitor', { workspaceId, monitorName });
      await fetchDisplayData();
    } catch (error) {
      console.error('Failed to set workspace monitor:', error);
    }
  };

  return {
    brightness,
    monitors,
    workspaces,
    isLoading,
    updateBrightness,
    applyMonitorConfig,
    setWorkspaceToMonitor,
    refresh: fetchDisplayData
  };
};
