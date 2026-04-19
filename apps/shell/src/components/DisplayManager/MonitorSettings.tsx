import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Monitor, Workspace } from './DisplayManager.types';
import { Settings2, Zap, Layers, Monitor as MonitorIcon, Star } from 'lucide-react';

interface MonitorSettingsProps {
  monitor: Monitor;
  workspaces: Workspace[];
  onApply: (name: string, res: string, pos: string, scale: string) => void;
  onAssignWorkspace: (workspaceId: number, monitorName: string) => void;
}

export const MonitorSettings: React.FC<MonitorSettingsProps> = ({ 
  monitor, 
  workspaces, 
  onApply,
  onAssignWorkspace 
}) => {
  const { t } = useTranslation();
  const currentRes = `${monitor.width}x${monitor.height}`;
  const currentFreq = `${monitor.refreshRate.toFixed(0)}Hz`;

  // Parse available modes: ["1920x1080@60.00Hz", ...]
  const resolutions = Array.from(new Set(monitor.availableModes.map(m => m.split('@')[0])));
  const frequencies = monitor.availableModes
    .filter(m => m.startsWith(currentRes))
    .map(m => m.split('@')[1]);

  const isPrimary = monitor.x === 0 && monitor.y === 0;

  const handleResChange = (newRes: string) => {
    // Busca a primeira frequência disponível para a nova resolução
    const firstFreq = monitor.availableModes.find(m => m.startsWith(newRes))?.split('@')[1] || "60";
    onApply(monitor.name, `${newRes}@${firstFreq}`, `${monitor.x}x${monitor.y}`, monitor.scale.toString());
  };

  const handleFreqChange = (newFreq: string) => {
    onApply(monitor.name, `${currentRes}@${newFreq}`, `${monitor.x}x${monitor.y}`, monitor.scale.toString());
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-eden-dark/30 border border-eden-slate">
        <div className={`p-2 rounded-xl ${isPrimary ? 'bg-primary/20' : 'bg-white/5'}`}>
          <MonitorIcon size={20} className={isPrimary ? 'text-primary' : 'text-eden-mist'} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-eden-light">{monitor.name}</h4>
          <p className="text-[10px] text-eden-mist uppercase tracking-tighter">{monitor.description}</p>
        </div>
        {isPrimary && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase">
            <Star size={10} fill="currentColor" />
            {t('display.primary')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-eden-mist uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={12} />
            {t('display.resolution')}
          </label>
          <select 
            value={currentRes}
            onChange={(e) => handleResChange(e.target.value)}
            className="w-full bg-eden-dark/50 border border-eden-slate rounded-xl px-3 py-2 text-xs text-eden-light focus:border-primary outline-none transition-colors appearance-none"
          >
            {resolutions.map(res => (
              <option key={res} value={res}>{res}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-eden-mist uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} />
            {t('display.refresh_rate')}
          </label>
          <select 
            value={currentFreq}
            onChange={(e) => handleFreqChange(e.target.value.replace('Hz', ''))}
            className="w-full bg-eden-dark/50 border border-eden-slate rounded-xl px-3 py-2 text-xs text-eden-light focus:border-primary outline-none transition-colors appearance-none"
          >
            {frequencies.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-eden-mist uppercase tracking-widest flex items-center gap-2">
          <Layers size={12} />
          {t('display.assigned_workspaces')}
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-eden-dark/20 border border-eden-slate">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => {
            const isAssigned = workspaces.some(w => w.id === id && w.monitor === monitor.name);
            const isOther = workspaces.some(w => w.id === id && w.monitor !== monitor.name);
            
            return (
              <button
                key={id}
                onClick={() => onAssignWorkspace(id, monitor.name)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isAssigned 
                    ? 'bg-primary border-primary text-eden-dark' 
                    : isOther 
                      ? 'bg-eden-slate/20 border-eden-slate/50 text-eden-mist opacity-50 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 text-eden-mist hover:border-primary/50'
                }`}
              >
                {id}
              </button>
            );
          })}
        </div>
        <p className="text-[9px] text-eden-mist italic">
          {t('display.workspace_hint')}
        </p>
      </div>
    </div>
  );
};
