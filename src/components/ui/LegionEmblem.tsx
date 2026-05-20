import React from 'react';
import {
  GiBull,
  GiBoar,
  GiEagleHead,
  GiElephant,
  GiCapricorn,
  GiCrossedSwords,
  GiAnchor,
  GiRomanShield,
} from 'react-icons/gi';

const EMBLEM_MAP: Record<string, { icons: React.ElementType[]; label: string; sub: string }> = {
  'leg-x-fretensis':      { icons: [GiBull, GiAnchor, GiBoar],  label: 'X · FRETENSIS',     sub: 'Bull · Ship · Boar' },
  'leg-ix-hispana':       { icons: [GiBull],                     label: 'IX · HISPANA',      sub: 'Bull' },
  'leg-xx-valeria':       { icons: [GiBoar],                     label: 'XX · VAL · VIC',    sub: 'Charging Boar' },
  'leg-iii-gallica':      { icons: [GiBull],                     label: 'III · GALLICA',     sub: 'Bull' },
  'leg-xvii':             { icons: [GiCrossedSwords],            label: 'XVII · LOST',       sub: 'Teutoburg Forest' },
  'leg-xviii':            { icons: [GiCrossedSwords],            label: 'XVIII · LOST',      sub: 'Teutoburg Forest' },
  'leg-xix':              { icons: [GiEagleHead],                label: 'XIX · LOST',        sub: 'Eagle (Recovered)' },
  'leg-v-alaudae':        { icons: [GiElephant],                 label: 'V · ALAUDAE',       sub: 'Elephant' },
  'leg-xxii-deiotariana': { icons: [GiCapricorn],                label: 'XXII · DEIOT.',     sub: 'No Emblem Recovered' },
};

const FALLBACK = { icons: [GiRomanShield], label: 'UNKNOWN', sub: 'Unknown Standard' };

interface LegionEmblemProps {
  legionId: string;
  /** 'sm' = card-sized single vexillum, 'lg' = profile full display */
  size?: 'sm' | 'lg';
  className?: string;
}

/** Renders a single vexillum cloth panel */
const VexillumPanel: React.FC<{ Icon: React.ElementType; label: string; small?: boolean }> = ({ Icon, label, small }) => (
  <div
    className={`
      relative flex flex-col items-center justify-between
      ${small ? 'w-12 h-16' : 'w-20 h-28 md:w-24 md:h-32'}
      rounded-sm overflow-hidden select-none
    `}
    style={{
      background: 'linear-gradient(160deg, #7a0a0a 0%, #5c0606 40%, #3d0404 100%)',
      border: '2px solid #8B6914',
      boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)',
    }}
  >
    {/* Top fringe bar */}
    <div className="w-full h-1.5 shrink-0" style={{ background: 'repeating-linear-gradient(90deg, #CD9A1A 0px, #CD9A1A 3px, #8B6914 3px, #8B6914 6px)' }} />

    {/* Label top */}
    <span
      className="font-display text-center leading-none px-1"
      style={{ fontSize: small ? '5px' : '7px', color: '#E8C96A', letterSpacing: '0.08em', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
    >
      {label}
    </span>

    {/* Icon */}
    <div className="flex items-center justify-center flex-1 py-0.5" style={{ color: '#E8C96A', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))' }}>
      <Icon style={{ width: small ? '28px' : '48px', height: small ? '28px' : '48px' }} />
    </div>

    {/* Bottom fringe */}
    <div className="w-full" style={{ height: small ? '6px' : '10px', background: 'repeating-linear-gradient(90deg, #CD9A1A 0px, #CD9A1A 2px, transparent 2px, transparent 5px)', borderTop: '1px solid #8B6914' }} />
  </div>
);

export const LegionEmblem: React.FC<LegionEmblemProps> = ({ legionId, size = 'sm', className = '' }) => {
  const emblem = EMBLEM_MAP[legionId] ?? FALLBACK;

  if (size === 'sm') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <VexillumPanel Icon={emblem.icons[0]} label={emblem.label} small />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-end gap-3 flex-wrap justify-center">
        {emblem.icons.map((Icon, i) => (
          <VexillumPanel key={i} Icon={Icon} label={i === 0 ? emblem.label : ''} />
        ))}
      </div>
      <span className="text-[9px] uppercase tracking-widest text-rome-muted font-bold">{emblem.sub}</span>
    </div>
  );
};
