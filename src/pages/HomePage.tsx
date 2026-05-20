import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield } from 'lucide-react';
import { fetchLegions } from '@/lib/api';
import { Legion } from '@/types';


interface HomePageProps {
  onExplore: () => void;
  onBrowse: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onExplore, onBrowse }) => {
  const [legions, setLegions] = useState<Legion[]>([]);

  useEffect(() => {
    fetchLegions().then(setLegions);
  }, []);

  return (
    <div className="relative min-h-screen pt-16 flex flex-col items-center justify-center overflow-hidden bg-rome-charcoal">
      {/* Background decor — hidden on mobile for perf */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 grayscale sepia hidden sm:block">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, #2A2A25 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-[10%] left-[40%] text-[80px] md:text-[120px] font-serif opacity-5 select-none">GALLIA</div>
        <div className="absolute top-[40%] left-[45%] text-[80px] md:text-[120px] font-serif opacity-5 select-none">ITALIA</div>
      </div>

      {/* Hero */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-3 py-1 mb-5 text-[10px] tracking-[0.4em] uppercase text-rome-bronze font-bold border border-rome-bronze/30">
            Tabularium Militare
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif text-rome-text mb-6 leading-[1] tracking-tighter uppercase">
            Follow the <span className="text-rome-red italic">Eagles</span>
          </h2>
          <p className="text-lg md:text-2xl text-rome-muted font-serif italic leading-relaxed mb-10 max-w-xl mx-auto">
            Trace Rome's legions across war, province, and empire.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-10 py-4 bg-rome-red hover:bg-red-800 text-white font-display tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 group border border-rome-bronze/40 shadow-[0_0_20px_rgba(139,0,0,0.3)] min-h-[52px]"
            >
              Explore the Map
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onBrowse}
              className="w-full sm:w-auto px-10 py-4 border border-rome-border text-rome-muted hover:text-rome-bronze hover:border-rome-bronze/50 font-display tracking-[0.3em] text-xs transition-all uppercase bg-rome-nav/50 min-h-[52px]"
            >
              Browse Legions
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 pt-10 border-t border-rome-border grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '50+', label: 'Unique Legions' },
            { value: '12k+', label: 'Attested Sites' },
            { value: '450y', label: 'Military Data' },
            { value: 'XVIII', label: 'Campaigns' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif text-rome-text">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-rome-dark mt-2 font-bold">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lost Legions */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-20 md:py-32">
        <div className="flex flex-col items-center mb-12 text-center">
          <h3 className="text-2xl md:text-3xl font-serif text-rome-text mb-4">Lost, Destroyed, and Disputed</h3>
          <div className="w-16 h-1 bg-rome-red mb-5" />
          <p className="text-rome-muted font-serif italic max-w-lg text-base md:text-lg">
            Units missing from the record, annihilated in ambush, or whose final fate remains a subject of intense historical debate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {legions.filter((l) => l.status === 'Destroyed' || l.certainty === 'Disputed').map((legion) => (
            <div
              key={legion.id}
              className="bg-rome-stone border border-rome-border p-6 hover:border-rome-red/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-24 h-24 text-rome-red -rotate-12" />
              </div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-rome-red font-bold uppercase tracking-widest px-2 py-1 border border-rome-red/30 bg-rome-red/10">
                  {legion.status}
                </span>
                <span className="text-[10px] text-rome-dark font-bold uppercase tracking-widest">{legion.number}</span>
              </div>
              <h4 className="text-lg md:text-xl font-serif text-rome-text mb-2">{legion.name}</h4>
              <p className="text-sm text-rome-muted font-serif italic mb-5 line-clamp-3">{legion.description}</p>
              <button
                onClick={onBrowse}
                className="text-[10px] uppercase font-bold tracking-widest text-rome-bronze hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                Review Evidence →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-[1px] h-10 bg-gradient-to-b from-rome-bronze/50 to-transparent" />
        <span className="text-[8px] uppercase tracking-[0.5em] text-gray-500">Scroll to Initiate</span>
      </div>
    </div>
  );
};
