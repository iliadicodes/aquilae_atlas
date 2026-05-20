export type CertaintyLevel = 'Confirmed' | 'Probable' | 'Possible' | 'Disputed' | 'Unknown';
export type LegionStatus = 'Active' | 'Disbanded' | 'Destroyed' | 'Unknown' | 'Last Attested';
export type Era = 'Republic' | 'Late Republic' | 'Principate' | 'Crisis' | 'Late Empire';

export interface Legion {
  id: string;
  name: string;
  number: string;
  cognomen: string;
  foundedYear: string;
  founder: string;
  mainTheater: string;
  emblem: string;
  symbolDescription: string;
  status: LegionStatus;
  certainty: CertaintyLevel;
  era: Era;
  description: string;
  lastAttestation: string;
  fate: string;
}

export type POIType = 'Battle' | 'Camp' | 'Siege' | 'Fortress' | 'Monument';

export interface POI {
  id: string;
  type: POIType;
  name: string;
  description: string;
  coords: { lat: number; lng: number };
  imageUrl?: string;
  intel?: {
    supplyLine: string;
    distance: string;
    terrain: string;
    estimatedStrength?: string;
  };
}

export interface MovementStage {
  id: string;
  year: string;
  location: string;
  description: string;
  certainty: CertaintyLevel;
  transport?: 'Sea' | 'Land';
  coords: { x: number; y: number; lat: number; lng: number };
  pois?: POI[];
}

export type PageId = 'home' | 'database' | 'profile' | 'map' | 'campaigns' | 'provinces' | 'timeline' | 'sources';
