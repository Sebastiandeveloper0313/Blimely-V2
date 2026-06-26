import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  Pause,
  Play,
  Settings,
  Sparkles,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { useUser } from "@/auth/hooks";
import { useWorkspace } from "@/features/workspace/store";

import { deriveAccount, queue } from "./data";
import { BrandPanel, Overview, PostsPanel, QueuePanel, SettingsPanel } from "./panels";

import "@/features/landing/landing.css";
import "./dashboard.css";

type SectionKey = "overview" | "queue" | "posts" | "brand" | "settings";

const NAV: { key: SectionKey; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "queue", label: "Content queue", icon: CalendarClock, badge: String(queue.length) },
  { key: "posts", label: "Posts", icon: BarChart3 },
  { key: "brand", label: "Brand", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Settings },
];

const TITLES: Record<SectionKey, { title: string; sub: string }> = {
  overview: { title: "Overview", sub: "Your autopilot at a glance" },
  queue: { title: "Content queue", sub: "What's lined up to post" },
  posts: { title: "Posts", sub: "Everything Blimely has published" },
  brand: { title: "Brand", sub: "What every slideshow is built from" },
  settings: { title: "Settings", sub: "Connections, schedule, and controls" },
};

function BrandMark() {
  return (
    <svg viewBox="0 0 100 100" width="28" height="28">
      <rect width="100" height="100" rx="28" fill="url(#dashmark)" />
      <path d="M34 32h34M34 50h27M34 68h18" stroke="white" strokeWidth="9" strokeLinecap="round" />
      <defs>
        <linearGradient id="dashmark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5aa6ff" />
          <stop offset="1" stopColor="#1566e6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Dashboard() {
  const { data: user } = useUser();
  const ws = useWorkspace();
  const account = deriveAccount(ws);
  const [section, setSection] = useState<SectionKey>("overview");
  const [autopilot, setAutopilot] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  const toggleAutopilot = () => setAutopilot((v) => !v);
  const go = (key: string) => {
    setSection(key as SectionKey);
    setNavOpen(false);
  };

  const heading =
    section === "overview"
      ? { title: "Overview", sub: `Autopilot for ${account.tiktok}` }
      : TITLES[section];

  return (
    <div className={cn("blimely dash", navOpen && "nav-open")}>
      <aside className="dash-side">
        <Link to="/" className="dash-brand brand" aria-label="Blimely home">
          <span className="brand-mark" aria-hidden="true">
            <BrandMark />
          </span>
          <span className="brand-name">blimely</span>
        </Link>

        <nav className="dash-nav">
          <div className="dash-nav-label">Workspace</div>
          {NAV.map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              className={cn("dash-nav-item", section === key && "active")}
              onClick={() => go(key)}
            >
              <Icon /> {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="dash-side-foot">
          <div className={cn("dash-autostat", !autopilot && "paused")}>
            <span className="dot" />
            <div>
              <b>{autopilot ? "Autopilot on" : "Paused"}</b>
              <span>{autopilot ? `Next: ${account.nextPost}` : "Nothing will post"}</span>
            </div>
          </div>
          <div className="dash-user">
            <span className="av" aria-hidden="true" />
            <div className="u-meta">
              <div className="u-name">{account.brand}</div>
              <div className="u-mail">{user?.email ?? "you@example.com"}</div>
            </div>
            <Link to="/auth/logout" className="u-out" title="Sign out">
              <LogOut />
            </Link>
          </div>
        </div>
      </aside>

      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(16,24,48,.25)" }}
          aria-hidden="true"
        />
      )}

      <div className="dash-main">
        <header className="dash-top">
          <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
            <button className="dash-burger" onClick={() => setNavOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
            <div>
              <h1>{heading.title}</h1>
              <div className="sub">{heading.sub}</div>
            </div>
          </div>
          <div className="dash-top-actions">
            <button
              className={cn("autopilot-pill", !autopilot && "paused")}
              onClick={toggleAutopilot}
            >
              <span className="dot" />
              {autopilot ? "Autopilot on" : "Paused"}
              {autopilot ? <Pause /> : <Play />}
            </button>
            <button className="btn btn-blue" style={{ padding: ".7rem 1.1rem" }}>
              <Plus style={{ width: 17, height: 17 }} /> Generate slideshows
            </button>
          </div>
        </header>

        <main className="dash-content">
          {section === "overview" && (
            <Overview
              autopilot={autopilot}
              onToggle={toggleAutopilot}
              onNavigate={go}
              account={account}
            />
          )}
          {section === "queue" && <QueuePanel />}
          {section === "posts" && <PostsPanel />}
          {section === "brand" && <BrandPanel account={account} ws={ws} />}
          {section === "settings" && (
            <SettingsPanel autopilot={autopilot} onToggle={toggleAutopilot} account={account} ws={ws} />
          )}
        </main>
      </div>
    </div>
  );
}
