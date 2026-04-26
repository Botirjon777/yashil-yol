// ─── Popular route chips shown in the swiper ──────────────────────────────────
export const POPULAR_ROUTES = [
  { label: "Toshkent → Samarqand", from: "Toshkent shahri", to: "Samarqand viloyati", from_id: "14", to_id: "8"  },
  { label: "Toshkent → Farg'ona",  from: "Toshkent shahri", to: "Farg‘ona viloyati",  from_id: "14", to_id: "12" },
  { label: "Toshkent → Namangan",  from: "Toshkent shahri", to: "Namangan viloyati",  from_id: "14", to_id: "7"  },
  { label: "Toshkent → Qarshi",    from: "Toshkent shahri", to: "Qashqadaryo viloyati", from_id: "14", to_id: "5"  },
  { label: "Toshkent → Buxoro",    from: "Toshkent shahri", to: "Buxoro viloyati",    from_id: "14", to_id: "3"  },
  { label: "Samarqand → Toshkent", from: "Samarqand viloyati", to: "Toshkent shahri", from_id: "8",  to_id: "14" },
  { label: "Farg'ona → Toshkent",  from: "Farg‘ona viloyati",  to: "Toshkent shahri", from_id: "12", to_id: "14" },
  { label: "Namangan → Toshkent",  from: "Namangan viloyati",  to: "Toshkent shahri", from_id: "7",  to_id: "14" },
  { label: "Toshkent → Andijon",   from: "Toshkent shahri",  to: "Andijon viloyati",  from_id: "14", to_id: "2"  },
  { label: "Toshkent → Nukus",     from: "Toshkent shahri",  to: "Qoraqalpog‘iston Respublikasi", from_id: "14", to_id: "1" },
  { label: "Farg'ona → Andijon",   from: "Farg‘ona viloyati", to: "Andijon viloyati", from_id: "12", to_id: "2" },
] as const;

export type PopularRoute = (typeof POPULAR_ROUTES)[number];

// ─── Time-slot filter options ─────────────────────────────────────────────────
export const TIME_SLOTS = [
  { key: "morning",   label: "Ertalab",   range: "06:00–12:00" },
  { key: "afternoon", label: "Kunduz",    range: "12:00–18:00" },
  { key: "evening",   label: "Kechqurun", range: "18:00–06:00" },
] as const;

export type TimeSlotKey = (typeof TIME_SLOTS)[number]["key"];
