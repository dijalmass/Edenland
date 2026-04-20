import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Store, X, Inbox, Terminal, Maximize2, Minimize2, StopCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePackageManager, usePackageLogs } from './PackageManager.hook';
import { PackageItem } from './PackageItem.component';
import { PackageDetails } from './PackageDetails.component';
import './PackageManager.styles.css';

export const PackageManager: React.FC = () => {
  const {
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
    isExecuting,
    cancelAction,
    terminalState,
    setTerminalState,
    activeTab,
    setActiveTab,
    installedPackages
  } = usePackageManager();

  const { t } = useTranslation();

  const [localLogs, setLocalLogs] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  usePackageLogs((log) => {
    setLocalLogs(prev => [...prev, log]);
  });

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localLogs, terminalState]);

  React.useEffect(() => {
    if (!isOpen) {
      setLocalLogs([]);
      setTerminalState('closed');
    }
  }, [isOpen, setTerminalState]);

  const handlePackageClick = (name: string) => {
    getDetails(name);
  };

  return (
    <>
      <div className="relative w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className={`
            flex items-center justify-center transition-all duration-300 pointer-events-auto
            w-full p-3 rounded-2xl backdrop-blur-md border transition-all duration-300 
            ${isOpen ? 'bg-glory-gold/20 border-glory-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-black/20 border-white/5 hover:bg-white/10'}
          `}
          title="Edenland Store"
        >
          <Store className={`w-5 h-5 ${isOpen ? 'text-glory-gold' : 'text-eden-light'}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 overflow-hidden pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-full max-h-[85vh] bg-eden-dark/80 backdrop-blur-2xl border border-eden-mist/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <header className="p-8 pb-4 flex items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-glory-gold text-eden-dark rounded-2xl shadow-lg shadow-glory-gold/20">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-eden-light">{t('package_manager.title')}</h1>
                    <p className="text-sm text-eden-mist">{t('package_manager.subtitle')}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-md flex flex-col gap-3">
                  <div className="relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      isSearching ? 'text-glory-gold animate-pulse' : 'text-eden-mist group-focus-within:text-glory-gold'
                    }`} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={activeTab === 'explore' ? t('package_manager.search_placeholder') : t('package_manager.filter_placeholder')}
                      className="package-manager-input"
                      autoFocus
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-glory-gold animate-spin" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl w-fit">
                    <TabButton 
                      active={activeTab === 'explore'} 
                      onClick={() => setActiveTab('explore')}
                      label={t('package_manager.tab_explore')}
                    />
                    <TabButton 
                      active={activeTab === 'installed'} 
                      onClick={() => setActiveTab('installed')}
                      label={t('package_manager.tab_installed')}
                    />
                    <TabButton 
                      active={activeTab === 'updates'} 
                      onClick={() => setActiveTab('updates')}
                      label={t('package_manager.tab_updates')}
                      isBeta
                    />
                  </div>
                </div>

                <button 
                  onClick={toggleOpen}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-eden-mist hover:text-eden-light"
                >
                  <X className="w-6 h-6" />
                </button>
              </header>

              <div className="flex-1 overflow-hidden flex relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4">
                  {activeTab === 'explore' ? (
                    results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((pkg) => (
                          <PackageItem
                            key={`${pkg.repository}-${pkg.name}`}
                            pkg={pkg}
                            onClick={() => handlePackageClick(pkg.name)}
                            isActive={selectedPackage?.name === pkg.name}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <div className="p-6 bg-white/5 rounded-full mb-4">
                          {query ? <Inbox className="w-12 h-12" /> : <Search className="w-12 h-12" />}
                        </div>
                        <h3 className="text-xl font-medium text-eden-light">
                          {query ? t('package_manager.no_packages_found') : t('package_manager.start_typing')}
                        </h3>
                        <p className="text-sm text-eden-mist max-w-xs mt-2">
                          {query 
                            ? t('package_manager.no_results_description', { query })
                            : t('package_manager.explore_description')}
                        </p>
                      </div>
                    )
                  ) : activeTab === 'installed' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-eden-light uppercase tracking-widest">{t('package_manager.installed_title')}</h3>
                        <span className="text-[10px] text-eden-mist bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          {installedPackages.length} {t('package_manager.total')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {installedPackages
                          .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()))
                          .map((pkg) => (
                          <PackageItem
                            key={pkg.name}
                            pkg={pkg}
                            onClick={() => handlePackageClick(pkg.name)}
                            isActive={selectedPackage?.name === pkg.name}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <div className="p-6 bg-white/5 rounded-full mb-4">
                        <Loader2 className="w-12 h-12 text-glory-gold animate-pulse" />
                      </div>
                      <h3 className="text-xl font-medium text-eden-light">
                        {t('package_manager.tab_updates')}
                      </h3>
                      <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-glory-gold/10 text-glory-gold border border-glory-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                         {t('user.in_development')}
                      </div>
                      <p className="text-sm text-eden-mist max-w-xs mt-4">
                         Estamos trabalhando na integração com o sistema de updates do Arch Linux.
                      </p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {(selectedPackage || isLoadingDetails) && (
                    <PackageDetails
                      details={selectedPackage}
                      isLoading={isLoadingDetails}
                      onClose={() => setSelectedPackage(null)}
                      onAction={executeAction}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Footer with Integrated Terminal */}
              <footer className="relative bg-eden-dark/50 border-t border-eden-mist/10 shrink-0">
                <AnimatePresence>
                  {terminalState !== 'closed' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: terminalState === 'expanded' ? '450px' : '180px' }}
                      exit={{ height: 0 }}
                      className="w-full bg-black/60 border-b border-eden-mist/10 overflow-hidden flex flex-col"
                    >
                      <div className="px-8 py-3 bg-white/5 flex items-center justify-between shrink-0">
                        <div className="flex-1 flex items-center gap-6 overflow-hidden">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-eden-mist shrink-0">
                            <Terminal className="w-3 h-3 text-glory-gold" />
                            {t('package_manager.console_title')}
                          </div>
                          
                          {isExecuting && (
                            <span className="flex items-center gap-1.5 text-[10px] text-glory-gold animate-pulse shrink-0">
                              <div className="w-1 h-1 rounded-full bg-glory-gold" />
                              {t('package_manager.processing')}
                            </span>
                          )}
                          
                          {/* Last log line in minimized mode */}
                          {terminalState === 'minimized' && (
                            <div className="flex-1 overflow-hidden border-l border-white/10 pl-6">
                              <p className="text-[11px] text-eden-light/60 truncate font-mono">
                                {localLogs.length > 0 
                                  ? (localLogs[localLogs.length - 1].startsWith('ERR:') 
                                    ? localLogs[localLogs.length - 1].substring(4) 
                                    : localLogs[localLogs.length - 1])
                                  : 'Aguardando logs...'}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isExecuting && (
                            <button
                              onClick={cancelAction}
                              className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase font-bold rounded-lg transition-colors"
                            >
                              <StopCircle className="w-3 h-3" />
                              {t('package_manager.cancel')}
                            </button>
                          )}
                          {!isExecuting && terminalState === 'expanded' && (
                            <button
                              onClick={() => setLocalLogs([])}
                              className="text-[10px] uppercase tracking-widest font-bold text-eden-mist hover:text-glory-gold transition-colors mr-2"
                            >
                              {t('package_manager.clear')}
                            </button>
                          )}
                          <button
                            onClick={() => setTerminalState(terminalState === 'expanded' ? 'minimized' : 'expanded')}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-eden-mist transition-colors"
                            title={terminalState === 'expanded' ? "Minimizar" : "Expandir"}
                          >
                            {terminalState === 'expanded' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                          </button>
                          {!isExecuting && (
                            <button
                              onClick={() => setTerminalState('closed')}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-eden-mist transition-colors"
                              title="Fechar Console"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {terminalState === 'expanded' && (
                        <div 
                          ref={scrollRef}
                          className="flex-1 p-6 font-mono text-[13px] overflow-y-auto custom-scrollbar"
                        >
                          {localLogs.map((log, i) => (
                            <div key={i} className={`mb-0.5 ${log.startsWith('ERR:') ? 'text-red-400' : log.startsWith('✅') ? 'text-green-400 font-bold' : log.startsWith('❌') ? 'text-red-500 font-bold' : 'text-eden-light/70'}`}>
                              <span className="text-eden-mist/30 mr-4 select-none w-6 inline-block text-right">{i + 1}</span>
                              {log.startsWith('ERR:') ? log.substring(4) : log}
                            </div>
                          ))}
                        </div>
                      )}

                      {terminalState === 'minimized' && (
                        <div className="px-8 pb-3 -mt-1">
                           <div className="h-0.5 w-full bg-eden-mist/10 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-glory-gold"
                                animate={{ 
                                  x: ["-100%", "100%"]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-8 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-eden-mist">
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t('package_manager.system_online')}
                    </span>
                    <span className="w-px h-3 bg-eden-mist/30" />
                    <span>{t('package_manager.packages_found', { count: results.length })}</span>
                  </div>
                  <div className="text-[10px] text-eden-mist/50">
                    Edenland OS • Package Manager v1.1
                  </div>
                </div>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; isBeta?: boolean }> = ({ active, onClick, label, isBeta }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2
      ${active ? 'bg-glory-gold text-eden-dark shadow-lg shadow-glory-gold/20' : 'text-eden-mist hover:text-eden-light hover:bg-white/5'}
    `}
  >
    {label}
    {isBeta && (
      <span className={`text-[8px] px-1 rounded ${active ? 'bg-black/20 text-eden-dark' : 'bg-glory-gold/20 text-glory-gold'}`}>
        BETA
      </span>
    )}
  </button>
);
