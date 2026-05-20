import React, { useState } from 'react';
import { Search, Map as MapIcon, Swords, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from '@/types';

interface NavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm transition-all relative group h-full min-h-[44px] ${
      active ? 'text-rome-bronze' : 'text-gray-400 hover:text-white'
    }`}
  >
    <span className="font-display tracking-widest text-[11px] uppercase pt-0.5">{label}</span>
    {active && (
      <motion.div
        layoutId="nav-active"
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rome-bronze to-transparent"
      />
    )}
  </button>
);

interface NavigationProps {
  currentPage: PageId;
  setPage: (p: PageId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Database', page: 'database' },
    { label: 'Campaigns', page: 'campaigns' },
    { label: 'Map', page: 'map' },
  ];

  const handleNav = (page: PageId) => {
    setPage(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-rome-nav border-b border-rome-border h-16">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 shrink-0 min-h-[44px]"
          >
            <div className="w-9 h-9 bg-rome-red flex items-center justify-center rounded-sm border border-rome-bronze/50">
              <span className="font-serif font-bold text-rome-bronze text-[10px]">SPQR</span>
            </div>
            <span className="text-base font-serif tracking-[0.2em] text-rome-bronze uppercase font-bold leading-none">
              AQUILAE <span className="opacity-60">ATLAS</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {navLinks.map((n) => (
              <NavItem key={n.page} label={n.label} active={currentPage === n.page} onClick={() => handleNav(n.page)} />
            ))}
          </div>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rome-dark" />
              <input
                type="text"
                placeholder="Search Archives..."
                className="w-full bg-[#1A1A18] border border-[#3A3A35] py-2 pl-9 pr-3 text-sm italic placeholder:text-rome-dark focus:outline-none focus:border-rome-bronze transition-all rounded-sm"
              />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-rome-muted hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-0 right-0 z-40 bg-rome-nav border-b border-rome-border lg:hidden"
          >
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rome-dark" />
                <input
                  type="text"
                  placeholder="Search Archives..."
                  className="w-full bg-[#1A1A18] border border-[#3A3A35] py-3 pl-9 pr-3 text-sm italic placeholder:text-rome-dark focus:outline-none focus:border-rome-bronze transition-all rounded-sm"
                />
              </div>
            </div>

            {navLinks.map((n) => (
              <button
                key={n.page}
                onClick={() => handleNav(n.page)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left border-t border-rome-border/50 min-h-[52px] transition-colors ${
                  currentPage === n.page ? 'text-rome-bronze bg-rome-bronze/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-display tracking-widest text-[11px] uppercase">{n.label}</span>
                {currentPage === n.page && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rome-bronze" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
