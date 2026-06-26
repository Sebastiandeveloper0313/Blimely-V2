import { useSyncExternalStore } from "react";

/**
 * Workspace store — the brand/account data collected during onboarding and
 * shown across the dashboard.
 *
 * For now this persists to localStorage so the flow works end to end without a
 * backend. Once `supabase/migrations/*_profiles.sql` is applied, swap `read`
 * and `saveWorkspace` to read/write the `profiles` row for the signed-in user
 * (the field names already match the table columns). The rest of the app talks
 * to this module, so that swap is the only change needed.
 */

/** The brand understanding Blimely builds slideshows from. */
export interface BrandAnalysis {
  summary: string;
  audience: string;
  painPoints: string[];
  voice: string;
  /** Where it came from: a real website read, or derived from onboarding answers. */
  source: "site" | "inputs";
}

export interface Workspace {
  name: string;
  company: string;
  logo: string | null;
  mode: "website" | "description";
  website: string;
  description: string;
  team: string;
  revenue: string;
  role: string;
  model: string;
  categories: string[];
  cadence: string;
  tiktok: string;
  analysis: BrandAnalysis | null;
  onboarded: boolean;
}

const KEY = "blimely_workspace";

const defaults: Workspace = {
  name: "",
  company: "",
  logo: null,
  mode: "website",
  website: "",
  description: "",
  team: "",
  revenue: "",
  role: "",
  model: "",
  categories: [],
  cadence: "1 / day",
  tiktok: "",
  analysis: null,
  onboarded: false,
};

function read(): Workspace {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<Workspace>) };
  } catch {
    /* storage unavailable or malformed — fall back to defaults */
  }
  return defaults;
}

let cache = read();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getWorkspace(): Workspace {
  return cache;
}

export function saveWorkspace(patch: Partial<Workspace>): void {
  cache = { ...cache, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore persistence failures */
  }
  for (const listener of listeners) listener();
}

/** Read fresh from storage — used by the login redirect gate. */
export function isOnboarded(): boolean {
  return read().onboarded;
}

export function useWorkspace(): Workspace {
  return useSyncExternalStore(subscribe, getWorkspace, getWorkspace);
}
