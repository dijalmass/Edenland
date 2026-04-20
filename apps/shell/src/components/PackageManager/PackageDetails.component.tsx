import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Download, Trash2, Info, Loader2, User, Cpu, Calendar, Box, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PackageDetails as PackageDetailsType } from './PackageManager.types';
import { useAuth } from '../AuthModal';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

interface Props {
  details: PackageDetailsType | null;
  isLoading: boolean;
  onClose: () => void;
  onAction: (action: 'install' | 'remove', name: string, password: string) => void;
}

export const PackageDetails: React.FC<Props> = ({ details, isLoading, onClose, onAction }) => {
  const { t } = useTranslation();
  const { requestPassword } = useAuth();

  const handleAction = (action: 'install' | 'remove') => {
    if (!details) return;
    requestPassword((password) => {
      onAction(action, details.name, password);
    });
  };

  const handleOpenUrl = async (url: string) => {
    try {
      await invoke('open_url', { url });
    } catch (err) {
      toast.error(t('package_manager.error_opening_link') + ': ' + err);
    }
  };

  if (!details && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-0 right-0 bottom-0 w-96 bg-eden-slate/95 backdrop-blur-2xl border-l border-eden-mist/30 shadow-2xl z-[60] flex flex-col"
    >
      <div className="p-4 border-b border-eden-mist/20 flex items-center justify-between">
        <h3 className="font-bold text-eden-light flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 text-glory-gold" />
          {t('package_manager.specifications')}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-full transition-colors text-eden-mist hover:text-eden-light"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-eden-mist">
            <Loader2 className="w-8 h-8 animate-spin text-glory-gold" />
            <p className="text-sm">{t('package_manager.fetching_metadata')}</p>
          </div>
        ) : details ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/64x64/apps/${details.name.toLowerCase()}.svg`}
                    alt={details.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTctNGEyIDIgMCAwIDAtMiAw bC03IDRBMiAyIDAgMCAwIDMgOHY4YTIgMiAwIDAgMCAxIDEuNzNsNyA0YTIgMiAwIDAgMCAyIDBsNy00YTIgMiAwIDAgMCAxLTEuNzN6Ii8+PHBvbHlsaW5lIHBvaW50cz0iMy4yNyA2Ljk2IDEyIDEyIDIwLjczIDYuOTYiLz48bGluZSB4MT0iMTIiIHkxPSIyMiIgeDI9IjEyIiB5Mj0iMTIiLz48L3N2Zz4=';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-glory-gold/10 text-glory-gold border border-glory-gold/20 rounded uppercase tracking-wider">
                      {details.repository}
                    </span>
                    {details.is_installed && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded uppercase tracking-wider">
                        {t('package_manager.installed')}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-eden-light break-words leading-tight">{details.name}</h2>
                  <p className="text-sm text-eden-mist mt-1">{details.version}</p>
                </div>
              </div>
            </div>
 
            <p className="text-sm text-eden-light/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {details.description || t('package_manager.no_description')}
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <DetailItem icon={<User />} label={t('package_manager.maintainer')} value={details.maintainer} />
              <DetailItem icon={<Shield />} label={t('package_manager.license')} value={details.license} />
              <DetailItem icon={<Cpu />} label={t('package_manager.architecture')} value={details.architecture} />
              <DetailItem icon={<Box />} label={t('package_manager.install_size')} value={details.size} />
              <DetailItem icon={<Calendar />} label={t('package_manager.build')} value={details.build_date} />
              {details.install_date && (
                <DetailItem icon={<Calendar />} label={t('package_manager.installed_on')} value={details.install_date} />
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-eden-mist/10">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-eden-mist font-bold">{t('package_manager.official_website')}</span>
                <button 
                  onClick={() => handleOpenUrl(details.url)}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                >
                  <span className="text-sm text-glory-gold truncate max-w-[200px]">{details.url || 'N/A'}</span>
                  <ExternalLink className="w-4 h-4 text-eden-mist group-hover:text-glory-gold transition-colors" />
                </button>
              </div>

              {details.groups && details.groups.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-eden-mist font-bold">{t('package_manager.groups')}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.groups.map(group => (
                      <span key={group} className="text-[11px] px-2 py-0.5 bg-eden-slate/40 border border-eden-mist/10 rounded text-eden-light/70">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {details.dependencies.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-eden-mist font-bold">{t('package_manager.dependencies', { count: details.dependencies.length })}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.dependencies.slice(0, 15).map(dep => (
                      <span key={dep} className="text-[11px] px-2 py-0.5 bg-white/5 border border-eden-mist/10 rounded text-eden-light/60">
                        {dep}
                      </span>
                    ))}
                    {details.dependencies.length > 15 && (
                      <span className="text-[11px] text-eden-mist italic mt-1">{t('package_manager.more_dependencies', { count: details.dependencies.length - 15 })}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {details && !isLoading && (
        <div className="p-6 bg-eden-dark/30 border-t border-eden-mist/20">
          {details.is_installed ? (
            <button
              onClick={() => handleAction('remove')}
              className="w-full flex items-center justify-center gap-2 action-button action-button-danger py-3 shadow-lg shadow-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
              {t('package_manager.remove_button')}
            </button>
          ) : (
            <button
              onClick={() => handleAction('install')}
              className="w-full flex items-center justify-center gap-2 action-button action-button-primary py-3 shadow-lg shadow-glory-gold/10"
            >
              <Download className="w-4 h-4" />
              {t('package_manager.install_button')}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-eden-mist">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-3 h-3' })}
      <span className="text-[9px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <p className="text-[13px] text-eden-light font-medium truncate" title={value}>{value || 'N/A'}</p>
  </div>
);
