import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Volume1, 
  Volume, 
  VolumeX, 
  Speaker, 
  Music, 
  X, 
  Check
} from 'lucide-react';
import { useAudioManager } from './AudioManager.hook';

export function AudioManager({ variant = 'dock' }: { variant?: 'dock' | 'header' }) {
  const { t } = useTranslation();
  const { 
    status, 
    sinks, 
    apps, 
    updateVolume, 
    toggleMute, 
    changeSink, 
    updateAppVolume 
  } = useAudioManager();

  const [isOpen, setIsOpen] = useState(false);

  const getVolumeIcon = () => {
    if (!status || status.mute) return <VolumeX className="w-5 h-5 text-rose-500" />;
    if (status.volume === 0) return <VolumeX className="w-5 h-5 text-muted-foreground" />;
    if (status.volume < 33) return <Volume1 className="w-5 h-5 text-foreground" />;
    if (status.volume < 66) return <Volume className="w-5 h-5 text-foreground" />;
    return <Volume2 className="w-5 h-5 text-foreground" />;
  };

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
              ? 'p-2 rounded-lg hover:bg-white/10 gap-1.5' 
              : `w-full p-3 rounded-2xl flex-col backdrop-blur-md border transition-all duration-300
                 ${isOpen ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-black/20 border-white/5 hover:bg-white/10'}`
            }
          `}
        >
          {React.cloneElement(getVolumeIcon() as React.ReactElement, { 
            className: `${variant === 'header' ? 'w-4 h-4' : 'w-5 h-5'} ${getVolumeIcon().props.className.includes('rose-500') ? 'text-rose-500' : (isOpen ? 'text-primary' : 'text-foreground')}` 
          })}
          <AnimatePresence>
            {status && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`text-[10px] font-bold tracking-tighter leading-none ${isOpen ? 'text-primary' : 'text-foreground'}`}
              >
                {status.mute ? 'OFF' : `${status.volume}%`}
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
              className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-3xl bg-background/95 backdrop-blur-3xl border border-muted/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base tracking-tight">
                      {t('audio.title')}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                      {status?.mute ? t('audio.mute') : t('audio.master_volume')}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* Master Volume Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {t('audio.master_volume')}
                    </span>
                    <button 
                      onClick={() => toggleMute(!status?.mute)}
                      className={`p-1.5 rounded-lg transition-colors ${status?.mute ? 'bg-rose-500/20 text-rose-500' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                      {status?.mute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative group px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={status?.volume || 0}
                      onChange={(e) => updateVolume(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-muted-foreground">{status?.volume || 0}%</span>
                      <span className="text-[10px] font-bold text-muted-foreground">100%</span>
                    </div>
                  </div>
                </div>

                {/* Output Devices */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Speaker className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {t('audio.output_devices')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sinks.map((sink) => (
                      <motion.button
                        key={sink.name}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => changeSink(sink.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200
                          ${sink.is_default 
                            ? 'bg-primary/10 border-primary/40 shadow-sm' 
                            : 'hover:bg-muted/50 border-transparent bg-muted/20'
                          }
                        `}
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span className={`text-sm font-bold truncate max-w-[200px] ${sink.is_default ? 'text-primary' : 'text-foreground'}`}>
                            {sink.description}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                            {sink.name}
                          </span>
                        </div>
                        {sink.is_default && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Applications Volume */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {t('audio.applications')}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {apps.length === 0 ? (
                      <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-muted/50">
                        <p className="text-xs text-muted-foreground">{t('audio.no_apps')}</p>
                      </div>
                    ) : (
                      apps.map((app) => (
                        <div key={app.index} className="p-4 rounded-2xl bg-muted/20 border border-muted/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground truncate max-w-[150px]">
                              {app.name}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground">
                              {app.volume}%
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={app.volume}
                            onChange={(e) => updateAppVolume(app.index, parseInt(e.target.value, 10))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary/60"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
