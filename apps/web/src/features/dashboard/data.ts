/**
 * Dashboard data. The account/brand identity is derived from the onboarding
 * workspace (see `deriveAccount`); the metrics, queue, posts, and AI brand
 * analysis below are still placeholders, typed so they can be swapped for real
 * Supabase queries once the product schema (TikTok accounts, scheduled posts,
 * generated slideshows) lands.
 */

import type { Workspace } from "@/features/workspace/store";

export interface Account {
  brand: string;
  website: string;
  tiktok: string;
  cadence: string;
  nextPost: string;
  followers: string;
}

/** Build the dashboard account identity from the onboarding workspace. */
export function deriveAccount(ws: Workspace): Account {
  return {
    brand: ws.company || ws.name || "Your brand",
    website: ws.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    tiktok: ws.tiktok || "@yourbrand",
    cadence: ws.cadence ? `${ws.cadence}`.replace("/ day", "post / day") : "1 post / day",
    nextPost: "Today, 6:00 PM",
    followers: "2,480",
  };
}

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
}

export type QueueStatus = "posted" | "posting" | "scheduled" | "draft";

export interface QueueItem {
  id: string;
  title: string;
  frames: number;
  day: string;
  time: string;
  status: QueueStatus;
}

export interface PostItem {
  id: string;
  title: string;
  frames: number;
  posted: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface BrandFacts {
  summary: string;
  audience: string;
  painPoints: string[];
  voice: string;
}

export const kpis: Kpi[] = [
  { label: "Views, last 7 days", value: "48.2k", delta: "+22%", trend: "up" },
  { label: "Posts published", value: "37", delta: "+5 this week", trend: "up" },
  { label: "Followers", value: "2,480", delta: "+312", trend: "up" },
  { label: "Avg views / post", value: "1,303", delta: "+8%", trend: "up" },
];

export const queue: QueueItem[] = [
  {
    id: "q1",
    title: "POV: you built a great product",
    frames: 6,
    day: "Today",
    time: "6:00 PM",
    status: "scheduled",
  },
  {
    id: "q2",
    title: "3 reasons nobody sees you yet",
    frames: 7,
    day: "Tomorrow",
    time: "9:00 AM",
    status: "scheduled",
  },
  {
    id: "q3",
    title: "Stop guessing your hooks",
    frames: 6,
    day: "Wed",
    time: "6:00 PM",
    status: "scheduled",
  },
  {
    id: "q4",
    title: "The mistake killing your reach",
    frames: 5,
    day: "Thu",
    time: "9:00 AM",
    status: "scheduled",
  },
  {
    id: "q5",
    title: "Your competitor's quiet advantage",
    frames: 6,
    day: "Fri",
    time: "6:00 PM",
    status: "scheduled",
  },
  {
    id: "q6",
    title: "Build in public, get customers",
    frames: 6,
    day: "Sat",
    time: "11:00 AM",
    status: "draft",
  },
];

export const posts: PostItem[] = [
  {
    id: "p1",
    title: "5 signs your landing page is costing you sales",
    frames: 6,
    posted: "2 days ago",
    views: "8.9k",
    likes: "612",
    comments: "47",
    shares: "120",
  },
  {
    id: "p2",
    title: "Why no one is buying (yet)",
    frames: 7,
    posted: "3 days ago",
    views: "12.4k",
    likes: "980",
    comments: "73",
    shares: "210",
  },
  {
    id: "p3",
    title: "The 3 second hook that actually worked",
    frames: 5,
    posted: "4 days ago",
    views: "6.1k",
    likes: "410",
    comments: "28",
    shares: "64",
  },
  {
    id: "p4",
    title: "Founders waste hours on this",
    frames: 6,
    posted: "5 days ago",
    views: "4.7k",
    likes: "338",
    comments: "19",
    shares: "41",
  },
  {
    id: "p5",
    title: "How we got our first 100 users",
    frames: 8,
    posted: "6 days ago",
    views: "15.2k",
    likes: "1.2k",
    comments: "96",
    shares: "284",
  },
  {
    id: "p6",
    title: "Stop doing this in your DMs",
    frames: 5,
    posted: "1 week ago",
    views: "3.9k",
    likes: "256",
    comments: "14",
    shares: "30",
  },
];

/**
 * Placeholder for the brand understanding Blimely would extract from the
 * analyzed website. Real values will come from the analysis step once wired.
 */
export const analysis: BrandFacts = {
  summary:
    "Project management software that keeps small, fast moving teams in sync without the bloat of enterprise tools.",
  audience: "Founders and ops leads at startups of 2 to 50 people who have outgrown spreadsheets.",
  painPoints: [
    "Work is scattered across too many disconnected tools",
    "No clear view of what is slipping until it is late",
    "Hiring a dedicated project manager is too expensive",
  ],
  voice: "Direct, founder to founder, lightly witty. No corporate filler.",
};
