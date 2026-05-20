import React from 'react';
import { motion } from 'motion/react';
import { Shield, MapPin, Calendar, Target, History, Award, AlertTriangle, Navigation, FileSearch, Swords, ArrowLeft } from 'lucide-react';
import { Legion } from '@/types';
import { CertaintyBadge, LegionEmblem } from '@/components/ui';

interface ProfilePageProps {
  legion: Legion;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ legion, onBack }) => {
  return (
    <div className="pt-20 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-rome-muted hover:text-white transition-colors mb-8 group font-bold min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Archives
      </motion.button>

      <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Header card */}
        <div className="lg:col-span-12">
          <div className="bg-rome-stone border border-rome-bronze/30 p-5 md:p-10 relative overflow-hidden">
            <Shield className="absolute -top-8 -right-8 w-48 md:w-64 h-48 md:h-64 text-rome-red opacity-5 -rotate-12 pointer-events-none" />

            <div className="relative z-10">
              {/* Name + actions */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-rome-red/10 border border-rome-red/30 flex items-center justify-center rounded-sm shrink-0">
                    <Shield className="w-7 h-7 md:w-10 md:h-10 text-rome-red" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-3xl md:text-5xl font-serif text-rome-text leading-tight">{legion.name}</h1>
                      <CertaintyBadge level={legion.certainty} />
                    </div>
                    <p className="text-sm md:text-lg font-serif italic text-rome-bronze tracking-[0.1em] uppercase">
                      {legion.number} • {legion.cognomen === 'Unknown' ? 'Cognomen Lost' : legion.cognomen}
                    </p>
                  </div>
                </div>

                {/* Action buttons — stack on mobile */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  <button className="flex-1 sm:flex-none px-5 py-3 bg-rome-red text-white text-[10px] uppercase font-bold tracking-widest hover:bg-red-800 transition-all border border-rome-bronze/40 flex items-center justify-center gap-2 min-h-[44px]">
                    <Navigation className="w-4 h-4" /> Follow on Map
                  </button>
                  <button className="flex-1 sm:flex-none px-5 py-3 border border-rome-border text-rome-muted hover:text-white text-[10px] uppercase font-bold tracking-widest transition-all bg-rome-nav flex items-center justify-center gap-2 min-h-[44px]">
                    <FileSearch className="w-4 h-4" /> Compare
                  </button>
                  <button className="flex-1 sm:flex-none px-5 py-3 border border-rome-border text-rome-muted hover:text-white text-[10px] uppercase font-bold tracking-widest transition-all bg-rome-nav flex items-center justify-center gap-2 min-h-[44px]">
                    <Swords className="w-4 h-4" /> Campaigns
                  </button>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 border-t border-rome-border pt-8">
                {[
                  { label: 'Founded', value: legion.foundedYear, icon: <Calendar className="w-3 h-3 text-rome-bronze" /> },
                  { label: 'Founder', value: legion.founder, icon: <Target className="w-3 h-3 text-rome-bronze" /> },
                  { label: 'Primary Theater', value: legion.mainTheater, icon: <MapPin className="w-3 h-3 text-rome-bronze" /> },
                  { label: 'Era', value: legion.era, icon: <Award className="w-3 h-3 text-rome-muted" /> },
                  {
                    label: 'Final Mention',
                    value: legion.lastAttestation || 'Disputed',
                    icon: <History className="w-3 h-3 text-rome-dark" />,
                    span: true,
                  },
                ].map((item) => (
                  <div key={item.label} className={item.span ? 'col-span-2 md:col-span-3 lg:col-span-2' : ''}>
                    <span className="text-[10px] uppercase tracking-widest text-rome-dark font-bold block mb-1">{item.label}</span>
                    <div className="flex items-center gap-2 text-rome-text">
                      {item.icon}
                      <span className="text-sm font-serif">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-rome-bronze mb-5 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-rome-bronze" />
              Historical Overview
            </h3>
            <div className="bg-[#1A1A18] border border-rome-border p-5 md:p-8 rounded-sm">
              <p className="text-base md:text-lg font-serif italic text-rome-text leading-relaxed mb-5">"{legion.description}"</p>
              <p className="text-rome-muted leading-relaxed font-serif text-sm md:text-base">
                The records of {legion.name} represent a critical chapter in the military history of the Roman state. From its inception
                during the {legion.era === 'Late Republic' ? 'civil wars of the falling Republic' : 'height of the Principate'}, this unit
                was essential in maintaining the borders of the empire.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-rome-bronze mb-5 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-rome-bronze" />
              Final Records & Archival Fate
            </h3>
            <div className="p-5 md:p-8 border border-rome-border bg-rome-stone/30">
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-full shrink-0 ${legion.status === 'Destroyed' ? 'bg-rome-red/10 text-rome-red' : 'bg-rome-bronze/10 text-rome-bronze'}`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-serif text-rome-text mb-2">{legion.status}</h4>
                  <p className="text-rome-muted leading-relaxed font-serif text-sm md:text-base">
                    {legion.fate || "The exact circumstances of the legion's final end are lost to the historical record."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-rome-bronze mb-5">Emblems & Standards</h3>
            <div className="bg-rome-nav border border-rome-border p-5 md:p-8 space-y-6">
              <LegionEmblem legionId={legion.id} size="lg" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold block mb-1">Primary Vexillum</span>
                <span className="text-rome-text font-serif italic text-sm">{legion.emblem}</span>
              </div>
              <p className="text-xs text-rome-muted font-serif italic leading-relaxed">{legion.symbolDescription}</p>
            </div>
          </section>

          <section>
            <div className="relative group cursor-pointer overflow-hidden border border-rome-border">
              <div className="aspect-square bg-rome-stone flex items-center justify-center opacity-40 grayscale group-hover:scale-105 transition-transform duration-700">
                <MapPin className="w-14 h-14 text-rome-dark" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-rome-charcoal via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-rome-red block mb-1">Visual Archive</span>
                <span className="text-base md:text-lg font-serif text-rome-text">Deployment Map</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
