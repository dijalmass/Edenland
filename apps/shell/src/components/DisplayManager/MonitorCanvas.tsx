import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Monitor } from './DisplayManager.types';
import { Monitor as MonitorIcon, Move, RefreshCw } from 'lucide-react';
import { motion, type PanInfo } from 'framer-motion';

interface MonitorCanvasProps {
  monitors: Monitor[];
  onApply: (name: string, res: string, pos: string, scale: string) => void;
  onSelect: (monitor: Monitor) => void;
  selectedMonitor: Monitor | null;
}

export const MonitorCanvas: React.FC<MonitorCanvasProps> = ({ monitors, onApply, onSelect, selectedMonitor }) => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const SCALE_FACTOR = 15; // Ajuste de escala para o canvas

  useEffect(() => {
    recenterMonitors();
  }, [monitors]);

  const recenterMonitors = () => {
    const initialPositions: Record<string, { x: number; y: number }> = {};
    monitors.forEach(m => {
      initialPositions[m.name] = { x: m.x, y: m.y };
    });
    setPositions(initialPositions);
  };

  const findBestSnap = (monitor: Monitor, currentX: number, currentY: number) => {
    let bestX = currentX;
    let bestY = currentY;
    let minDistance = Infinity;
    const SNAP_THRESHOLD = 50;

    monitors.forEach(other => {
      if (other.name === monitor.name) return;

      const otherPos = positions[other.name];
      const targets = [
        // Esquerda do Outro
        { x: otherPos.x - monitor.width, y: otherPos.y, type: 'left' },
        // Direita do Outro
        { x: otherPos.x + other.width, y: otherPos.y, type: 'right' },
        // Cima do Outro
        { x: otherPos.x, y: otherPos.y - monitor.height, type: 'top' },
        // Baixo do Outro
        { x: otherPos.x, y: otherPos.y + other.height, type: 'bottom' },
      ];

      targets.forEach(target => {
        const dist = Math.sqrt(Math.pow(target.x - currentX, 2) + Math.pow(target.y - currentY, 2));
        if (dist < SNAP_THRESHOLD && dist < minDistance) {
          minDistance = dist;
          bestX = target.x;
          bestY = target.y;
        }
      });
    });

    return { x: bestX, y: bestY };
  };

  const handleDrag = (name: string, info: PanInfo) => {
    const monitor = monitors.find(m => m.name === name);
    if (!monitor) return;

    // Movimentação temporária no canvas
    const newX = positions[name].x + info.delta.x * SCALE_FACTOR;
    const newY = positions[name].y + info.delta.y * SCALE_FACTOR;

    setPositions(prev => ({
      ...prev,
      [name]: { x: newX, y: newY }
    }));
  };

  const handleDragEnd = (name: string) => {
    const monitor = monitors.find(m => m.name === name);
    if (!monitor) return;

    const currentPos = positions[name];
    const snapped = findBestSnap(monitor, currentPos.x, currentPos.y);

    setPositions(prev => ({
      ...prev,
      [name]: snapped
    }));
    
    setIsDragging(null);
    onSelect(monitor);
  };

  if (monitors.length < 2) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] uppercase tracking-widest font-black text-eden-mist">
          {t('display.visual_arrangement')}
        </h4>
        <button 
          onClick={recenterMonitors}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-eden-dark/50 border border-eden-slate hover:border-primary transition-all text-[10px] font-bold"
        >
          <RefreshCw size={12} />
          {t('display.recenter')}
        </button>
      </div>

      <div 
        ref={canvasRef}
        className="relative w-full h-80 bg-eden-dark/50 rounded-2xl border border-eden-slate overflow-hidden flex items-center justify-center cursor-crosshair"
      >
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(var(--color-eden-mist) 1px, transparent 1px)',
          backgroundSize: '20px 20px' 
        }} />
        
        {monitors.map((m) => (
          <motion.div
            key={m.name}
            drag
            dragMomentum={false}
            onDragStart={() => setIsDragging(m.name)}
            onDrag={(_, info) => handleDrag(m.name, info)}
            onDragEnd={() => handleDragEnd(m.name)}
            onClick={() => onSelect(m)}
            className={`absolute flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing select-none shadow-2xl transition-shadow ${
              selectedMonitor?.name === m.name ? 'border-primary bg-primary/10' : 'border-eden-slate bg-eden-slate/40'
            } backdrop-blur-md`}
            style={{
              width: m.width / SCALE_FACTOR,
              height: m.height / SCALE_FACTOR,
              left: `calc(50% + ${positions[m.name]?.x / SCALE_FACTOR}px)`,
              top: `calc(50% + ${positions[m.name]?.y / SCALE_FACTOR}px)`,
              zIndex: isDragging === m.name ? 50 : 10
            }}
          >
            <MonitorIcon size={24} className={selectedMonitor?.name === m.name ? 'text-primary' : 'text-eden-light'} />
            <span className="text-[10px] mt-2 font-black truncate w-full text-center uppercase tracking-tight">
              {m.name}
            </span>
            <div className="flex gap-1 mt-1">
               <span className="text-[8px] px-1 bg-black/30 rounded font-bold">
                {m.width}x{m.height}
              </span>
              {m.x === 0 && m.y === 0 && (
                <span className="text-[8px] px-1 bg-primary text-eden-dark rounded font-bold">PR</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {monitors.map((m) => (
          <button
            key={m.name}
            onClick={() => {
              const pos = positions[m.name];
              const resStr = `${m.width}x${m.height}@${m.refreshRate.toFixed(0)}`;
              const posStr = `${pos.x}x${pos.y}`;
              onApply(m.name, resStr, posStr, m.scale.toString());
            }}
            className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 ${
              selectedMonitor?.name === m.name ? 'bg-primary text-eden-dark border-primary' : 'bg-eden-slate/30 border-eden-slate text-eden-mist hover:text-eden-light'
            }`}
          >
            <Move size={14} />
            {t('display.apply_monitor', { name: m.name })}
          </button>
        ))}
      </div>
    </div>
  );
};
