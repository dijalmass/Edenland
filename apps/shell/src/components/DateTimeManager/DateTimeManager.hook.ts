import { useState, useEffect } from 'react';
import type { DateTimeSettings } from './DateTimeManager.types';

const STORAGE_KEY = 'edenland-datetime-settings';

const DEFAULT_SETTINGS: DateTimeSettings = {
  showDayName: true,
  showDate: true,
  normalizedDate: false,
  showHours: true,
  showMinutes: true,
  showSeconds: false,
};

export function useDateTime() {
  const [now, setNow] = useState(new Date());
  const [settings, setSettings] = useState<DateTimeSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof DateTimeSettings>(key: K, value: DateTimeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: keyof DateTimeSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    now,
    settings,
    updateSetting,
    toggleSetting,
  };
}
