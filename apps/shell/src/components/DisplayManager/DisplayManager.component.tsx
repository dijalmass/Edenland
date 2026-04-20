import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor as MonitorIcon, 
  Sun, 
  Palette, 
  X, 
  Layout,
  RefreshCw,
  MonitorCheck
} from 'lucide-react';
import { useDisplay } from './DisplayManager.hook';
import { MonitorCanvas } from './MonitorCanvas';
import { ThemeSettings } from './ThemeSettings';
import { MonitorSettings } from './MonitorSettings';
import type { Monitor } from './DisplayManager.types';

export function DisplayManager({ variant = 'dock' }: { variant?: 'dock' | 'header' }) {
  const { t } = useTranslation();
  const { 
    brightness, 
    monitors, 
    workspaces,
    isLoading, 
    updateBrightness, 
    applyMonitorConfig,
    setWorkspaceToMonitor,
    refresh
  } = useDisplay();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'brightness' | 'monitors' | 'colors'>('brightness');
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);

  useEffect(() => {
    if (monitors.length > 0 && !selectedMonitor) {
      setSelectedMonitor(monitors.find(m => m.focused) || monitors[0]);
    }
  }, [monitors]);

  return (
    <>
      <div className={variant === 'header' ? 'relative' : 'relative w-full'}>
        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-center transition-all duration-300 pointer-events-auto
            ${variant === 'header' 
              ? 'p-2 rounded-lg hover:bg-white/10' 
              : `w-full p-3 rounded-2xl backdrop-blur-md border transition-all duration-300
                 ${isOpen ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(var(--color-primary),0.15)]' : 'bg-black/20 border-white/5 hover:bg-white/10'}`
            }
          `}
        >
          <MonitorIcon className={`${variant === 'header' ? 'w-4 h-4' : 'w-5 h-5'} ${isOpen ? 'text-primary' : 'text-eden-light'}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-eden-dark/40 backdrop-blur-md pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl flex flex-col rounded-3xl bg-eden-slate/95 backdrop-blur-3xl border border-eden-mist/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Layout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-eden-light text-base tracking-tight">
                      {t('display.title')}
                    </h3>
                    <p className="text-[10px] text-eden-mist uppercase tracking-widest font-medium">
                      {t('display.system_settings_subtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refresh}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <RefreshCw size={18} className={`text-eden-mist ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-eden-mist" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-eden-dark/30 rounded-2xl mb-6">
                <button
                  onClick={() => setActiveTab('brightness')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'brightness' ? 'bg-primary text-eden-dark shadow-lg' : 'text-eden-mist hover:text-eden-light'
                  }`}
                >
                  <Sun size={14} />
                  {t('display.brightness')}
                </button>
                <button
                  onClick={() => setActiveTab('monitors')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'monitors' ? 'bg-primary text-eden-dark shadow-lg' : 'text-eden-mist hover:text-eden-light'
                  }`}
                >
                  <MonitorIcon size={14} />
                  {t('display.monitors')}
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'colors' ? 'bg-primary text-eden-dark shadow-lg' : 'text-eden-mist hover:text-eden-light'
                  }`}
                >
                  <Palette size={14} />
                  {t('display.colors')}
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px] max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw size={32} className="text-primary animate-spin mb-4" />
                    <p className="text-[10px] text-eden-mist uppercase tracking-widest font-bold">{t('display.loading_devices')}</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'brightness' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 py-4"
                      >
                        <div className="flex flex-col items-center justify-center py-12 bg-eden-dark/20 rounded-3xl border border-eden-slate">
                          <Sun size={64} className="text-primary mb-4" />
                          <span className="text-5xl font-black tracking-tighter text-eden-light">
                            {brightness}%
                          </span>
                        </div>
                        <div className="space-y-4 px-2">
                          <div className="flex justify-between text-[10px] text-eden-mist uppercase font-black tracking-widest">
                            <span>{t('display.min')}</span>
                            <span>{t('display.brightness_control')}</span>
                            <span>{t('display.max')}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={brightness}
                            onChange={(e) => updateBrightness(parseInt(e.target.value))}
                            className="w-full h-2 bg-eden-dark rounded-full appearance-none cursor-pointer accent-primary border border-eden-slate"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'monitors' && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                      >
                        {/* Beta Warning */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 flex gap-4 items-start">
                          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                            <RefreshCw size={16} />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-amber-500">
                              {t('display.warning_title')}
                            </h5>
                            <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                              {t('display.warning_description')}
                            </p>
                          </div>
                        </div>

                        {monitors.length >= 2 ? (
                          <MonitorCanvas 
                            monitors={monitors} 
                            onApply={applyMonitorConfig} 
                            onSelect={setSelectedMonitor}
                            selectedMonitor={selectedMonitor}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 bg-eden-dark/20 rounded-3xl border border-eden-slate text-center px-8">
                            <MonitorCheck size={48} className="text-primary mb-4" />
                            <h4 className="text-sm font-bold text-eden-light mb-1">
                              {monitors.length === 1 ? t('display.single_monitor') : t('display.no_monitors')}
                            </h4>
                            <p className="text-[10px] text-eden-mist uppercase tracking-widest">
                              {monitors.length === 1 
                                ? t('display.single_monitor_description')
                                : t('display.no_monitors_description')
                              }
                            </p>
                          </div>
                        )}

                        {selectedMonitor && (
                          <div className="pt-6 border-t border-eden-slate">
                            <MonitorSettings 
                              monitor={selectedMonitor} 
                              workspaces={workspaces}
                              onApply={applyMonitorConfig}
                              onAssignWorkspace={setWorkspaceToMonitor}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'colors' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ThemeSettings />
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
