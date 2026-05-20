import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, Swords, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Legion } from '@/types';
import { CertaintyBadge } from '@/components/ui';

interface CompareLegionsProps {
  legions: Legion[];
  onClose: () => void;
}

export const CompareLegions: React.FC<CompareLegionsProps> = ({ legions, onClose }) => {
  const attributes = [
    { label: 'Founded', key: 'foundedYear', icon: <Calendar className="w-3 h-3" /> },
    { label: 'Founder', key: 'founder', icon: <Shield className="w-3 h-3" /> },
    { label: 'Theater', key: 'mainTheater', icon: <MapPin className="w-3 h-3" /> },
    { label: 'Era', key: 'era', icon: <Clock className="w-3 h-3" /> },
    { label: 'Status', key: 'status', icon: <AlertTriangle className="w-3 h-3" /> },
    { label: 'Last Record', key: 'lastAttestation', icon: <Swords className="w-3 h-3" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-rome-charcoal/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="min-h-full px-4 py-6 md:px-12 md:py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-rome-text mb-1">Tactical Comparison</h2>
            <p className="text-sm font-serif italic text-rome-muted">Evaluating deployment patterns and historical records.</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 border border-rome-border text-rome-muted hover:text-white transition-all bg-rome-nav shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile: stacked cards */}
        <div className="block md:hidden space-y-6">
          {legions.map((legion) => (
            <div key={legion.id} className="bg-rome-stone border border-rome-border overflow-hidden">
              <div className="p-5 border-b border-rome-border flex items-center gap-4 bg-[#0F0F0E]">
                <div className="w-10 h-10 bg-rome-red/10 border border-rome-red/30 rounded-sm flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-rome-red" />
                </div>
                <div>
                  <h3 className="text-base font-serif text-rome-text">{legion.name}</h3>
                  <p className="text-[10px] font-mono text-rome-bronze uppercase tracking-widest">
                    {legion.number} • {legion.cognomen}
                  </p>
                </div>
              </div>
              <div className="divide-y divide-rome-border">
                {attributes.map((attr) => (
                  <div key={attr.label} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex items-center gap-1.5 text-rome-dark w-24 shrink-0">
                      {attr.icon}
                      <span className="text-[9px] uppercase font-bold tracking-widest">{attr.label}</span>
                    </div>
                    <span
                      className={`text-sm font-serif ${attr.key === 'status' && legion.status === 'Destroyed' ? 'text-rome-red' : 'text-rome-text'}`}
                    >
                      {(legion as any)[attr.key] || 'Record Pending'}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 px-5 py-3">
                  <div className="flex items-center gap-1.5 text-rome-dark w-24 shrink-0">
                    <span className="text-[9px] uppercase font-bold tracking-widest">Certainty</span>
                  </div>
                  <CertaintyBadge level={legion.certainty} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: side-by-side table */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {/* Label column */}
          <div className="flex flex-col pt-[168px]">
            {attributes.map((attr) => (
              <div key={attr.label} className="h-20 flex items-center border-b border-rome-border px-2">
                <div className="flex items-center gap-2 text-rome-dark">
                  {attr.icon}
                  <span className="text-[10px] uppercase font-bold tracking-widest">{attr.label}</span>
                </div>
              </div>
            ))}
            <div className="h-20 flex items-center px-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rome-dark">Certainty</span>
            </div>
          </div>

          {legions.map((legion) => (
            <motion.div
              key={legion.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-rome-stone border border-rome-border flex flex-col"
            >
              <div className="p-6 border-b border-rome-border flex flex-col items-center text-center h-[168px] justify-center">
                <div className="w-10 h-10 bg-rome-red/10 border border-rome-red/30 rounded-sm flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-rome-red" />
                </div>
                <h3 className="text-lg font-serif text-rome-text">{legion.name}</h3>
                <p className="text-[10px] font-mono text-rome-bronze mt-1 uppercase tracking-widest">
                  {legion.number} • {legion.cognomen}
                </p>
              </div>
              {attributes.map((attr) => (
                <div key={attr.label} className="h-20 px-5 border-b border-rome-border flex flex-col justify-center bg-[#0F0F0E]">
                  <span
                    className={`text-sm font-serif ${attr.key === 'status' && legion.status === 'Destroyed' ? 'text-rome-red' : 'text-rome-text'}`}
                  >
                    {(legion as any)[attr.key] || 'Record Pending'}
                  </span>
                </div>
              ))}
              <div className="h-20 px-5 flex flex-col justify-center bg-[#0F0F0E]">
                <CertaintyBadge level={legion.certainty} />
              </div>
            </motion.div>
          ))}

          {legions.length < 3 && (
            <div className="border border-dashed border-rome-border flex flex-col items-center justify-center p-6 opacity-30">
              <span className="text-[10px] uppercase tracking-widest font-bold text-rome-dark text-center">
                Select Unit for Comparison
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
