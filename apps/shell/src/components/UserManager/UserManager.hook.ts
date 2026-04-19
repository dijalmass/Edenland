import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { UserInfo, TabType } from './UserManager.types';

export function useUserManager() {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('power');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const data: UserInfo = await invoke('get_user_info');
      setUserInfo(data);
    } catch (err) {
      console.error('Failed to get user info:', err);
    }
  };

  const executePowerCommand = async (command: string, label: string) => {
    try {
      await invoke(command);
    } catch (err) {
      toast.error(`Falha ao executar ${label}: ${err}`);
    }
  };

  const handleLogout = () => executePowerCommand('system_logout', t('user.logout'));
  const handleLock = () => executePowerCommand('system_lock', t('user.lock'));
  const handleRestart = () => executePowerCommand('system_reboot', t('user.restart'));
  const handleShutdown = () => executePowerCommand('system_poweroff', t('user.shutdown'));

  // Mock functions for profile changes
  const handleChangeName = async (newName: string) => {
    try {
      await invoke('update_user_name', { newName });
      toast.success(t('user.change_name') + ' - ' + t('user.in_development'));
      fetchUserInfo();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await invoke('update_user_password', { oldPassword, newPassword });
      toast.success(t('user.change_password') + ' - ' + t('user.in_development'));
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleChangeAvatar = async (imagePath: string) => {
    try {
      await invoke('update_user_avatar', { imagePath });
      toast.success(t('user.change_image') + ' - ' + t('user.in_development'));
      fetchUserInfo();
    } catch (err) {
      toast.error(String(err));
    }
  };

  return {
    userInfo,
    activeTab,
    setActiveTab,
    handleLogout,
    handleLock,
    handleRestart,
    handleShutdown,
    handleChangeName,
    handleChangePassword,
    handleChangeAvatar
  };
}
