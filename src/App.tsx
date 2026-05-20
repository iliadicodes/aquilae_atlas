import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from '@/components/layout/Navigation';
import { CompareLegions } from '@/components/modals/CompareLegions';
import { HomePage, DatabasePage, ProfilePage, MapExplorer } from '@/pages';
import { useAppState } from '@/hooks/useAppState';

export default function App() {
  const { page, setPage, selectedLegion, comparisonLegions, setComparisonLegions, handleSelectLegion, handleBackToDatabase, handleCompare } =
    useAppState();

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onExplore={() => setPage('map')} onBrowse={() => setPage('database')} />;
      case 'database':
        return <DatabasePage onSelectLegion={handleSelectLegion} onCompare={handleCompare} />;
      case 'profile':
        return selectedLegion ? (
          <ProfilePage legion={selectedLegion} onBack={handleBackToDatabase} />
        ) : (
          <DatabasePage onSelectLegion={handleSelectLegion} onCompare={handleCompare} />
        );
      case 'map':
        return <MapExplorer />;
      default:
        return (
          <div className="pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center opacity-40 text-center">
            <h2 className="text-4xl text-white mb-4 font-serif">Under Restoration</h2>
            <p className="font-serif italic text-gray-400">
              This section of the Imperial Archive is currently being transcribed from parchment to digital slate.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-rome-charcoal marble-bg selection:bg-rome-red/30 selection:text-rome-red">
      <Navigation currentPage={page} setPage={setPage} />

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page + (selectedLegion?.id || '')}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {comparisonLegions.length > 0 && (
          <CompareLegions legions={comparisonLegions} onClose={() => setComparisonLegions([])} />
        )}
      </AnimatePresence>

      {page !== 'map' && (
        <footer className="py-12 border-t border-white/5 mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-6 h-6 bg-rome-red flex items-center justify-center rounded-sm">
                <span className="font-display text-white text-[10px]">X</span>
              </div>
              <span className="font-display text-[10px] tracking-widest text-white uppercase pt-0.5">
                AQUILAE ATLAS • A Roman Legion Atlas
              </span>
            </div>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-gray-600">
              <a href="#" className="hover:text-rome-bronze transition-colors">
                Scholarly Evidence
              </a>
              <a href="#" className="hover:text-rome-bronze transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-rome-bronze transition-colors">
                Cartography Sources
              </a>
            </div>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest">MMXXVI • Curated by Imperial Command</p>
          </div>
        </footer>
      )}
    </div>
  );
}
