import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { BatteryStatus, PowerProfile } from './BatteryManager.types';
import { toast } from 'sonner';

export const useBatteryManager = () => {
  const [status, setStatus] = useState<BatteryStatus | null>(null);
  const [profiles, setProfiles] = useState<PowerProfile[]>([]);
  const [showPercentage, setShowPercentage] = useState<boolean>(() => {
    const saved = localStorage.getItem('edenland_battery_show_percentage');
    return saved ? JSON.parse(saved) : true;
  });

  const fetchStatus = useCallback(async () => {
    try {
      console.log('Fetching battery status...');
      const data = await invoke<BatteryStatus>('get_battery_status');
      console.log('Battery Status Received:', data);
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch battery status:', err);
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      const data = await invoke<PowerProfile[]>('get_power_profiles');
      setProfiles(data);
    } catch (err) {
      console.error('Failed to fetch power profiles:', err);
    }
  }, []);

  const changeProfile = async (name: string) => {
    try {
      await invoke('set_power_profile', { profile: name });
      toast.success(`Plano de energia alterado para ${name}`);
      await fetchProfiles();
    } catch (err) {
      toast.error('Falha ao alterar plano de energia');
      console.error(err);
    }
  };

  const toggleShowPercentage = () => {
    const newValue = !showPercentage;
    setShowPercentage(newValue);
    localStorage.setItem('edenland_battery_show_percentage', JSON.stringify(newValue));
  };

  useEffect(() => {
    fetchStatus();
    fetchProfiles();
    
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchStatus, fetchProfiles]);

  return {
    status,
    profiles,
    showPercentage,
    toggleShowPercentage,
    changeProfile,
    refreshStatus: fetchStatus,
    refreshProfiles: fetchProfiles,
  };
};
