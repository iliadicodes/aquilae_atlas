import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar, Info, BookOpen, ExternalLink } from 'lucide-react';
import { MovementStage } from '@/types';
import { CertaintyBadge } from '@/components/ui';

interface FollowLegionPanelProps {
  stages: MovementStage[];
  currentStageIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  legionName: string;
  onSelectPOI?: (poi: any) => void;
  selectedPOIId?: string;
}

export const FollowLegionPanel: React.FC<FollowLegionPanelProps> = ({
  stages,
  currentStageIndex,
  onNext,
  onPrev,
  onClose,
  legionName,
  onSelectPOI,
  selectedPOIId,
}) => {
  const currentStage = stages[currentStageIndex];
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="absolute bottom-16 md:bottom-24 left-0 right-0 md:right-auto md:left-4 md:w-[420px] z-50 px-3 md:px-0"
    >
      <div className="bg-rome-stone/95 backdrop-blur-md border border-rome-bronze/40 shadow-2xl overflow-hidden rounded-sm">
        {/* Progress bar */}
        <div className="h-0.5 bg-rome-border w-full">
          <motion.div className="h-full bg-rome-red" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>

        <div className="p-3 md:p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-rome-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shrink-0">
                {currentStageIndex + 1}/{stages.length}
              </div>
              <h3 className="text-xs font-display text-white uppercase tracking-widest truncate">{legionName}</h3>
            </div>
            <button onClick={onClose} className="text-rome-dark hover:text-white transition-colors p-1 min-w-[36px] min-h-[36px] flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-3">
            <div className="md:col-span-8 space-y-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1.5 text-rome-bronze mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">{currentStage.year}</span>
                  </div>
                  <h4 className="text-base font-serif text-rome-text mb-1 italic">"{currentStage.location}"</h4>
                  <p className="text-sm text-rome-muted leading-relaxed font-serif line-clamp-2">{currentStage.description}</p>

                  {currentStage.pois && currentStage.pois.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-rome-border">
                      <div className="flex justify-between items-center mb-1.5">
                        <h5 className="text-[10px] uppercase tracking-[0.2em] text-rome-dark font-bold">Sites</h5>
                        <span className="text-[9px] text-rome-bronze animate-pulse font-bold uppercase tracking-tighter flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" /> Tap for intel
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {currentStage.pois.map((poi) => (
                          <button
                            key={poi.id}
                            onClick={() => onSelectPOI?.(poi)}
                            className={`bg-rome-nav border p-2 rounded-sm text-left hover:border-rome-bronze/40 transition-colors min-h-[40px] ${
                              selectedPOIId === poi.id ? 'border-rome-bronze ring-1 ring-rome-bronze/20' : 'border-rome-border'
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                poi.type === 'Battle' ? 'bg-red-500' : poi.type === 'Fortress' ? 'bg-amber-600' : 'bg-rome-bronze'
                              }`} />
                              <span className="text-[10px] uppercase font-bold text-rome-text tracking-tighter truncate">{poi.name}</span>
                            </div>
                            <p className="text-[10px] text-rome-muted font-serif italic line-clamp-1">{poi.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Meta + nav */}
            <div className="md:col-span-4 flex flex-row md:flex-col justify-between gap-2 md:border-l md:border-rome-border md:pl-3">
              <div className="flex flex-row md:flex-col gap-2 md:gap-2">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold block mb-0.5">Confidence</span>
                  <CertaintyBadge level={currentStage.certainty} />
                </div>
                <div className="hidden md:block">
                  {currentStageIndex < stages.length - 1 && (
                    <>
                      <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold block mb-0.5">Next</span>
                      <p className="text-[10px] text-rome-bronze font-serif italic truncate">{stages[currentStageIndex + 1].location}</p>
                    </>
                  )}
                </div>
                {currentStage.bookRef && (
                  <div className="hidden md:block">
                    <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold block mb-0.5 flex items-center gap-1">
                      <BookOpen className="w-2 h-2" /> Read More
                    </span>
                    <a
                      href={currentStage.bookRef.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1 group"
                    >
                      <p className="text-[10px] font-serif italic text-rome-bronze group-hover:text-white transition-colors leading-tight line-clamp-2">
                        {currentStage.bookRef.title}
                      </p>
                      <ExternalLink className="w-2 h-2 text-rome-dark group-hover:text-rome-bronze transition-colors shrink-0 mt-0.5" />
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-rome-dark font-bold block mb-0.5">Province</span>
                  <div className="flex items-center gap-1 text-rome-text">
                    <MapPin className="w-2.5 h-2.5 text-rome-red shrink-0" />
                    <span className="text-[10px] uppercase font-bold tracking-tighter truncate">{currentStage.location.split('/')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 md:mt-2 shrink-0">
                <button
                  onClick={onPrev}
                  disabled={currentStageIndex === 0}
                  className="flex-1 py-2 border border-rome-border text-rome-muted hover:text-white disabled:opacity-20 flex items-center justify-center transition-all bg-rome-nav min-h-[36px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onNext}
                  disabled={currentStageIndex === stages.length - 1}
                  className="flex-1 py-2 bg-rome-red text-white hover:bg-red-800 disabled:opacity-20 flex items-center justify-center transition-all border border-rome-bronze/40 min-h-[36px]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {currentStageIndex === stages.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-2 bg-rome-bronze/10 border-t border-rome-bronze/20 flex justify-center"
          >
            <button className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-[0.2em] text-rome-bronze hover:text-white transition-colors min-h-[32px]">
              <Info className="w-3 h-3" />
              Open Detailed Legion Dossier
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
