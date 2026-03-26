// ─── Location types (matching Laravel backend responses) ──────────────────────

export interface ApiRegion {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
}

export interface ApiDistrict {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
  region_id: number;
}

export interface ApiQuarter {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
  district_id: number;
}
