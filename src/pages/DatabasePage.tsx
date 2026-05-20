import React, { useState, useEffect } from 'react';
import { Legion } from '@/types';
import { fetchLegions } from '@/lib/api';
import { LegionCard } from '@/components/ui';
import { Filter, Swords, Check } from 'lucide-react';

interface DatabasePageProps {
  onSelectLegion: (legion: Legion) => void;
  onCompare: (legions: Legion[]) => void;
}

export const DatabasePage: React.FC<DatabasePageProps> = ({ onSelectLegion, onCompare }) => {
  const [legions, setLegions] = useState<Legion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    fetchLegions().then((data) => { setLegions(data); setLoading(false); });
  }, []);

  const toggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleCompareClick = () => {
    onCompare(legions.filter((l) => selectedForCompare.includes(l.id)));
  };

  const filteredLegions = legions.filter((l) => filter === 'All' || l.era.includes(filter));

  return (
    <div className="pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8 md:mb-12 border-b border-rome-border pb-6">
        <h2 className="text-3xl md:text-4xl text-rome-text mb-2 font-serif">Command Archives</h2>
        <p className="font-serif text-rome-muted italic text-sm md:text-base">
          Transcribing the active and retired units of the Imperial machine.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex bg-rome-nav rounded-sm border border-rome-border overflow-x-auto">
          {['All', 'Republic', 'Principate', 'Late Empire'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-shrink-0 px-4 py-3 text-[10px] uppercase tracking-widest transition-all font-bold min-h-[44px] ${
                filter === t ? 'bg-rome-bronze text-white' : 'text-rome-dark hover:text-rome-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setIsCompareMode(!isCompareMode); setSelectedForCompare([]); }}
          className={`flex items-center justify-center gap-2 px-4 py-3 text-[10px] uppercase tracking-widest font-bold rounded-sm border min-h-[44px] transition-all ${
            isCompareMode
              ? 'bg-rome-red text-white border-rome-red'
              : 'bg-rome-nav text-rome-dark border-rome-border hover:text-rome-muted'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          {isCompareMode ? 'Exit Compare Mode' : 'Compare Mode'}
        </button>
      </div>

      {isCompareMode && (
        <div className="mb-8 p-4 bg-rome-stone border border-rome-red/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-rome-red">Tactical Selection</span>
            <span className="text-[10px] text-rome-muted uppercase font-bold tracking-widest">
              {selectedForCompare.length} / 3 Selected
            </span>
          </div>
          <button
            disabled={selectedForCompare.length < 2}
            onClick={handleCompareClick}
            className="w-full sm:w-auto px-8 py-3 bg-rome-red text-white text-[10px] uppercase font-bold tracking-widest disabled:opacity-30 transition-all border border-rome-bronze/40 min-h-[44px]"
          >
            Launch Comparison
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-rome-stone border border-rome-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLegions.map((legion) => (
            <div key={legion.id} className="relative">
              <LegionCard
                legion={legion}
                onClick={() => (isCompareMode ? toggleCompare(legion.id) : onSelectLegion(legion))}
              />
              {isCompareMode && (
                <div
                  onClick={() => toggleCompare(legion.id)}
                  className={`absolute top-4 right-4 w-7 h-7 border-2 transition-all cursor-pointer flex items-center justify-center ${
                    selectedForCompare.includes(legion.id)
                      ? 'border-rome-red bg-rome-red text-white'
                      : 'border-rome-dark bg-rome-charcoal/80'
                  }`}
                >
                  {selectedForCompare.includes(legion.id) && <Check className="w-4 h-4" />}
                </div>
              )}
            </div>
          ))}
          <div className="engraved-border border-dashed border-rome-border flex flex-col items-center justify-center p-10 text-rome-dark bg-rome-nav/30">
            <Filter className="w-7 h-7 mb-3 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-bold">End of Attested Record</span>
          </div>
        </div>
      )}
    </div>
  );
};
