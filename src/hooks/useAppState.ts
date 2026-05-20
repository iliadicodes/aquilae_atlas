import { useState } from 'react';
import { Legion, PageId } from '@/types';

export function useAppState() {
  const [page, setPage] = useState<PageId>('home');
  const [selectedLegion, setSelectedLegion] = useState<Legion | null>(null);
  const [comparisonLegions, setComparisonLegions] = useState<Legion[]>([]);

  const handleSelectLegion = (legion: Legion) => {
    setSelectedLegion(legion);
    setPage('profile');
  };

  const handleBackToDatabase = () => {
    setPage('database');
    setSelectedLegion(null);
  };

  const handleCompare = (legions: Legion[]) => {
    setComparisonLegions(legions);
  };

  return {
    page,
    setPage,
    selectedLegion,
    comparisonLegions,
    setComparisonLegions,
    handleSelectLegion,
    handleBackToDatabase,
    handleCompare,
  };
}
