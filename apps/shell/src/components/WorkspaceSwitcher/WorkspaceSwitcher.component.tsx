import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useWorkspaceSwitcher } from './WorkspaceSwitcher.hook';
import type { Client } from './WorkspaceSwitcher.types';

export const WorkspaceSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { workspaces, activeWorkspaceId, switchWorkspace, getWorkspaceClients, focusWindow } = useWorkspaceSwitcher();
  
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [previewClients, setPreviewClients] = useState<Client[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine which workspaces to show
  const maxExistingId = workspaces.length > 0 ? Math.max(...workspaces.map(w => w.id)) : 1;
  const lastWorkspaceHasWindows = (workspaces.find(w => w.id === maxExistingId)?.windows ?? 0) > 0;
  
  const displayWorkspaces: number[] = [];
  // Show all existing workspaces up to maxExistingId
  for (let i = 1; i <= maxExistingId; i++) {
    displayWorkspaces.push(i);
  }
  
  // Dynamic logic: if last is used and < 9, show next
  if (lastWorkspaceHasWindows && maxExistingId < 9) {
    displayWorkspaces.push(maxExistingId + 1);
  } else if (displayWorkspaces.length === 0) {
    displayWorkspaces.push(1); // Always show at least 1
  }

  const handleMouseEnter = (id: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    hoverTimeoutRef.current = setTimeout(async () => {
      setHoveredId(id);
      setIsPreviewLoading(true);
      const clients = await getWorkspaceClients(id);
      setPreviewClients(clients);
      setIsPreviewLoading(false);
    }, 400); // 400ms delay as requested
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredId(null);
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full border border-white/5 pointer-events-auto">
      {displayWorkspaces.map((id) => (
        <div
          key={id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(id)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => switchWorkspace(id)}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
              ${activeWorkspaceId === id 
                ? 'text-glory-gold' 
                : 'text-white/30 hover:text-white/80 hover:bg-white/5'}
            `}
          >
            {id}
            {activeWorkspaceId === id && (
              <motion.div 
                layoutId="active-workspace-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-glory-gold"
              />
            )}
          </button>

          <AnimatePresence>
            {hoveredId === id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 -translate-x-4 mt-3 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[60]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                      {t('workspace')} {id}
                    </span>
                    {activeWorkspaceId === id && (
                      <span className="px-1.5 py-0.5 rounded bg-glory-gold/20 text-[10px] text-glory-gold font-bold">
                        {t('active')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {isPreviewLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-4 h-4 border-2 border-glory-gold/30 border-t-glory-gold rounded-full animate-spin" />
                      </div>
                    ) : previewClients.length > 0 ? (
                      previewClients.map((client) => (
                        <motion.button 
                          key={client.address}
                          whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => focusWindow(client.address)}
                          className="w-full flex flex-col gap-1 group text-left p-2 pr-6 rounded-xl transition-all border border-transparent hover:border-white/5"
                        >
                          <span className="text-xs text-white/90 font-bold truncate group-hover:text-primary transition-colors">
                            {client.title || client.class}
                          </span>
                          <span className="text-[10px] text-white/40 truncate">
                            {client.class}
                          </span>
                        </motion.button>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <span className="text-xs text-white/20 italic">
                          {t('workspace_empty')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="absolute -top-1.5 left-7 w-3 h-3 bg-black/60 border-t border-l border-white/10 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
