export type Accent = "navy" | "blue" | "red";

export interface Activity {
  title: string;
  date: string;
  description: string;
}

export interface BureauRole {
  role: string;
  mission: string;
}

export interface Structure {
  /** Short acronym, e.g. "JAD" */
  id: string;
  /** URL-safe slug, lowercase */
  slug: string;
  full: string;
  publicCible: string;
  rendezVous: string;
  description: string;
  mission: string;
  upcoming: Activity[];
  past: Activity[];
}

export interface ChoraleGroup {
  name: string;
  kind: string;
  initials: string;
  accent: Accent;
}

export interface Pastor {
  id: string;
  role: string;
  name: string;
  description: string;
}

export interface ChurchEvent {
  day: string;
  month: string;
  title: string;
  description: string;
  tag: string;
  tagAccent: Accent;
}

export interface ProgramItem {
  day: string;
  title: string;
  hours: string;
}

export interface MediaItem {
  title: string;
  category: string;
  duration: string;
  date: string;
}

export interface Verse {
  text: string;
  reference: string;
  url: string;
}

export interface Announcement {
  text: string;
  date: string;
}
