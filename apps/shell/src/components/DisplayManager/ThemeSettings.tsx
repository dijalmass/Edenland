import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, RotateCcw, Monitor } from 'lucide-react';

const PRESET_ACCENTS = [
  { name: 'Glória (Gold)', value: '#D4AF37' },
  { name: 'Esmeralda', value: '#10B981' },
  { name: 'Safira', value: '#3B82F6' },
  { name: 'Ametista', value: '#A855F7' },
  { name: 'Rubi', value: '#EF4444' },
  { name: 'Céu Edenland', value: '#0EA5E9' },
];

const PRESET_BASES = [
  { name: 'Éden Padrão', value: '#0B190E' },
  { name: 'Noite Profunda', value: '#0A0A0B' },
  { name: 'Oceano Escuro', value: '#081219' },
  { name: 'Vinho Tinto', value: '#1A0B0B' },
  { name: 'Obsidiana', value: '#121212' },
];

// Helper to adjust color brightness (hex)
const adjustColor = (hex: string, amount: number) => {
  let color = hex.replace('#', '');
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

export const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const [accentColor, setAccentColor] = useState('#D4AF37');
  const [baseColor, setBaseColor] = useState('#0B190E');

  useEffect(() => {
    const savedAccent = localStorage.getItem('edenland-accent-color');
    const savedBase = localStorage.getItem('edenland-base-color');
    
    if (savedAccent) applyAccent(savedAccent);
    if (savedBase) applyBase(savedBase);
  }, []);

  const applyAccent = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--color-glory-gold', color);
    localStorage.setItem('edenland-accent-color', color);
  };

  const applyBase = (color: string) => {
    setBaseColor(color);
    const slate = adjustColor(color, 15);
    const mist = adjustColor(color, 60);

    document.documentElement.style.setProperty('--color-eden-dark', color);
    document.documentElement.style.setProperty('--color-eden-slate', slate);
    document.documentElement.style.setProperty('--color-eden-mist', mist);
    
    localStorage.setItem('edenland-base-color', color);
  };

  const resetTheme = () => {
    applyAccent('#D4AF37');
    applyBase('#0B190E');
  };

  return (
    <div className="space-y-8 py-2">
      {/* Accent Color Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 text-eden-light">
            <Palette size={16} className="text-primary" />
            {t('display.accent_color')}
          </h3>
          <button 
            onClick={resetTheme}
            className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-eden-mist hover:text-eden-light"
            title={t('display.reset_tooltip')}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {PRESET_ACCENTS.map((color) => (
            <button
              key={color.value}
              onClick={() => applyAccent(color.value)}
              className={`group relative h-10 rounded-xl border-2 transition-all overflow-hidden ${
                accentColor === color.value ? 'border-white/40 scale-105' : 'border-transparent hover:border-white/20'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {accentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Base Color Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 text-eden-light">
            <Monitor size={16} className="text-primary" />
            {t('display.system_base_color')}
          </h3>
        </div>
        
        <p className="text-[10px] text-eden-mist font-medium leading-relaxed">
          {t('display.system_base_description')}
        </p>

        <div className="grid grid-cols-5 gap-2">
          {PRESET_BASES.map((color) => (
            <button
              key={color.value}
              onClick={() => applyBase(color.value)}
              className={`group relative h-12 rounded-xl border-2 transition-all overflow-hidden ${
                baseColor === color.value ? 'border-white/40 scale-105' : 'border-transparent hover:border-white/20'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {baseColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Picker Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-eden-dark/30 border border-eden-slate">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-eden-mist mb-1">{t('display.accent_color')}</p>
            <input 
              type="color" 
              value={accentColor}
              onChange={(e) => applyAccent(e.target.value)}
              className="w-full h-8 rounded-lg bg-transparent border-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-eden-dark/30 border border-eden-slate">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-eden-mist mb-1">{t('display.system_base_color')}</p>
            <input 
              type="color" 
              value={baseColor}
              onChange={(e) => applyBase(e.target.value)}
              className="w-full h-8 rounded-lg bg-transparent border-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

