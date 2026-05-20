import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Clock, MapPin, Maximize2, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import Map, { Marker, Source, Layer, MapRef, NavigationControl } from 'react-map-gl/mapbox';
import { LEGIONS, LEGIO_X_MOVEMENT } from '@/data';
import { CertaintyBadge } from '@/components/ui';
import { FollowLegionPanel, POIDetails } from '@/components/map';
import { POI } from '@/types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export const MapExplorer: React.FC = () => {
  const [activeYear, setActiveYear] = useState(117);
  const [selectedLegion, setSelectedLegion] = useState<string | null>(null);
  const [_isDossierOpen, setIsDossierOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  // Mobile: sidebar drawer open/closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Mobile: timeline collapsed
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const currentLegion = LEGIONS.find((l) => l.id === selectedLegion);

  const handleFollow = () => {
    if (selectedLegion === 'leg-x-fretensis') {
      setIsFollowing(true);
      setCurrentStageIndex(0);
      setIsDossierOpen(false);
      setSelectedLegion(null);
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isFollowing) {
      const yearStr = LEGIO_X_MOVEMENT[currentStageIndex].year;
      const yearMatch = yearStr.match(/(\d+)/);
      if (yearMatch) {
        let yearNum = parseInt(yearMatch[1]);
        if (yearStr.includes('BC')) yearNum = -yearNum;
        setActiveYear(yearNum);
      }
    }
  }, [currentStageIndex, isFollowing]);

  const mapPadding = useMemo(() => {
    if (isFollowing) {
      return { top: 60, bottom: 200, left: 20, right: 20 };
    }
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }, [isFollowing]);

  const currentCoords = useMemo(() => {
    if (isFollowing) {
      const stage = LEGIO_X_MOVEMENT[currentStageIndex];
      return { latitude: stage.coords.lat, longitude: stage.coords.lng };
    }
    return { latitude: 41.9028, longitude: 12.4964 };
  }, [isFollowing, currentStageIndex]);

  useEffect(() => {
    if (isFollowing && mapRef.current) {
      mapRef.current.flyTo({
        center: [currentCoords.longitude, currentCoords.latitude],
        zoom: 7,
        padding: mapPadding,
        duration: 3000,
        essential: true,
      });
    }
  }, [currentCoords, isFollowing, mapPadding]);

  useEffect(() => {
    setSelectedPOI(null);
  }, [currentStageIndex]);

  const pathData = useMemo(() => ({
    seaLine: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: LEGIO_X_MOVEMENT
          .filter((_, i) => i === 0 || LEGIO_X_MOVEMENT[i].transport === 'Sea')
          .map((s) => [s.coords.lng, s.coords.lat]),
      },
    },
    landLine: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: LEGIO_X_MOVEMENT
          .filter((_, i) => i === 0 || LEGIO_X_MOVEMENT[i].transport === 'Land')
          .map((s) => [s.coords.lng, s.coords.lat]),
      },
    },
  }), []);

  const eraLabels = [
    { label: 'Republic', min: -Infinity, max: -27 },
    { label: 'Augustus', min: -27, max: 14 },
    { label: 'Julio-Claudian', min: 14, max: 68 },
    { label: 'Flavian', min: 68, max: 96 },
    { label: 'Nerva-Antonine', min: 96, max: 192 },
    { label: 'Severan', min: 192, max: 235 },
    { label: 'Crisis', min: 235, max: Infinity },
  ];

  const currentEra = eraLabels.find((e) => activeYear >= e.min && activeYear < e.max)?.label ?? '';

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-rome-charcoal p-6">
        <div className="w-full max-w-sm text-center bg-rome-stone border border-rome-bronze/40 p-6 md:p-8">
          <Shield className="w-10 h-10 text-rome-red mx-auto mb-5" />
          <h2 className="text-xl font-serif text-rome-text mb-3 uppercase tracking-widest leading-tight">Tactical Archives Locked</h2>
          <p className="text-rome-muted font-serif italic mb-6 text-sm">
            A Mapbox Access Token is required to render the Imperial tactical map.
          </p>
          <div className="text-left space-y-3 text-xs font-serif leading-relaxed text-rome-text mb-5">
            {[
              'Open Settings and select Secrets.',
              'Add VITE_MAPBOX_ACCESS_TOKEN as the name.',
              'Paste your key from the Mapbox Dashboard.',
            ].map((step, i) => (
              <p key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-rome-red text-white flex items-center justify-center rounded-sm shrink-0 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </p>
            ))}
          </div>
          <p className="text-[10px] text-rome-dark uppercase tracking-widest font-bold">
            The app restores automatically once the key is set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden pt-16 flex flex-col relative bg-rome-charcoal">
      {/* ── Mobile top bar ── */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 bg-rome-nav border-b border-rome-border z-30 shrink-0">
        <button
          onClick={() => { setIsSidebarOpen(!isSidebarOpen); setSelectedLegion(null); }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-rome-bronze min-h-[44px] px-2"
        >
          <Shield className="w-4 h-4" />
          {selectedLegion ? currentLegion?.name : 'Legion Registry'}
        </button>
        <button
          onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-rome-muted min-h-[44px] px-2"
        >
          <Clock className="w-4 h-4" />
          <span>{activeYear > 0 ? `${activeYear} AD` : `${Math.abs(activeYear)} BC`}</span>
          {isTimelineOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* ── Mobile timeline drawer ── */}
      <AnimatePresence>
        {isTimelineOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-rome-nav border-b border-rome-border z-30 shrink-0"
          >
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-rome-bronze tracking-widest">{currentEra}</span>
                <span className="text-sm font-serif text-rome-text">
                  {activeYear > 0 ? `${activeYear} AD` : `${Math.abs(activeYear)} BC`}
                </span>
              </div>
              <div className="relative h-2 bg-rome-border rounded-full">
                <div
                  className="absolute left-0 h-full bg-rome-bronze rounded-full"
                  style={{ width: `${((activeYear + 100) / 550) * 100}%` }}
                />
                <input
                  type="range" min="-100" max="450" value={activeYear}
                  onChange={(e) => setActiveYear(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-rome-bronze rounded-full pointer-events-none shadow-[0_0_8px_rgba(205,127,50,0.5)]"
                  style={{ left: `${((activeYear + 100) / 550) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main row: sidebar + map ── */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-20 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            absolute md:relative top-0 left-0 h-full z-30
            w-72 md:w-80
            bg-rome-nav border-r border-rome-border
            flex flex-col
            transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 border-b border-rome-border">
            <h3 className="text-[11px] font-serif font-bold text-rome-bronze mb-3 uppercase tracking-[0.4em] opacity-80">
              Legion Registry
            </h3>
            <input
              type="text"
              placeholder="Filter Archives..."
              className="w-full bg-[#151512] border border-rome-border rounded-sm py-2.5 px-3 text-[10px] uppercase tracking-widest text-rome-text focus:outline-none focus:border-rome-bronze/50 italic placeholder:text-rome-dark/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {LEGIONS.map((legion) => (
              <button
                key={legion.id}
                onClick={() => { setSelectedLegion(legion.id); setIsDossierOpen(false); setIsSidebarOpen(false); }}
                className={`w-full text-left px-5 py-4 transition-all border-b border-rome-border/30 last:border-0 min-h-[56px] ${
                  selectedLegion === legion.id ? 'bg-rome-bronze/5' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[13px] font-serif uppercase tracking-widest ${
                    selectedLegion === legion.id ? 'text-rome-bronze font-bold' : 'text-rome-text opacity-70'
                  }`}>
                    Legio {legion.number}{' '}
                    <span className="opacity-50 text-[10px] ml-1">{legion.cognomen}</span>
                  </span>
                  {selectedLegion === legion.id && (
                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 bg-rome-bronze rounded-full ring-4 ring-rome-bronze/10 shrink-0" />
                  )}
                </div>
                <p className="text-[8px] text-rome-muted uppercase tracking-tighter mt-0.5 font-bold opacity-60">
                  {legion.status} • {legion.mainTheater}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative bg-[#0D0D0B] overflow-hidden min-w-0">
          <Map
            ref={mapRef}
            initialViewState={{ longitude: 12.4964, latitude: 41.9028, zoom: 4 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            projection={{ name: 'globe' }}
            padding={mapPadding}
          >
            <NavigationControl position="top-right" />

            {/* Roma marker */}
            <Marker longitude={12.4964} latitude={41.9028}>
              <div className="relative group cursor-pointer">
                <div className="w-3 h-3 bg-rome-bronze rounded-full ring-4 ring-rome-bronze/20" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-rome-stone border border-rome-bronze/40 p-2 text-[10px] whitespace-nowrap uppercase tracking-widest text-rome-bronze font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Roma
                </div>
              </div>
            </Marker>

            {/* Campaign path */}
            {isFollowing && (
              <>
                <Source id="legion-path-land" type="geojson" data={pathData.landLine as any}>
                  <Layer id="land-line-layer" type="line" paint={{ 'line-color': '#CD7F32', 'line-width': 1.5, 'line-opacity': 0.4 }} />
                </Source>
                <Source id="legion-path-sea" type="geojson" data={pathData.seaLine as any}>
                  <Layer id="sea-line-layer" type="line" paint={{ 'line-color': '#8b0000', 'line-width': 1.5, 'line-dasharray': [2, 2], 'line-opacity': 0.5 }} />
                </Source>
              </>
            )}

            {isFollowing && (
              <Marker longitude={LEGIO_X_MOVEMENT[currentStageIndex].coords.lng} latitude={LEGIO_X_MOVEMENT[currentStageIndex].coords.lat}>
                <div className="relative z-10">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-rome-red rounded-full ring-8 ring-rome-red/30 animate-pulse relative">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-rome-stone border-l-4 border-l-rome-red px-2 py-1.5 text-[10px] whitespace-nowrap uppercase tracking-widest text-white font-bold shadow-2xl">
                    {LEGIO_X_MOVEMENT[currentStageIndex].location}
                  </div>
                </div>
              </Marker>
            )}

            {isFollowing && LEGIO_X_MOVEMENT[currentStageIndex].pois?.map((poi) => (
              <Marker key={poi.id} longitude={poi.coords.lng} latitude={poi.coords.lat}>
                <button
                  className="relative group"
                  onClick={(e) => { e.stopPropagation(); setSelectedPOI(poi); }}
                >
                  <div className={`w-3 h-3 rounded-full ring-4 shadow-lg transition-transform hover:scale-125 ${
                    poi.id === selectedPOI?.id ? 'ring-white scale-125' : ''
                  } ${
                    poi.type === 'Battle' ? 'bg-red-500 ring-red-500/20' :
                    poi.type === 'Fortress' ? 'bg-amber-600 ring-amber-600/20' :
                    poi.type === 'Siege' ? 'bg-orange-600 ring-orange-600/20' :
                    'bg-rome-bronze ring-rome-bronze/20'
                  }`} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-rome-stone border border-rome-bronze/40 p-1.5 text-[9px] whitespace-nowrap uppercase tracking-widest text-rome-bronze font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-[120px]">
                    <div className="flex items-center gap-1.5 mb-0.5 border-b border-rome-border pb-1">
                      <span className="text-[7px] bg-rome-dark px-1 text-white">{poi.type}</span>
                      <span className="truncate">{poi.name}</span>
                    </div>
                    <p className="normal-case font-serif italic text-rome-muted text-[9px] mt-0.5 whitespace-normal">{poi.description}</p>
                  </div>
                </button>
              </Marker>
            ))}
          </Map>

          {/* Follow panel */}
          <AnimatePresence>
            {isFollowing && (
              <FollowLegionPanel
                stages={LEGIO_X_MOVEMENT}
                currentStageIndex={currentStageIndex}
                onNext={() => setCurrentStageIndex((p) => Math.min(p + 1, LEGIO_X_MOVEMENT.length - 1))}
                onPrev={() => setCurrentStageIndex((p) => Math.max(p - 1, 0))}
                onClose={() => { setIsFollowing(false); setSelectedPOI(null); }}
                legionName="Legio X Fretensis"
                onSelectPOI={setSelectedPOI}
                selectedPOIId={selectedPOI?.id}
              />
            )}
          </AnimatePresence>

          <POIDetails poi={selectedPOI} onClose={() => setSelectedPOI(null)} />

          {/* Layer toggle */}
          <div className="absolute top-4 left-4 z-30 group hidden md:block">
            <div className="bg-rome-stone/80 backdrop-blur-md border border-rome-border p-1 shadow-2xl rounded-sm hover:bg-rome-stone transition-all">
              <button className="flex items-center gap-2 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-rome-bronze font-bold">
                <Layers className="w-3 h-3" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden whitespace-nowrap">
                  Archive Layers
                </span>
              </button>
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                <div className="h-px bg-rome-border my-1 mx-2" />
                {['Legion Stations', 'Fortresses', 'Province Borders'].map((layer) => (
                  <button key={layer} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#1A1A18] text-[8px] uppercase tracking-[0.2em] text-rome-muted w-full font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-rome-bronze" /> {layer}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop timeline footer */}
          <footer className="absolute bottom-0 left-0 right-0 h-20 bg-rome-nav border-t border-rome-border hidden md:flex items-center px-8 gap-8 z-40">
            <div className="flex flex-col gap-0.5 w-28 shrink-0">
              <span className="text-[9px] uppercase font-bold text-rome-bronze tracking-widest">{currentEra}</span>
              <span className="text-lg font-serif text-rome-text">
                {activeYear > 0 ? `${activeYear} AD` : `${Math.abs(activeYear)} BC`}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="relative h-1.5 bg-rome-border rounded-full">
                <div
                  className="absolute left-0 h-full bg-rome-bronze rounded-full"
                  style={{ width: `${((activeYear + 100) / 550) * 100}%` }}
                />
                <input
                  type="range" min="-100" max="450" value={activeYear}
                  onChange={(e) => setActiveYear(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-rome-bronze rounded-full pointer-events-none shadow-[0_0_10px_rgba(205,127,50,0.5)]"
                  style={{ left: `${((activeYear + 100) / 550) * 100}%`, transform: 'translate(-50%,-50%)' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[8px] uppercase tracking-widest text-rome-dark font-bold">
                {eraLabels.map(({ label, min, max }) => (
                  <span key={label} className={activeYear >= min && activeYear < max ? 'text-rome-bronze' : ''}>{label}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              <button className="p-2 border border-rome-border hover:border-rome-bronze text-rome-muted transition-all bg-[#0A0A0A] min-w-[36px] min-h-[36px] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </button>
              <button className="p-2 border border-rome-border hover:border-rome-bronze text-rome-muted transition-all bg-[#0A0A0A] min-w-[36px] min-h-[36px] flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </footer>

          {/* Desktop dossier drawer */}
          <AnimatePresence>
            {selectedLegion && !isFollowing && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="absolute top-4 right-4 bottom-24 w-80 bg-rome-stone border border-rome-bronze/30 shadow-2xl flex flex-col z-50 overflow-hidden rounded-sm hidden md:flex"
              >
                <button
                  onClick={() => setSelectedLegion(null)}
                  className="absolute top-3 right-3 text-rome-dark hover:text-rome-text transition-colors z-10 p-1"
                >
                  ✕
                </button>

                <div className="p-5 border-b border-rome-border bg-[#1A1A18]">
                  <div className="flex justify-between items-start mb-1 pr-6">
                    <span className="text-[10px] text-rome-bronze uppercase tracking-[0.2em] font-bold">Legio Summary</span>
                    <CertaintyBadge level={currentLegion!.certainty} />
                  </div>
                  <h2 className="font-serif text-xl text-rome-text leading-tight">{currentLegion!.name}</h2>
                  <p className="text-[9px] italic text-rome-muted mt-1 uppercase tracking-widest">
                    Founded {currentLegion!.foundedYear}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="bg-[#1A1A18] border-l-2 border-rome-bronze p-3">
                    <span className="text-[10px] block text-rome-muted mb-1 font-bold uppercase tracking-tighter">Primary Deployment</span>
                    <span className="text-sm text-rome-text font-serif italic">{currentLegion!.mainTheater}</span>
                  </div>
                  <div className="bg-[#1A1A18] border-l-2 border-rome-red/40 p-3">
                    <span className="text-[10px] block text-rome-muted mb-1 font-bold uppercase tracking-tighter">Current Status</span>
                    <span className={`text-sm font-serif italic ${currentLegion!.status === 'Destroyed' ? 'text-rome-red' : 'text-rome-text'}`}>
                      {currentLegion!.status}
                    </span>
                  </div>

                  {currentLegion!.id === 'leg-x-fretensis' && (
                    <button
                      onClick={handleFollow}
                      className="w-full py-3 bg-rome-red text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all border border-rome-bronze/30 flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <MapPin className="w-3 h-3" /> Follow Path
                    </button>
                  )}

                  <div className="pt-2 border-t border-rome-border space-y-2">
                    <p className="text-sm text-rome-text font-serif italic leading-relaxed">{currentLegion!.description}</p>
                    <p className="text-[11px] text-rome-muted italic">{currentLegion!.fate}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile dossier bottom sheet */}
          <AnimatePresence>
            {selectedLegion && !isFollowing && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-rome-stone border-t border-rome-bronze/30 shadow-2xl z-50 md:hidden max-h-[60vh] flex flex-col rounded-t-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-rome-border bg-[#1A1A18] shrink-0">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-rome-bronze uppercase tracking-[0.2em] font-bold">Legio Summary</span>
                      <CertaintyBadge level={currentLegion!.certainty} />
                    </div>
                    <h2 className="font-serif text-lg text-rome-text leading-tight">{currentLegion!.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedLegion(null)}
                    className="p-2 text-rome-dark hover:text-rome-text min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#1A1A18] border-l-2 border-rome-bronze p-2.5">
                      <span className="text-[9px] block text-rome-muted mb-0.5 font-bold uppercase tracking-tighter">Theater</span>
                      <span className="text-xs text-rome-text font-serif italic">{currentLegion!.mainTheater}</span>
                    </div>
                    <div className="bg-[#1A1A18] border-l-2 border-rome-red/40 p-2.5">
                      <span className="text-[9px] block text-rome-muted mb-0.5 font-bold uppercase tracking-tighter">Status</span>
                      <span className={`text-xs font-serif italic ${currentLegion!.status === 'Destroyed' ? 'text-rome-red' : 'text-rome-text'}`}>
                        {currentLegion!.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-rome-text font-serif italic leading-relaxed">{currentLegion!.description}</p>

                  {currentLegion!.id === 'leg-x-fretensis' && (
                    <button
                      onClick={handleFollow}
                      className="w-full py-3 bg-rome-red text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all border border-rome-bronze/30 flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <MapPin className="w-3 h-3" /> Follow Path
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
