import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  BatteryMedium, 
  BatteryFull, 
  Zap, 
  X, 
  Check, 
  Settings, 
  Cpu
} from 'lucide-react';
import { useBatteryManager } from './BatteryManager.hook';

export function BatteryManager() {
  const { t } = useTranslation();
  const { 
    status, 
    profiles, 
    showPercentage, 
    toggleShowPercentage, 
    changeProfile 
  } = useBatteryManager();

  const [isOpen, setIsOpen] = useState(false);

  const getBatteryIcon = () => {
    if (!status) return <Battery className="w-5 h-5 text-muted-foreground" />;
    
    const isCharging = status.status === 'Charging';
    const pct = status.percentage;

    if (isCharging) {
      return <BatteryCharging className="w-5 h-5 text-amber-500 animate-pulse" />;
    }

    // Discharging or Full
    if (pct <= 15) return <Battery className="w-5 h-5 text-rose-500 animate-bounce" />; // Critical
    if (pct <= 30) return <BatteryLow className="w-5 h-5 text-rose-400" />; // Low
    if (pct <= 60) return <BatteryMedium className="w-5 h-5 text-amber-400" />; // Medium
    if (pct <= 85) return <BatteryMedium className="w-5 h-5 text-emerald-400" />; // High
    return <BatteryFull className="w-5 h-5 text-emerald-500" />; // Full
  };

  const getStatusLabel = (statusStr: string) => {
    switch (statusStr) {
      case 'Charging': return t('battery.charging');
      case 'Discharging': return t('battery.discharging');
      case 'Full': return t('battery.full');
      default: return statusStr;
    }
  };

  return (
    <>
      <div className="relative">
        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3 py-2 rounded-full flex items-center gap-2 transition-all duration-300 backdrop-blur-md border 
            ${isOpen 
              ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
              : 'bg-muted/30 border-transparent hover:bg-muted/60'
            }
          `}
        >
          {getBatteryIcon()}
          <AnimatePresence>
            {showPercentage && status && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className={`text-xs font-bold tracking-tight ${isOpen ? 'text-primary' : 'text-foreground'}`}
              >
                {status.percentage}%
              </motion.span>
            )}
          </AnimatePresence>
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md flex flex-col rounded-3xl bg-background/95 backdrop-blur-3xl border border-muted/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 pointer-events-auto overflow-hidden"
            >
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base tracking-tight">
                    {t('battery.title')}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    {status ? getStatusLabel(status.status) : '...'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Big Battery Percentage Display */}
            {status && (
              <div className="flex flex-col items-center justify-center py-6 mb-8 bg-muted/20 rounded-2xl border border-muted/30">
                <span className={`text-5xl font-black tracking-tighter mb-1 
                  ${status.status === 'Charging' 
                    ? 'text-amber-500' 
                    : status.percentage <= 25 
                      ? 'text-rose-500' 
                      : 'text-foreground'
                  }`}
                >
                  {status.percentage}%
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full 
                    ${status.status === 'Charging' 
                      ? 'bg-amber-500 animate-pulse' 
                      : status.percentage <= 25 
                        ? 'bg-rose-500' 
                        : 'bg-emerald-500'
                    }`} 
                  />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {getStatusLabel(status.status)}
                  </span>
                </div>
              </div>
            )}

            {/* Power Plans Section */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 px-1">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {t('battery.power_plans')}
                </span>
              </div>
              
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <motion.button
                    key={profile.name}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => changeProfile(profile.name)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200
                      ${profile.active 
                        ? 'bg-primary/10 border-primary/40 shadow-sm' 
                        : 'hover:bg-muted/50 border-transparent bg-muted/20'
                      }
                    `}
                  >
                    <span className={`text-sm font-bold capitalize ${profile.active ? 'text-primary' : 'text-foreground'}`}>
                      {profile.name}
                    </span>
                    {profile.active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Config Section */}
            <div className="pt-6 border-t border-muted/50">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">
                    {t('battery.show_percentage')}
                  </span>
                </div>
                <button 
                  onClick={toggleShowPercentage}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${showPercentage ? 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-muted'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${showPercentage ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
