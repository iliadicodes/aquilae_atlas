import React from 'react';
import { motion } from 'motion/react';
import { Legion } from '@/types';
import { CertaintyBadge } from './CertaintyBadge';
import { LegionEmblem } from './LegionEmblem';
import { MapPin, Calendar } from 'lucide-react';

interface LegionCardProps {
  legion: Legion;
  onClick?: () => void;
}

export const LegionCard: React.FC<LegionCardProps> = ({ legion, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'rgba(205, 127, 50, 0.4)' }}
      className="engraved-border bg-rome-stone p-5 md:p-6 cursor-pointer transition-all group border-rome-border"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Emblem icon */}
          <div className="w-10 h-10 shrink-0 bg-rome-red/10 border border-rome-red/20 rounded-sm flex items-center justify-center p-2">
            <LegionEmblem legionId={legion.id} size="sm" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-serif text-rome-text group-hover:text-rome-bronze transition-colors leading-tight">
              {legion.name}
            </h3>
            <p className="text-[10px] font-mono text-rome-dark tracking-tighter uppercase mt-0.5">
              {legion.number} • {legion.cognomen}
            </p>
          </div>
        </div>
        <CertaintyBadge level={legion.certainty} />
      </div>

      <div className="space-y-2.5 mt-4">
        <div className="flex items-center gap-3 text-xs text-rome-muted">
          <MapPin className="w-3.5 h-3.5 text-rome-bronze shrink-0" />
          <span className="truncate">{legion.mainTheater}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-rome-muted">
          <Calendar className="w-3.5 h-3.5 text-rome-bronze shrink-0" />
          <span>Founded {legion.foundedYear}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-rome-border flex justify-between items-center">
        <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold">Status</span>
        <span className={`text-[9px] uppercase tracking-widest font-bold ${legion.status === 'Destroyed' ? 'text-rome-red' : 'text-rome-muted'}`}>
          {legion.status}
        </span>
      </div>
    </motion.div>
  );
};
