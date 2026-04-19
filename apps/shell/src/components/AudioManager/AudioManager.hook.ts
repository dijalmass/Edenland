import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { AudioStatus, AudioSink, AudioApp } from './AudioManager.types';
import { toast } from 'sonner';

export const useAudioManager = () => {
  const [status, setStatus] = useState<AudioStatus | null>(null);
  const [sinks, setSinks] = useState<AudioSink[]>([]);
  const [apps, setApps] = useState<AudioApp[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      const [newStatus, newSinks, newApps] = await Promise.all([
        invoke<AudioStatus>('get_audio_status'),
        invoke<AudioSink[]>('get_output_devices'),
        invoke<AudioApp[]>('get_app_volumes')
      ]);
      setStatus(newStatus);
      setSinks(newSinks);
      setApps(newApps);
    } catch (err) {
      console.error('Failed to fetch audio data:', err);
    }
  }, []);

  const updateVolume = async (volume: number) => {
    try {
      await invoke('set_master_volume', { volume });
      setStatus(prev => prev ? { ...prev, volume } : null);
    } catch (err) {
      toast.error('Erro ao ajustar volume');
    }
  };

  const toggleMute = async (mute: boolean) => {
    try {
      await invoke('set_master_mute', { mute });
      setStatus(prev => prev ? { ...prev, mute } : null);
    } catch (err) {
      toast.error('Erro ao alternar mudo');
    }
  };

  const changeSink = async (name: string) => {
    try {
      await invoke('set_default_sink', { name });
      toast.success('Dispositivo de saída alterado');
      await fetchAll();
    } catch (err) {
      toast.error('Erro ao alterar dispositivo');
    }
  };

  const updateAppVolume = async (index: number, volume: number) => {
    try {
      await invoke('set_app_volume', { index, volume });
      setApps(prev => prev.map(app => app.index === index ? { ...app, volume } : app));
    } catch (err) {
      toast.error('Erro ao ajustar volume da aplicação');
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000); // 5s poll
    return () => clearInterval(interval);
  }, [fetchAll]);

  return {
    status,
    sinks,
    apps,
    updateVolume,
    toggleMute,
    changeSink,
    updateAppVolume,
    refresh: fetchAll
  };
};
