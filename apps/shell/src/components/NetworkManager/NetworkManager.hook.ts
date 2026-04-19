import { useState, useEffect, useCallback } from 'react';
import * as tauri from '@tauri-apps/api/core';
import type { Network } from './NetworkManager.types';
import { toast } from 'sonner';

export function useNetworkManager() {
  const invoke = tauri?.invoke;
  const [isOpen, setIsOpen] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWifiStatus = useCallback(async () => {
    if (!invoke) return;
    try {
      const status = await invoke<boolean>('get_wifi_status');
      setWifiEnabled(status);
    } catch (err) {
      console.error('Failed to get Wi-Fi status:', err);
    }
  }, [invoke]);

  const scanNetworks = useCallback(async () => {
    if (!invoke || !wifiEnabled || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await invoke<Network[]>('scan_wifi_networks');
      setNetworks(result);
    } catch (err: unknown) {
      console.error('Failed to scan networks:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [invoke, wifiEnabled, isLoading]);

  useEffect(() => {
    fetchWifiStatus();
  }, [fetchWifiStatus]);

  useEffect(() => {
    if (isOpen && wifiEnabled) {
      scanNetworks();
      
      // Auto refresh every 10 seconds
      const interval = setInterval(() => {
        scanNetworks();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, wifiEnabled, scanNetworks]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const toggleWifi = async () => {
    if (!invoke) return;
    try {
      const newStatus = !wifiEnabled;
      setWifiEnabled(newStatus); // Optimistic UI update
      await invoke('toggle_wifi', { enable: newStatus });
      if (newStatus && isOpen) {
        scanNetworks();
      }
    } catch (err) {
      console.error('Failed to toggle Wi-Fi:', err);
      setWifiEnabled(wifiEnabled); // Revert optimistic update
    }
  };

  const connectToNetwork = async (ssid: string, password?: string) => {
    if (!invoke) return;
    try {
      setIsLoading(true);
      setError(null);
      await invoke('connect_to_wifi', { ssid, password });
      toast.success(`Conectado a ${ssid}`);
      await scanNetworks();
    } catch (err: unknown) {
      console.error('Failed to connect:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      toast.error(`Erro ao conectar: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromNetwork = async () => {
    if (!invoke) return;
    try {
      setIsLoading(true);
      setError(null);
      await invoke('disconnect_from_wifi');
      toast.success('Desconectado com sucesso');
      await scanNetworks();
    } catch (err: unknown) {
      console.error('Failed to disconnect:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      toast.error(`Erro ao desconectar: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    wifiEnabled,
    networks,
    isLoading,
    error,
    toggleOpen,
    toggleWifi,
    connectToNetwork,
    disconnectFromNetwork,
    scanNetworks,
  };
}
