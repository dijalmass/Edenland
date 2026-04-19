import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDateTime } from './DateTimeManager.hook';

export function DateTimeManager() {
  const { t, i18n } = useTranslation();
  const { now, settings, toggleSetting } = useDateTime();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'settings'>('calendar');

  const locale = i18n.language.replace('_', '-');

  const formatTime = () => {
    const parts = [];
    if (settings.showHours) parts.push(now.getHours().toString().padStart(2, '0'));
    if (settings.showMinutes) parts.push(now.getMinutes().toString().padStart(2, '0'));
    if (settings.showSeconds) parts.push(now.getSeconds().toString().padStart(2, '0'));
    return parts.join(':');
  };

  const formatDate = () => {
    if (settings.normalizedDate) {
      return now.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return now.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayName = () => {
    return now.toLocaleDateString(locale, { weekday: 'long' });
  };

  // Simple Calendar Generator for the current month
  const renderCalendar = () => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today;
      days.push(
        <div 
          key={i} 
          className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
            ${isToday ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/50'}
          `}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold capitalize">
            {now.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
          </span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-muted rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 hover:bg-muted rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} className="text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <motion.button
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-2xl flex items-center justify-end gap-3 transition-all duration-300 pointer-events-auto
            ${isOpen ? 'bg-primary/10' : 'bg-transparent'}
          `}
        >
          <div className="flex items-center gap-3 whitespace-nowrap">
            {settings.showDayName && (
              <span className="text-xs font-bold capitalize tracking-widest text-muted-foreground/80">
                {getDayName()}
              </span>
            )}
            <span className="text-md font-black tracking-tighter leading-none">
              {formatTime()}
            </span>
            {settings.showDate && (
              <span className="text-xs font-bold text-muted-foreground/80 tabular-nums">
                {formatDate()}
              </span>
            )}
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/40 backdrop-blur-md pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm flex flex-col rounded-3xl bg-background/95 backdrop-blur-3xl border border-muted/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto overflow-hidden"
            >
              {/* Tabs Header */}
              <div className="flex border-b border-muted/30">
                <button 
                  onClick={() => setActiveTab('calendar')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold transition-colors ${activeTab === 'calendar' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/30'}`}
                >
                  <Calendar className="w-4 h-4" />
                  {t('datetime.calendar')}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold transition-colors ${activeTab === 'settings' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/30'}`}
                >
                  <Settings className="w-4 h-4" />
                  {t('datetime.settings')}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-4 hover:bg-rose-500/10 hover:text-rose-500 transition-colors border-l border-muted/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 min-h-[300px]">
                {activeTab === 'calendar' ? (
                  renderCalendar()
                ) : (
                  <div className="space-y-1">
                    {(Object.keys(settings) as Array<keyof typeof settings>).map((key) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="text-xs font-bold text-foreground capitalize">
                          {t(`datetime.${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`)}
                        </span>
                        <button 
                          onClick={() => toggleSetting(key)}
                          className={`w-10 h-5 rounded-full transition-all duration-300 relative ${settings[key] ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
