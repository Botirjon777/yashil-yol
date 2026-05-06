// ─── Popular route chips shown in the swiper ──────────────────────────────────
export const POPULAR_ROUTES = [
  { from: "Toshkent v.", to: "Samarqand v.", from_id: "11", to_id: "8" },
  { from: "Toshkent v.", to: "Farg‘ona v.", from_id: "11", to_id: "12" },
  { from: "Toshkent v.", to: "Namangan v.", from_id: "11", to_id: "7" },
  { from: "Toshkent v.", to: "Qarshi v.", from_id: "11", to_id: "5" },
  { from: "Toshkent v.", to: "Buxoro v.", from_id: "11", to_id: "3" },
  { from: "Samarqand v.", to: "Toshkent v.", from_id: "8", to_id: "11" },
  { from: "Farg‘ona v.", to: "Toshkent v.", from_id: "12", to_id: "11" },
  { from: "Namangan v.", to: "Toshkent v.", from_id: "7", to_id: "11" },
  { from: "Toshkent v.", to: "Andijon v.", from_id: "11", to_id: "2" },
  { from: "Toshkent v.", to: "Qoraqalpog‘iston", from_id: "11", to_id: "1" },
  { from: "Farg‘ona v.", to: "Andijon v.", from_id: "12", to_id: "2" },
] as const;

export type PopularRoute = (typeof POPULAR_ROUTES)[number];

// ─── Time-slot filter options ─────────────────────────────────────────────────
export const TIME_SLOTS = [
  { key: "morning", label: "Ertalab", range: "06:00–12:00" },
  { key: "afternoon", label: "Kunduz", range: "12:00–18:00" },
  { key: "evening", label: "Kechqurun", range: "18:00–06:00" },
] as const;

export type TimeSlotKey = (typeof TIME_SLOTS)[number]["key"];
