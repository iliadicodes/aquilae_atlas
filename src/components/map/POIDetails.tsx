import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, Ruler, Mountain, Users, Shield } from 'lucide-react';
import { POI } from '@/types';

interface POIDetailsProps {
  poi: POI | null;
  onClose: () => void;
}

export const POIDetails: React.FC<POIDetailsProps> = ({ poi, onClose }) => {
  if (!poi) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={poi.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        // Mobile: slide up from bottom. Desktop: fixed panel top-right.
        className="fixed bottom-0 left-0 right-0 z-40 md:absolute md:bottom-auto md:top-24 md:right-8 md:left-auto md:w-80"
      >
        <div className="bg-rome-stone border border-rome-bronze/40 shadow-2xl overflow-hidden rounded-t-lg md:rounded-sm">
          <div className="relative h-28 md:h-32 bg-rome-dark flex items-center justify-center overflow-hidden border-b border-rome-border">
            {poi.imageUrl ? (
              <img
                src={`https://images.unsplash.com/photo-1599727277701-49272304097f?q=80&w=800&auto=format&fit=crop&sig=${poi.id}`}
                alt={poi.name}
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Shield className="w-10 h-10 text-rome-bronze/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-rome-stone to-transparent opacity-80" />
            <div className="absolute bottom-3 left-4 right-10">
              <span className="text-[7px] bg-rome-red px-2 py-0.5 text-white uppercase font-bold tracking-widest mb-1 inline-block border border-rome-bronze/30">
                Engagement Record
              </span>
              <h3 className="text-lg md:text-xl font-serif text-rome-text leading-tight">{poi.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-rome-muted hover:text-rome-red transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm text-rome-muted font-serif italic leading-relaxed">"{poi.description}"</p>

            {poi.intel && (
              <div className="space-y-2.5 pt-1">
                {[
                  { icon: <Truck className="w-4 h-4 text-rome-bronze shrink-0 mt-0.5" />, label: 'Supply Chain', value: poi.intel.supplyLine },
                  { icon: <Ruler className="w-4 h-4 text-rome-bronze shrink-0 mt-0.5" />, label: 'March Length', value: poi.intel.distance },
                  { icon: <Mountain className="w-4 h-4 text-rome-bronze shrink-0 mt-0.5" />, label: 'Terrain', value: poi.intel.terrain },
                  ...(poi.intel.estimatedStrength
                    ? [{ icon: <Users className="w-4 h-4 text-rome-bronze shrink-0 mt-0.5" />, label: 'Est. Deployment', value: poi.intel.estimatedStrength }]
                    : []),
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    {icon}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rome-dark tracking-tighter block">{label}</span>
                      <p className="text-[11px] text-rome-text">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-rome-nav border-t border-rome-border">
            <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-rome-dark font-bold">
              <span>Tabularium Militare</span>
              <span>Classified Archival</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
