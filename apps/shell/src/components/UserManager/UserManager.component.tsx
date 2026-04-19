import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Power, 
  LogOut, 
  Lock, 
  RotateCcw, 
  Image as ImageIcon,
  Type,
  Key,
  X,
  Construction
} from 'lucide-react';
import { useUserManager } from './UserManager.hook';

export function UserManager() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const {
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
  } = useUserManager();

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="relative w-full">
        <motion.button
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 backdrop-blur-md border 
            ${isOpen 
              ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
              : 'bg-muted/30 border-transparent hover:bg-muted/60'
            }
          `}
        >
          {userInfo?.avatar ? (
            <img 
              src={userInfo.avatar} 
              alt="User avatar" 
              className="w-8 h-8 rounded-full object-cover border border-muted/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {userInfo ? getInitials(userInfo.name) : <User className="w-4 h-4" />}
              </span>
            </div>
          )}
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
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base tracking-tight capitalize">
                      {userInfo?.name || '...'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                      @{userInfo?.username || '...'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-1 mb-6 bg-muted/30 rounded-xl border border-muted/20">
                <button
                  onClick={() => setActiveTab('power')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    activeTab === 'power' 
                      ? 'bg-background shadow-sm text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {t('user.power')}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 relative ${
                    activeTab === 'profile' 
                      ? 'bg-background shadow-sm text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t('user.profile')}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                </button>
              </div>

              <div className="min-h-[220px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'power' ? (
                    <motion.div
                      key="power"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-2"
                    >
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all group">
                        <div className="p-2 bg-background rounded-xl group-hover:scale-110 transition-transform">
                          <LogOut className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="text-sm font-bold">{t('user.logout')}</span>
                      </button>
                      
                      <button onClick={handleLock} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all group">
                        <div className="p-2 bg-background rounded-xl group-hover:scale-110 transition-transform">
                          <Lock className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-sm font-bold">{t('user.lock')}</span>
                      </button>
                      
                      <button onClick={handleRestart} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all group">
                        <div className="p-2 bg-background rounded-xl group-hover:scale-110 transition-transform">
                          <RotateCcw className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-bold">{t('user.restart')}</span>
                      </button>

                      <button onClick={handleShutdown} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 transition-all group">
                        <div className="p-2 bg-rose-500/20 rounded-xl group-hover:scale-110 transition-transform">
                          <Power className="w-4 h-4 text-rose-500" />
                        </div>
                        <span className="text-sm font-bold text-rose-500">{t('user.shutdown')}</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <Construction className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-amber-500/90 leading-tight">
                          {t('user.in_development')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button onClick={() => handleChangeAvatar('dummy')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-bold">{t('user.change_image')}</span>
                          </div>
                        </button>

                        <button onClick={() => handleChangeName('Novo Nome')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all">
                          <div className="flex items-center gap-3">
                            <Type className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-bold">{t('user.change_name')}</span>
                          </div>
                        </button>

                        <button onClick={() => handleChangePassword('old', 'new')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent bg-muted/20 hover:bg-muted/50 transition-all">
                          <div className="flex items-center gap-3">
                            <Key className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-bold">{t('user.change_password')}</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
