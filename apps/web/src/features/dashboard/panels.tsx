import { cn } from "@workspace/ui/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Heart,
  Layers,
  MessageCircle,
  Mic2,
  Pencil,
  Plus,
  Share2,
  SkipForward,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

import { saveWorkspace, type Workspace } from "@/features/workspace/store";

import { type Account, analysis, posts, queue, type QueueItem } from "./data";

const GRAD = ["", "g2", "g3", "g4"];
const CADENCE_OPTIONS = ["3 / week", "1 / day", "2 / day"];

function SlideThumb({
  title,
  frames,
  idx,
  variant,
  className,
}: {
  title: string;
  frames: number;
  idx: number;
  variant: "sm" | "cover";
  className?: string;
}) {
  return (
    <div
      className={cn("slide-thumb", GRAD[idx % 4], variant === "sm" && "sm", className)}
    >
      {variant === "cover" && (
        <>
          <span className="frames">
            <Layers /> {frames}
          </span>
          <span>{title}</span>
        </>
      )}
    </div>
  );
}

/* ============================== HOME ============================== */

const hasWebsite = (ws: Workspace) =>
  ws.website.trim() !== "" && ws.website.trim() !== "https://";

export function Home({
  account,
  ws,
  onNavigate,
  onAddWebsite,
}: {
  account: Account;
  ws: Workspace;
  onNavigate: (key: string) => void;
  onAddWebsite: () => void;
}) {
  const steps = [
    { label: "Add your website", done: hasWebsite(ws), action: onAddWebsite, platforms: false },
    { label: "Connect your TikTok", done: Boolean(ws.tiktok), action: () => onNavigate("settings"), platforms: true },
    { label: "Generate your first slideshows", done: false, action: () => onNavigate("queue"), platforms: false },
    { label: "Schedule your first post", done: false, action: () => onNavigate("queue"), platforms: false },
  ];
  const completed = steps.filter((s) => s.done).length;

  return (
    <div className="home">
      <div className="home-mark" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="46" height="46">
          <rect width="100" height="100" rx="26" fill="url(#homemark)" />
          <path d="M34 32h34M34 50h27M34 68h18" stroke="white" strokeWidth="9" strokeLinecap="round" />
          <defs>
            <linearGradient id="homemark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5aa6ff" />
              <stop offset="1" stopColor="#1566e6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1>Let's get your TikTok seen.</h1>

      <div className="quickstart">
        <div className="qs-head">
          <h2>Quickstart</h2>
          <span className="qs-count">{completed}/{steps.length}</span>
        </div>
        <p className="qs-sub">Complete these to get the most out of Blimely</p>
        <div className="qs-divider" />
        <div className="qs-steps">
          {steps.map((s) => (
            <button
              key={s.label}
              className={cn("qs-step", s.done && "done")}
              onClick={s.action}
            >
              <span className="qs-check">{s.done && <Check />}</span>
              <span className="qs-label">{s.label}</span>
              {s.platforms && (
                <span className="qs-platforms">
                  <Mic2 />
                </span>
              )}
              <span className="qs-arrow">
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
        <button className="btn-accent qs-cta" onClick={() => onNavigate("queue")}>
          Continue setup <ArrowRight />
        </button>
      </div>

      <div className="changelog-row">
        <button className="btn-pill">
          Changelog <ArrowRight />
        </button>
      </div>

      <section className="home-section">
        <h3>
          <TrendingUp /> Recent on {account.tiktok}
        </h3>
        <div className="thumb-row">
          {posts.slice(0, 4).map((p, i) => (
            <SlideThumb key={p.id} title={p.title} frames={p.frames} idx={i} variant="cover" />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================== QUEUE ============================== */

function QueueRow({ item, idx, compact }: { item: QueueItem; idx: number; compact?: boolean }) {
  return (
    <div className="q-item">
      <SlideThumb title={item.title} frames={item.frames} idx={idx} variant="sm" />
      <div className="qi-info">
        <div className="qi-title">{item.title}</div>
        <div className="qi-when">
          <Clock /> {item.day}, {item.time} · {item.frames} frames
        </div>
      </div>
      <span className={cn("status-tag", item.status)}>
        {item.status === "draft" ? "Draft" : item.status === "posted" ? "Posted" : "Scheduled"}
      </span>
      {!compact && (
        <div className="q-actions">
          <button className="q-iconbtn" title="Edit slideshow">
            <Pencil />
          </button>
          <button className="q-iconbtn" title="Skip this one">
            <SkipForward />
          </button>
        </div>
      )}
    </div>
  );
}

export function QueuePanel() {
  const groups = queue.reduce<Record<string, QueueItem[]>>((acc, item) => {
    (acc[item.day] ??= []).push(item);
    return acc;
  }, {});

  let idx = 0;
  return (
    <div className="card">
      <div className="card-head">
        <h2>Content queue</h2>
        <button className="ch-link">
          <Plus /> Add a topic
        </button>
      </div>
      <div className="card-body">
        <div className="qbanner">
          <span className="gb-ico">
            <Sparkles />
          </span>
          <div>
            <b>Blimely keeps this full automatically.</b>
            <span>New slideshows are generated from your brand as slots open up.</span>
          </div>
        </div>
        {Object.entries(groups).map(([day, items]) => (
          <div key={day}>
            <div className="q-day">{day}</div>
            <div className="q-rows">
              {items.map((item) => (
                <QueueRow key={item.id} item={item} idx={idx++} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== POSTS ============================== */

export function PostsPanel() {
  return (
    <div className="card">
      <div className="card-head">
        <h2>Published posts</h2>
        <span style={{ fontSize: ".85rem", color: "var(--muted)", fontWeight: 600 }}>
          {posts.length} posts · 51.2k views
        </span>
      </div>
      <div className="card-body">
        <div className="posts-grid">
          {posts.map((p, i) => (
            <article className="post-card" key={p.id}>
              <SlideThumb
                title={p.title}
                frames={p.frames}
                idx={i}
                variant="cover"
                className="pc-thumb"
              />
              <div className="pc-body">
                <div className="pc-posted">Posted {p.posted}</div>
                <div className="pc-stats">
                  <span className="pc-stat lead">
                    <Eye /> {p.views}
                  </span>
                  <span className="pc-stat">
                    <Heart /> {p.likes}
                  </span>
                  <span className="pc-stat">
                    <MessageCircle /> {p.comments}
                  </span>
                  <span className="pc-stat">
                    <Share2 /> {p.shares}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== BRAND ============================== */

function BrandEdit({ ws, onDone }: { ws: Workspace; onDone: () => void }) {
  const base = ws.analysis ?? analysis;
  const [company, setCompany] = useState(ws.company);
  const [website, setWebsite] = useState(hasWebsite(ws) ? ws.website : "");
  const [tiktok, setTiktok] = useState(ws.tiktok);
  const [summary, setSummary] = useState(base.summary);
  const [audience, setAudience] = useState(base.audience);
  const [voice, setVoice] = useState(base.voice);
  const [p1, setP1] = useState(base.painPoints[0] ?? "");
  const [p2, setP2] = useState(base.painPoints[1] ?? "");
  const [p3, setP3] = useState(base.painPoints[2] ?? "");

  const save = () => {
    const trimmed = website.trim();
    const normalized = trimmed ? (/^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`) : ws.website;
    saveWorkspace({
      company: company.trim(),
      website: normalized,
      tiktok: tiktok.trim(),
      mode: trimmed ? "website" : ws.mode,
      analysis: {
        summary: summary.trim(),
        audience: audience.trim(),
        painPoints: [p1, p2, p3].map((p) => p.trim()).filter(Boolean),
        voice: voice.trim(),
        source: ws.analysis?.source ?? "inputs",
      },
    });
    onDone();
  };

  return (
    <div className="card">
      <div className="card-head">
        <h2>Edit brand</h2>
      </div>
      <div className="card-body">
        <div className="edit-grid">
          <div className="edit-field">
            <label htmlFor="be-company">Company name</label>
            <input id="be-company" value={company} placeholder="Your company" onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="edit-field">
            <label htmlFor="be-tiktok">TikTok handle</label>
            <input id="be-tiktok" value={tiktok} placeholder="@yourbrand" onChange={(e) => setTiktok(e.target.value)} />
          </div>
        </div>
        <div className="edit-field">
          <label htmlFor="be-website">Website</label>
          <input id="be-website" value={website} placeholder="yourbrand.com" onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="edit-field">
          <label htmlFor="be-summary">What you do</label>
          <textarea id="be-summary" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div className="edit-field">
          <label htmlFor="be-audience">Who it's for</label>
          <textarea id="be-audience" rows={2} value={audience} onChange={(e) => setAudience(e.target.value)} />
        </div>
        <div className="edit-field">
          <label htmlFor="be-p1">Pain points</label>
          <input id="be-p1" value={p1} placeholder="Pain point 1" onChange={(e) => setP1(e.target.value)} style={{ marginBottom: ".5rem" }} />
          <input value={p2} placeholder="Pain point 2" aria-label="Pain point 2" onChange={(e) => setP2(e.target.value)} style={{ marginBottom: ".5rem" }} />
          <input value={p3} placeholder="Pain point 3" aria-label="Pain point 3" onChange={(e) => setP3(e.target.value)} />
        </div>
        <div className="edit-field">
          <label htmlFor="be-voice">Brand voice</label>
          <textarea id="be-voice" rows={2} value={voice} onChange={(e) => setVoice(e.target.value)} />
        </div>
        <div className="edit-actions">
          <button className="btn-ghost" onClick={onDone}>
            Cancel
          </button>
          <button className="btn-accent" onClick={save}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function BrandPanel({
  account,
  ws,
  editing,
  onEditingChange,
}: {
  account: Account;
  ws: Workspace;
  editing: boolean;
  onEditingChange: (v: boolean) => void;
}) {
  const fromWebsite = ws.mode === "website" && account.website;
  const tags = [ws.model, ...ws.categories].filter(Boolean);
  const brand = ws.analysis ?? analysis;
  const analyzedFromSite = ws.analysis?.source === "site";

  if (editing) return <BrandEdit ws={ws} onDone={() => onEditingChange(false)} />;

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>What Blimely learned</h2>
          <button className="ch-link" onClick={() => onEditingChange(true)}>
            <Pencil /> Edit
          </button>
        </div>
        <div className="card-body">
          <p style={{ color: "var(--muted)", fontSize: ".9rem", marginBottom: "1rem" }}>
            {analyzedFromSite
              ? `Analyzed from your ${fromWebsite ? "website" : "description"}.`
              : "Drafted from your onboarding answers."}{" "}
            Every slideshow is written around this.
          </p>
          <div className="source-row">
            <span className="sr-ico web">
              <Globe />
            </span>
            <div className="sr-meta">
              <b>{fromWebsite ? account.website : ws.company || "Your business"}</b>
              <span>{fromWebsite ? "Source website · read & understood" : "From your description"}</span>
            </div>
            <span className="sr-ok">
              <Check />
            </span>
          </div>
          <div className="source-row" style={{ marginBottom: tags.length ? undefined : 0 }}>
            <span className="sr-ico tk">
              <Mic2 />
            </span>
            <div className="sr-meta">
              <b>{account.tiktok}</b>
              <span>Connected TikTok account</span>
            </div>
            <span className="sr-ok">
              <Check />
            </span>
          </div>
          {tags.length > 0 && (
            <div className="brand-tags">
              {tags.map((t) => (
                <span className="brand-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="brand-grid">
        <div className="fact">
          <h3>
            <Sparkles /> What you do
          </h3>
          <p>{brand.summary}</p>
        </div>
        <div className="fact">
          <h3>
            <Users /> Who it's for
          </h3>
          <p>{brand.audience}</p>
        </div>
        <div className="fact">
          <h3>
            <Target /> Pain points we hit on
          </h3>
          <ul>
            {brand.painPoints.map((point) => (
              <li key={point}>
                <AlertCircle /> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="fact">
          <h3>
            <Mic2 /> Brand voice
          </h3>
          <p>{brand.voice}</p>
        </div>
      </div>
    </>
  );
}

/* ============================== SETTINGS ============================== */

export function SettingsPanel({ account, ws }: { account: Account; ws: Workspace }) {
  const [autopilot, setAutopilot] = useState(true);
  const fromWebsite = ws.mode === "website" && account.website;

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>Connections</h2>
        </div>
        <div className="card-body">
          <div className="source-row">
            <span className="sr-ico web">
              <Globe />
            </span>
            <div className="sr-meta">
              <b>{fromWebsite ? account.website : ws.company || "Your business"}</b>
              <span>{fromWebsite ? "Source website" : "Business description"}</span>
            </div>
            <span className="sr-ok">
              <Check />
            </span>
          </div>
          <div className="source-row" style={{ marginBottom: 0 }}>
            <span className="sr-ico tk">
              <Mic2 />
            </span>
            <div className="sr-meta">
              <b>{account.tiktok}</b>
              <span>{account.followers} followers</span>
            </div>
            <span className="sr-ok">
              <Check />
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Posting schedule</h2>
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <div className="set-row">
            <div className="set-info">
              <h3>Post automatically</h3>
              <p>When on, Blimely posts to your TikTok on the schedule below.</p>
            </div>
            <button
              className={cn("toggle", autopilot && "on")}
              onClick={() => setAutopilot((v) => !v)}
              aria-label="Toggle automatic posting"
            />
          </div>
          <div className="set-row">
            <div className="set-info">
              <h3>How often</h3>
              <p>How many slideshows go out each day.</p>
            </div>
            <div className="seg">
              {CADENCE_OPTIONS.map((c) => (
                <button
                  key={c}
                  className={cn(ws.cadence === c && "on")}
                  onClick={() => saveWorkspace({ cadence: c })}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="set-row">
            <div className="set-info">
              <h3>Posting times</h3>
              <p>Blimely picks the best slots within these windows.</p>
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <span className="time-pill">
                <Clock /> 9:00 AM
              </span>
              <span className="time-pill">
                <Clock /> 6:00 PM
              </span>
            </div>
          </div>
          <div className="set-row">
            <div className="set-info">
              <h3>Approval</h3>
              <p>Let everything post on its own, or review each batch first.</p>
            </div>
            <div className="seg">
              <button className="on">Auto-post</button>
              <button>Review first</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
