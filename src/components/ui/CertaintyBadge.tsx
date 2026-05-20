import React from 'react';
import { CertaintyLevel } from '@/types';

interface CertaintyBadgeProps {
  level: CertaintyLevel;
}

export const CertaintyBadge: React.FC<CertaintyBadgeProps> = ({ level }) => {
  const styles: Record<CertaintyLevel, string> = {
    Confirmed: 'bg-green-900/40 text-green-400 border-green-800/50',
    Probable: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
    Possible: 'bg-yellow-900/40 text-yellow-400 border-yellow-800/50',
    Disputed: 'bg-orange-900/40 text-orange-400 border-orange-800/50',
    Unknown: 'bg-gray-900/40 text-gray-400 border-gray-800/50',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase border ${styles[level]}`}>
      {level}
    </span>
  );
};
