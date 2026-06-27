import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import {
  BarChart3,
  CalendarClock,
  Clock,
  HomeIcon,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { useUser } from "@/auth/hooks";
import { useWorkspace } from "@/features/workspace/store";

import { deriveAccount, queue } from "./data";
import { BrandPanel, Home, PostsPanel, QueuePanel, SettingsPanel } from "./panels";

import "@/features/landing/landing.css";
import "./dashboard.css";

type SectionKey = "home" | "queue" | "posts" | "brand" | "settings";

const NAV: { key: SectionKey; label: string; icon: typeof HomeIcon; badge?: string }[] = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "queue", label: "Content queue", icon: CalendarClock, badge: String(queue.length) },
  { key: "posts", label: "Posts", icon: BarChart3 },
  { key: "brand", label: "Brand", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Settings },
];

const TITLES: Record<Exclude<SectionKey, "home">, { title: string; sub: string }> = {
  queue: { title: "Content queue", sub: "What's lined up to post" },
  posts: { title: "Posts", sub: "Everything Blimely has published" },
  brand: { title: "Brand", sub: "What every slideshow is built from" },
  settings: { title: "Settings", sub: "Connections, schedule, and controls" },
};

export function Dashboard() {
  const { data: user } = useUser();
  const ws = useWorkspace();
  const account = deriveAccount(ws);
  const [section, setSection] = useState<SectionKey>("home");
  const [navOpen, setNavOpen] = useState(false);
  const [brandEditing, setBrandEditing] = useState(false);

  const go = (key: string) => {
    setSection(key as SectionKey);
    setBrandEditing(false);
    setNavOpen(false);
  };

  const openBrandEdit = () => {
    setSection("brand");
    setBrandEditing(true);
    setNavOpen(false);
  };

  return (
    <div className={cn("blimely dash", navOpen && "nav-open")}>
      <aside className="dash-side">
        <div className="dash-ws">
          <span className="ws-avatar">{account.brand.charAt(0).toUpperCase()}</span>
          <span className="ws-name">{account.brand}</span>
        </div>

        <nav className="dash-nav">
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
          <button className="upgrade-card">
            <Zap />
            <b>Upgrade</b>
          </button>
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
        <div className="trial-banner">
          <button className="dash-burger" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <Clock /> Free trial · 6 days left
          <button className="tb-link">Upgrade</button>
        </div>

        <main className="dash-content">
          {section === "home" && (
            <Home account={account} ws={ws} onNavigate={go} onAddWebsite={openBrandEdit} />
          )}
          {section !== "home" && (
            <div className="page-head">
              <h1>{TITLES[section].title}</h1>
              <div className="sub">{TITLES[section].sub}</div>
            </div>
          )}
          {section === "queue" && <QueuePanel />}
          {section === "posts" && <PostsPanel />}
          {section === "brand" && (
            <BrandPanel
              account={account}
              ws={ws}
              editing={brandEditing}
              onEditingChange={setBrandEditing}
            />
          )}
          {section === "settings" && <SettingsPanel account={account} ws={ws} />}
        </main>
      </div>
    </div>
  );
}
