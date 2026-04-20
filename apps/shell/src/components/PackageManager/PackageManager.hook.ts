import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useTranslation } from 'react-i18next';
import type { Package, PackageDetails } from './PackageManager.types';
import { toast } from 'sonner';

export const usePackageManager = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Package[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalState, setTerminalState] = useState<'closed' | 'minimized' | 'expanded'>('closed');
  const [activeTab, setActiveTab] = useState<'explore' | 'installed' | 'updates'>('explore');
  const [installedPackages, setInstalledPackages] = useState<Package[]>([]);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await invoke<Package[]>('search_packages', { query: q });
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('package_manager.error_searching', { defaultValue: 'Erro ao buscar pacotes' }));
    } finally {
      setIsSearching(false);
    }
  }, [t]);

  useEffect(() => {
    if (activeTab === 'explore') {
      const timer = setTimeout(() => {
        search(query);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [query, search, activeTab]);

  const fetchInstalled = useCallback(async () => {
    try {
      const data = await invoke<Package[]>('get_installed_packages');
      setInstalledPackages(data);
    } catch (err) {
      toast.error(t('package_manager.error_installed', { defaultValue: 'Erro ao buscar instalados' }) + ': ' + err);
    }
  }, [t]);

  useEffect(() => {
    if (activeTab === 'installed') {
      fetchInstalled();
    }
  }, [activeTab, fetchInstalled]);

  const getDetails = async (name: string) => {
    setIsLoadingDetails(true);
    try {
      const data = await invoke<PackageDetails>('get_package_info', { name });
      setSelectedPackage(data);
    } catch (error) {
      console.error('Details error:', error);
      toast.error(t('package_manager.error_details', { defaultValue: 'Erro ao obter detalhes do pacote' }));
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const executeAction = async (action: 'install' | 'remove', name: string, password: string) => {
    setLogs([]);
    setIsExecuting(true);
    setSelectedPackage(null); // Fecha o preview ao iniciar
    setTerminalState('expanded'); // Abre o console ao iniciar
    
    const promise = invoke('execute_package_action', { action, name, password });

    toast.promise(promise, {
      loading: `${action === 'install' ? 'Instalando' : 'Removendo'} ${name}...`,
      success: () => {
        // Atualiza a lista local de busca
        setResults(prev => prev.map(p => p.name === name ? { ...p, is_installed: action === 'install' } : p));
        
        // Atualiza a lista de instalados
        fetchInstalled();

        if (selectedPackage?.name === name) {
          setSelectedPackage(prev => prev ? { ...prev, is_installed: action === 'install' } : null);
        }
        return t(`package_manager.${action === 'install' ? 'installed_success' : 'removed_success'}`, { name });
      },
      error: (err) => `${t('package_manager.error', { defaultValue: 'Erro' })}: ${err}`
    });

    try {
      await promise;
    } finally {
      setIsExecuting(false);
    }
  };

  const cancelAction = async () => {
    try {
      await invoke('cancel_package_action');
      toast.info('Interrompendo instalação...');
    } catch (err) {
      toast.error('Erro ao cancelar: ' + err);
    }
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    selectedPackage,
    setSelectedPackage,
    isLoadingDetails,
    getDetails,
    executeAction,
    isOpen,
    toggleOpen,
    logs,
    clearLogs: () => setLogs([]),
    isExecuting,
    cancelAction,
    terminalState,
    setTerminalState,
    activeTab,
    setActiveTab,
    installedPackages,
    refreshInstalled: fetchInstalled
  };
};

// Listener global para os logs (pode ser movido para dentro do hook se preferir)
// Mas aqui garantimos que escutamos sempre que o componente está montado
export const usePackageLogs = (onLog: (log: string) => void) => {
  useEffect(() => {
    const unlisten = listen<string>('package-manager-log', (event) => {
      onLog(event.payload);
    });
    return () => {
      unlisten.then(f => f());
    };
  }, [onLog]);
};
