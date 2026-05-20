import { supabase } from './supabase';
import { Legion, MovementStage, POI, BookRef } from '@/types';

function toBookRef(row: { book_title?: string | null; book_author?: string | null; book_url?: string | null }): BookRef | undefined {
  if (!row.book_title || !row.book_author || !row.book_url) return undefined;
  return { title: row.book_title, author: row.book_author, url: row.book_url };
}

export async function fetchLegions(): Promise<Legion[]> {
  const { data, error } = await supabase.from('legions').select('*').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    number: r.number,
    cognomen: r.cognomen,
    foundedYear: r.founded_year,
    founder: r.founder,
    mainTheater: r.main_theater,
    emblem: r.emblem,
    symbolDescription: r.symbol_description,
    status: r.status,
    certainty: r.certainty,
    era: r.era,
    description: r.description,
    lastAttestation: r.last_attestation,
    fate: r.fate,
    bookRef: toBookRef(r),
  }));
}

export async function fetchMovementStages(legionId: string): Promise<MovementStage[]> {
  const { data: stageRows, error: stageErr } = await supabase
    .from('movement_stages')
    .select('*')
    .eq('legion_id', legionId)
    .order('id');
  if (stageErr) throw new Error(stageErr.message);

  const stageIds = (stageRows ?? []).map((s) => s.id);
  const { data: poiRows, error: poiErr } = await supabase
    .from('pois')
    .select('*')
    .in('stage_id', stageIds);
  if (poiErr) throw new Error(poiErr.message);

  return (stageRows ?? []).map((s): MovementStage => {
    const stagePois = (poiRows ?? [])
      .filter((p) => p.stage_id === s.id)
      .map((p): POI => ({
        id: p.id,
        type: p.type,
        name: p.name,
        description: p.description,
        coords: { lat: p.coord_lat, lng: p.coord_lng },
        imageUrl: p.image_url ?? undefined,
        intel: p.intel_supply_line
          ? {
              supplyLine: p.intel_supply_line,
              distance: p.intel_distance,
              terrain: p.intel_terrain,
              estimatedStrength: p.intel_estimated_strength ?? undefined,
            }
          : undefined,
        bookRef: toBookRef(p),
      }));

    return {
      id: s.id,
      year: s.year,
      location: s.location,
      description: s.description,
      certainty: s.certainty,
      transport: s.transport ?? undefined,
      coords: { x: s.coord_x, y: s.coord_y, lat: s.coord_lat, lng: s.coord_lng },
      pois: stagePois.length ? stagePois : undefined,
      bookRef: toBookRef(s),
    };
  });
}
