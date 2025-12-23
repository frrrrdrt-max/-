
import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  state: TreeState;
  onToggle: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ state, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      {/* Header */}
      <div className="flex justify-between items-start w-full">
        <div>
          <h1 className="text-[#D4AF37] text-4xl md:text-6xl luxury-text tracking-tighter mb-2">
            GRAND LUXURY
          </h1>
          <p className="text-[#043927] font-semibold text-lg md:text-xl uppercase tracking-widest bg-[#D4AF37] inline-block px-3 py-1">
            Interactive Christmas Tree
          </p>
        </div>
        
        <div className="text-[#D4AF37] text-right hidden md:block">
            <p className="text-xs uppercase tracking-widest opacity-60">Visual Standards</p>
            <p className="text-sm font-bold">EMERALD & GOLD EDITION</p>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="w-full flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-md pointer-events-auto">
          <p className="text-white/60 text-sm mb-4 leading-relaxed italic">
            "Experience the pinnacle of festive engineering. A symphony of 15,000 particles and gold-instanced geometry morphing between chaos and divine order."
          </p>
          <div className="flex gap-4">
             <button 
                onClick={onToggle}
                className="pointer-events-auto px-8 py-3 bg-[#D4AF37] text-[#010a08] font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95"
            >
                {state === TreeState.CHAOS ? 'Reform Tree' : 'Release Chaos'}
            </button>
          </div>
        </div>

        <div className="text-[#D4AF37] text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">Current State</p>
          <div className="flex items-center justify-end gap-2">
            <div className={`w-2 h-2 rounded-full ${state === TreeState.FORMED ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
            <span className="text-xl font-bold tracking-widest uppercase italic">{state}</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Border Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4AF37]/30 m-8 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4AF37]/30 m-8 pointer-events-none" />
    </div>
  );
};

export default Overlay;
