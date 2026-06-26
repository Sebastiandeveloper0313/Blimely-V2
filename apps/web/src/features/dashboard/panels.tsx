import { cn } from "@workspace/ui/lib/utils";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Heart,
  Layers,
  MessageCircle,
  Mic2,
  Pause,
  Pencil,
  Play,
  Plus,
  Share2,
  SkipForward,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { saveWorkspace, type Workspace } from "@/features/workspace/store";

import { type Account, analysis, kpis, posts, queue, type QueueItem } from "./data";

const CADENCE_OPTIONS = ["3 / week", "1 / day", "2 / day"];

const GRAD = ["", "g2", "g3", "g4"];

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
      style={variant === "cover" ? { fontSize: ".82rem", padding: "1rem" } : undefined}
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

/* ============================== OVERVIEW ============================== */

export function Overview({
  autopilot,
  onToggle,
  onNavigate,
  account,
}: {
  autopilot: boolean;
  onToggle: () => void;
  onNavigate: (key: string) => void;
  account: Account;
}) {
  return (
    <>
      <section className={cn("ap-hero", !autopilot && "paused")}>
        <div>
          <span className="ap-badge">
            <span className="dot" /> {autopilot ? "Autopilot on" : "Autopilot paused"}
          </span>
          {autopilot ? (
            <>
              <h2>Your TikTok is running itself.</h2>
              <p>
                Blimely is generating, scheduling, and posting slideshows for{" "}
                <b>{account.tiktok}</b>. Nothing needed from you.
              </p>
            </>
          ) : (
            <>
              <h2>Autopilot is paused.</h2>
              <p>
                Your queue is on hold and nothing will post until you resume. Your scheduled
                slideshows are safe.
              </p>
            </>
          )}
          <div className="ap-meta">
            <div className="m">
              <b>{autopilot ? account.nextPost : "On hold"}</b>
              <span>Next post</span>
            </div>
            <div className="m">
              <b>{account.cadence}</b>
              <span>Cadence</span>
            </div>
            <div className="m">
              <b>{queue.length}</b>
              <span>In queue</span>
            </div>
          </div>
        </div>
        <div className="ap-cta">
          <button className="ap-btn solid" onClick={onToggle}>
            {autopilot ? <Pause /> : <Play />}
            {autopilot ? "Pause autopilot" : "Resume autopilot"}
          </button>
          <button className="ap-btn ghost" onClick={() => onNavigate("queue")}>
            Review the queue
          </button>
        </div>
      </section>

      <section className="kpis">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{k.value}</div>
            <div className={cn("kpi-delta", k.trend)}>
              <TrendingUp /> {k.delta}
            </div>
          </div>
        ))}
      </section>

      <div className="dash-cols">
        <div className="card">
          <div className="card-head">
            <h2>Up next this week</h2>
            <button className="ch-link" onClick={() => onNavigate("queue")}>
              View queue <ChevronRight />
            </button>
          </div>
          <div className="card-body">
            <div className="q-rows">
              {queue.slice(0, 4).map((item, i) => (
                <QueueRow key={item.id} item={item} idx={i} compact />
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Top recent post</h2>
            <button className="ch-link" onClick={() => onNavigate("posts")}>
              All posts <ChevronRight />
            </button>
          </div>
          <div className="card-body">
            <SlideThumb
              title={posts[4]!.title}
              frames={posts[4]!.frames}
              idx={0}
              variant="cover"
              className="pc-thumb"
            />
            <div style={{ marginTop: ".9rem", display: "flex", gap: "1.1rem" }}>
              <span className="pc-stat lead" style={{ fontWeight: 700 }}>
                <Eye style={{ width: 15, height: 15 }} /> {posts[4]!.views} views
              </span>
              <span className="pc-stat">
                <Heart style={{ width: 15, height: 15 }} /> {posts[4]!.likes}
              </span>
              <span className="pc-stat">
                <MessageCircle style={{ width: 15, height: 15 }} /> {posts[4]!.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
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
        <div className="gen-banner" style={{ marginBottom: "1.2rem" }}>
          <span className="gb-ico">
            <Sparkles />
          </span>
          <div className="gb-txt">
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
        <span style={{ fontSize: ".85rem", color: "var(--ink-mute)", fontWeight: 600 }}>
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

export function BrandPanel({ account, ws }: { account: Account; ws: Workspace }) {
  const fromWebsite = ws.mode === "website" && account.website;
  const tags = [ws.model, ...ws.categories].filter(Boolean);
  // What Blimely understood about the business: real analysis if present,
  // otherwise the placeholder copy.
  const brand = ws.analysis ?? analysis;
  const analyzedFromSite = ws.analysis?.source === "site";

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>What Blimely learned</h2>
          <button className="ch-link">
            <Pencil /> Edit
          </button>
        </div>
        <div className="card-body">
          <p style={{ color: "var(--ink-mute)", fontSize: ".9rem", marginBottom: "1rem" }}>
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

export function SettingsPanel({
  autopilot,
  onToggle,
  account,
  ws,
}: {
  autopilot: boolean;
  onToggle: () => void;
  account: Account;
  ws: Workspace;
}) {
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
              <h3>Autopilot</h3>
              <p>When on, Blimely posts to your TikTok automatically on the schedule below.</p>
            </div>
            <button
              className={cn("toggle", autopilot && "on")}
              onClick={onToggle}
              aria-label="Toggle autopilot"
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
              <p>Let everything post on its own, or review each batch before it goes out.</p>
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
