// ─── Popular route chips shown in the swiper ──────────────────────────────────
export const POPULAR_ROUTES = [
  { label: "Toshkent → Samarqand", from: "Toshkent shahri", to: "Samarqand shahri", from_id: "1",  to_id: "9"  },
  { label: "Toshkent → Farg'ona",  from: "Toshkent shahri", to: "Farg'ona shahri",  from_id: "1",  to_id: "11" },
  { label: "Toshkent → Namangan",  from: "Toshkent shahri", to: "Namangan shahri",  from_id: "1",  to_id: "7"  },
  { label: "Toshkent → Qarshi",    from: "Toshkent shahri", to: "Qarshi shahri",    from_id: "1",  to_id: "5"  },
  { label: "Toshkent → Buxoro",    from: "Toshkent shahri", to: "Buxoro shahri",    from_id: "1",  to_id: "4"  },
  { label: "Samarqand → Toshkent", from: "Samarqand shahri", to: "Toshkent shahri", from_id: "9",  to_id: "1"  },
  { label: "Farg'ona → Toshkent",  from: "Farg'ona shahri",  to: "Toshkent shahri", from_id: "11", to_id: "1"  },
  { label: "Namangan → Toshkent",  from: "Namangan shahri",  to: "Toshkent shahri", from_id: "7",  to_id: "1"  },
  { label: "Toshkent → Andijon",   from: "Toshkent shahri",  to: "Andijon shahri",  from_id: "1",  to_id: "6"  },
  { label: "Toshkent → Nukus",     from: "Toshkent shahri",  to: "Nukus shahri",    from_id: "1",  to_id: "14" },
] as const;

export type PopularRoute = (typeof POPULAR_ROUTES)[number];

// ─── Time-slot filter options ─────────────────────────────────────────────────
export const TIME_SLOTS = [
  { key: "morning",   label: "Ertalab",   range: "06:00–12:00" },
  { key: "afternoon", label: "Kunduz",    range: "12:00–18:00" },
  { key: "evening",   label: "Kechqurun", range: "18:00–06:00" },
] as const;

export type TimeSlotKey = (typeof TIME_SLOTS)[number]["key"];
