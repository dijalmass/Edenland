import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Package as PackageIcon, CheckCircle2 } from 'lucide-react';
import type { Package } from './PackageManager.types';

interface Props {
  pkg: Package;
  onClick: () => void;
  isActive?: boolean;
}

export const PackageItem: React.FC<Props> = ({ pkg, onClick, isActive }) => {
  const [iconError, setIconError] = useState(false);

  // Heurística de ícone: Tenta pegar do tema Papirus no GitHub
  // É um dos repositórios de ícones mais completos para Linux
  const iconUrl = `https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/64x64/apps/${pkg.name.toLowerCase()}.svg`;

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`
        relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isActive 
          ? 'bg-glory-gold/10 border-glory-gold/40 shadow-lg shadow-glory-gold/10' 
          : 'bg-white/5 border-white/5 hover:border-glory-gold/20 hover:bg-white/10'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-eden-slate/40 border border-white/10
            ${isActive ? 'ring-2 ring-glory-gold/30' : ''}
          `}>
            {!iconError ? (
              <img 
                src={iconUrl} 
                alt={pkg.name}
                className="w-8 h-8 object-contain drop-shadow-md"
                onError={() => setIconError(true)}
              />
            ) : (
              <PackageIcon className={`w-6 h-6 ${isActive ? 'text-glory-gold' : 'text-eden-mist'}`} />
            )}
          </div>
          
          {pkg.is_installed && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-eden-dark shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold truncate text-sm ${isActive ? 'text-glory-gold' : 'text-eden-light'}`}>
              {pkg.name}
            </h3>
            <span className="text-[10px] text-eden-mist/60 bg-white/5 px-1.5 rounded border border-white/5 uppercase tracking-tighter">
              {pkg.repository}
            </span>
          </div>
          <p className="text-xs text-eden-mist line-clamp-2 leading-relaxed">
            {pkg.description || 'Sem descrição disponível.'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-eden-mist/40">{pkg.version}</span>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {pkg.is_installed ? (
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase tracking-wider">
              <Trash2 className="w-3 h-3" />
              Remover
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-bold text-glory-gold uppercase tracking-wider">
              <Download className="w-3 h-3" />
              Instalar
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-glory-gold"
        />
      )}
    </motion.div>
  );
};
