import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Lock, ChevronRight, Loader2, Eye, EyeOff, X, Check } from 'lucide-react';
import { useNetworkManager } from './NetworkManager.hook';
import type { Network } from './NetworkManager.types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z.object({
  password: z.string().min(8, 'Password is required'),
});

type PasswordForm = z.infer<typeof passwordSchema>;

export function NetworkManager() {
  const { t } = useTranslation();
  const { 
    isOpen, wifiEnabled, networks, isLoading, error, 
    toggleOpen, toggleWifi, connectToNetwork, disconnectFromNetwork, scanNetworks 
  } = useNetworkManager();
  
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onConnect = async (data: PasswordForm) => {
    if (selectedNetwork) {
      await connectToNetwork(selectedNetwork.ssid, data.password);
      setSelectedNetwork(null);
      reset();
    }
  };

  const handleNetworkClick = (net: Network) => {
    if (net.connected) return;
    
    if (net.secured) {
      if (selectedNetwork?.ssid === net.ssid) {
        setSelectedNetwork(null);
        reset();
      } else {
        setSelectedNetwork(net);
        reset();
      }
    } else {
      connectToNetwork(net.ssid);
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <div className="relative w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className={`w-full p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md border 
            ${isOpen 
              ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
              : 'bg-muted/30 border-transparent hover:bg-muted/60'
            }
          `}
        >
          {wifiEnabled ? (
            <Wifi className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-foreground'}`} />
          ) : (
            <WifiOff className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/40 backdrop-blur-md pointer-events-auto"
              onClick={toggleOpen}
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-background/95 backdrop-blur-3xl border border-muted/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 pointer-events-auto overflow-hidden"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Wifi className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base tracking-tight">
                      {t('network.wifi')}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                      {wifiEnabled ? t('network.manage_connections') : t('network.off')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleWifi}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${wifiEnabled ? 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-muted'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${wifiEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                  <button onClick={toggleOpen} className="p-2 hover:bg-muted rounded-xl transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 bg-destructive/10 text-destructive text-xs rounded-xl border border-destructive/20 flex items-start gap-3">
                  <span className="text-sm">⚠️</span>
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Network List */}
              <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1 -mx-2 px-2">
                {wifiEnabled ? (
                  networks.length > 0 ? (
                    networks.map((net, i) => (
                      <motion.div 
                        key={net.ssid} 
                        layout 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col gap-1"
                      >
                        <motion.button
                          layout
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNetworkClick(net)}
                          className={`group w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 border
                            ${net.connected 
                              ? 'bg-primary/10 border-primary/30 shadow-sm' 
                              : selectedNetwork?.ssid === net.ssid
                                ? 'bg-muted/80 border-primary/40'
                                : 'hover:bg-muted/40 border-transparent'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-all duration-500 ${net.connected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-muted/50 text-muted-foreground group-hover:text-foreground'}`}>
                              <Wifi className={`w-4 h-4 ${net.strength < 30 ? 'opacity-50' : net.strength < 60 ? 'opacity-80' : 'opacity-100'}`} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className={`text-sm font-semibold tracking-tight ${net.connected ? 'text-primary' : 'text-foreground'}`}>
                                {net.ssid}
                              </span>
                              <div className="flex gap-2 mt-0.5">
                                {net.connected && (
                                  <motion.span 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-[9px] text-primary uppercase font-black tracking-wider px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-1"
                                  >
                                    <Check size={8} /> {t('network.connected')}
                                  </motion.span>
                                )}
                                <span className={`text-[8px] font-bold uppercase tracking-tighter ${net.strength > 70 ? 'text-emerald-500' : net.strength > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                                  {net.strength}% sinal
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {net.secured && <Lock className={`w-3.5 h-3.5 ${net.connected ? 'text-primary' : 'text-muted-foreground opacity-40'}`} />}
                            {net.connected ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  disconnectFromNetwork();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest transition-colors border border-destructive/20"
                              >
                                {t('network.disconnect')}
                              </motion.button>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-muted/0 group-hover:bg-muted/50 transition-colors">
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-all duration-300 ${selectedNetwork?.ssid === net.ssid ? 'rotate-90 text-primary' : ''}`} />
                              </div>
                            )}
                          </div>
                        </motion.button>

                        <AnimatePresence>
                          {selectedNetwork?.ssid === net.ssid && !net.connected && (
                            <motion.form 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              onSubmit={handleSubmit(onConnect)} 
                              className="flex flex-col gap-3 p-4 bg-muted/30 rounded-2xl mt-2 mb-3 border border-muted/50 overflow-hidden"
                            >
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                                {t('network.password_required')}
                              </p>
                              <div className="relative">
                                <input
                                  {...register('password')}
                                  type={showPassword ? "text" : "password"}
                                  placeholder={t('network.password_placeholder')}
                                  className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all pr-12
                                    ${errors.password ? 'border-destructive shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-muted focus:border-primary focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]'}
                                  `}
                                  autoFocus
                                />
                                <button 
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                                >
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                              
                              {errors.password && (
                                <span className="text-[10px] text-destructive px-1 font-medium">{errors.password.message}</span>
                              )}

                              <div className="flex gap-2">
                                <button 
                                  type="button"
                                  onClick={() => { setSelectedNetwork(null); reset(); }}
                                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted transition-all"
                                >
                                  {t('network.cancel')}
                                </button>
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="submit"
                                  disabled={isLoading}
                                  className="flex-[2] bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                                >
                                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('network.connect')}
                                </motion.button>
                              </div>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    !isLoading && (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin opacity-20" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {t('network.searching')}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                      <WifiOff className="w-10 h-10 text-muted-foreground opacity-20" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground font-bold">
                        {t('network.disabled')}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                        {t('network.enable_wifi_description')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer Actions */}
              {wifiEnabled && (
                <div className="mt-6 pt-5 border-t border-muted/50 flex justify-between items-center">
                  <button 
                    onClick={() => scanNetworks()}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-all disabled:opacity-50 font-bold uppercase tracking-widest group"
                  >
                    <Loader2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    {t('network.refresh')}
                  </button>
                  <button className="flex items-center gap-2 text-[11px] text-primary hover:text-primary/80 font-black uppercase tracking-widest transition-all">
                    <X className="w-3 h-3" />
                    {t('network.settings')}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
