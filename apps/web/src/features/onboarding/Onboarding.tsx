import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import {
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Music2,
  Tag,
  UploadCloud,
  User,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";

import { analysisFromInputs, analyzeBrand } from "@/features/workspace/analyze";
import { type BrandAnalysis, saveWorkspace } from "@/features/workspace/store";

import "@/features/landing/landing.css";
import "./onboarding.css";

const STEPS = [
  { title: "Welcome to Blimely", sub: "A few quick questions so every slideshow sounds like you." },
  { title: "Analyze your website", sub: "We use this to understand your brand and what to post." },
  { title: "Tell us about yourself", sub: "This helps us tailor recommendations to your stage." },
  { title: "What describes you best?", sub: "We'll shape your experience around your role." },
  { title: "What type of business do you run?", sub: "So Blimely makes content that resonates with your audience." },
  { title: "Connect your TikTok", sub: "Blimely posts your slideshows straight to this account." },
  { title: "You're all set", sub: "Autopilot is ready to start." },
];

const TEAM = ["Just me", "2 - 5", "6 - 10", "11 - 20", "21 - 50", "50+"];
const REVENUE = ["Pre-revenue", "$1 - $1,000", "$1k - $10k", "$10k - $50k", "$50k - $500k", "$500k+"];
const ROLES = [
  "Founder", "Social Media Manager", "Marketing Manager",
  "Agency Owner", "Freelancer", "Product Manager",
  "Content Creator", "Growth Manager", "Other",
];
const MODELS = ["B2B", "B2C", "Both"];
const CATEGORIES = ["E-commerce", "SaaS", "Agency", "Services", "Marketplace", "Media/Content", "Mobile app", "Other"];
const CADENCE = ["3 / week", "1 / day", "2 / day"];

interface FormData {
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
}

export function Onboarding() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState<FormData>({
    name: "",
    company: "",
    logo: null,
    mode: "website",
    website: "https://",
    description: "",
    team: "",
    revenue: "",
    role: "Founder",
    model: "",
    categories: [],
    cadence: "1 / day",
    tiktok: "",
    analysis: null,
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleCategory = (c: string) =>
    setData((d) => ({
      ...d,
      categories: d.categories.includes(c)
        ? d.categories.filter((x) => x !== c)
        : [...d.categories, c],
    }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => {
    // Keep a real website analysis; otherwise (re)derive from the full set of
    // answers now that role/model/categories are known.
    const analysis =
      data.analysis?.source === "site"
        ? data.analysis
        : analysisFromInputs({
            mode: data.mode,
            website: data.website,
            description: data.description,
            company: data.company,
            model: data.model,
            categories: data.categories,
            role: data.role,
          });
    saveWorkspace({
      name: data.name,
      company: data.company,
      logo: data.logo,
      mode: data.mode,
      website: data.website,
      description: data.description,
      team: data.team,
      revenue: data.revenue,
      role: data.role,
      model: data.model,
      categories: data.categories,
      cadence: data.cadence,
      tiktok: data.tiktok,
      analysis,
      onboarded: true,
    });
    void navigate({ to: "/dashboard" });
  };

  const analyze = async () => {
    setAnalyzing(true);
    const analysis = await analyzeBrand({
      mode: data.mode,
      website: data.website,
      description: data.description,
      company: data.company,
      model: data.model,
      categories: data.categories,
      role: data.role,
    });
    setData((d) => ({ ...d, analysis }));
    setAnalyzing(false);
    next();
  };

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("logo", file.name);
  };

  const head = STEPS[step]!;
  const logoInitial = (data.company || data.name || "B").charAt(0).toUpperCase();

  return (
    <div className="blimely onb">
      <div className="onb-sky" aria-hidden="true">
        <svg viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="onbsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a8c2e6" />
              <stop offset="34%" stopColor="#c6d8ef" />
              <stop offset="68%" stopColor="#e6eef7" />
              <stop offset="100%" stopColor="#f6f1e9" />
            </linearGradient>
            <radialGradient id="onbhaze" cx="50%" cy="20%" r="75%">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <filter id="onbclouds" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0062" numOctaves="4" seed="22" stitchTiles="stitch" result="t" />
              <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.55 1.3" />
            </filter>
          </defs>
          <rect width="1440" height="860" fill="url(#onbsky)" />
          <rect width="1440" height="860" filter="url(#onbclouds)" />
          <rect width="1440" height="860" fill="url(#onbhaze)" />
        </svg>
      </div>

      <Link to="/" className="auth-home brand" aria-label="Blimely home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="28" height="28">
            <rect width="100" height="100" rx="28" fill="url(#onbmark)" />
            <path d="M34 32h34M34 50h27M34 68h18" stroke="white" strokeWidth="9" strokeLinecap="round" />
            <defs>
              <linearGradient id="onbmark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5aa6ff" />
                <stop offset="1" stopColor="#1566e6" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="brand-name">blimely</span>
      </Link>

      {analyzing && (
        <div className="onb-toast" role="status">
          <span className="ot-spin" />
          <div>
            <b>Preparing workspace</b>
            <span>Reading your site…</span>
            <div className="ot-steps">
              <i className="ok"><span className="d" /> Website</i>
              <i><span className="d" /> Profile</i>
            </div>
          </div>
        </div>
      )}

      <div className="onb-stage">
        <div className="onb-head">
          <h1>{head.title}</h1>
          <p>{head.sub}</p>
        </div>

        <div className="onb-card">
          {/* ---------- step 0: profile ---------- */}
          {step === 0 && (
            <>
              <div className="onb-banner">
                Everything you enter here is used <b>directly across Blimely</b> to shape your posts.
              </div>
              <div className="profile-grid">
                <div>
                  <div className="onb-label">
                    <Building2 /> Logo <span className="muted">(optional)</span>
                  </div>
                  <button
                    type="button"
                    className={cn("onb-upload", data.logo && "has")}
                    onClick={() => fileRef.current?.click()}
                    style={{ width: "100%" }}
                  >
                    {data.logo ? (
                      <>
                        <span className="logo-preview">{logoInitial}</span>
                        <b>{data.logo}</b>
                        <span>Click to replace</span>
                      </>
                    ) : (
                      <>
                        <span className="up-ico">
                          <UploadCloud />
                        </span>
                        <b>Upload</b>
                        <span>PNG, JPG (5MB)</span>
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onLogo} />
                </div>

                <div>
                  <div className="auth-field">
                    <label htmlFor="onb-name">
                      <User style={{ width: 14, height: 14, display: "inline", marginRight: 4, verticalAlign: "-2px" }} />
                      Your name
                    </label>
                    <input
                      id="onb-name"
                      value={data.name}
                      placeholder="Jane Founder"
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="onb-company">
                      <Building2 style={{ width: 14, height: 14, display: "inline", marginRight: 4, verticalAlign: "-2px" }} />
                      Company name
                    </label>
                    <input
                      id="onb-company"
                      value={data.company}
                      placeholder="Enter your company name"
                      onChange={(e) => set("company", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="onb-actions">
                <button className="btn btn-blue" disabled={!data.name || !data.company} onClick={next}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ---------- step 1: website ---------- */}
          {step === 1 && (
            <>
              <div className="onb-seg">
                <button className={cn("seg-btn", data.mode === "website" && "on")} onClick={() => set("mode", "website")}>
                  <Globe /> Website
                </button>
                <button className={cn("seg-btn", data.mode === "description" && "on")} onClick={() => set("mode", "description")}>
                  <FileText /> Use description instead
                </button>
              </div>

              {data.mode === "website" ? (
                <div className="auth-field">
                  <label htmlFor="onb-web">
                    <Globe style={{ width: 14, height: 14, display: "inline", marginRight: 4, verticalAlign: "-2px" }} />
                    Company website
                  </label>
                  <input
                    id="onb-web"
                    value={data.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </div>
              ) : (
                <div className="auth-field">
                  <label htmlFor="onb-desc">Describe your business</label>
                  <textarea
                    id="onb-desc"
                    rows={4}
                    value={data.description}
                    placeholder="What you sell, who it's for, and what makes you different."
                    onChange={(e) => set("description", e.target.value)}
                    style={{
                      width: "100%",
                      padding: ".82rem 1rem",
                      borderRadius: 12,
                      border: "1px solid rgba(22,40,90,.14)",
                      background: "#fff",
                      fontFamily: "var(--font-body)",
                      fontSize: ".96rem",
                      color: "var(--ink)",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}

              <div className="onb-actions">
                <button
                  className="btn btn-blue"
                  disabled={analyzing || (data.mode === "website" ? data.website.length < 12 : data.description.length < 10)}
                  onClick={() => void analyze()}
                >
                  {analyzing ? (
                    <>
                      <span className="onb-spin" /> Analyzing…
                    </>
                  ) : (
                    <>
                      {data.mode === "website" ? "Analyze website" : "Use this description"}{" "}
                      <ChevronRight style={{ width: 18, height: 18 }} />
                    </>
                  )}
                </button>
                <button className="onb-back" onClick={back}>← Back</button>
              </div>
            </>
          )}

          {/* ---------- step 2: about ---------- */}
          {step === 2 && (
            <>
              <div className="onb-label">
                <Users /> How big is your current team?
              </div>
              <div className="opt-grid">
                {TEAM.map((t) => (
                  <button key={t} className={cn("opt", data.team === t && "selected")} onClick={() => set("team", t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="onb-label mt">
                <DollarSign /> What is your current monthly revenue?
              </div>
              <div className="opt-grid">
                {REVENUE.map((r) => (
                  <button key={r} className={cn("opt", data.revenue === r && "selected")} onClick={() => set("revenue", r)}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="onb-actions">
                <button className="btn btn-blue" disabled={!data.team || !data.revenue} onClick={next}>
                  Continue
                </button>
                <button className="onb-change" onClick={() => setStep(1)}>Change website or description</button>
              </div>
            </>
          )}

          {/* ---------- step 3: role ---------- */}
          {step === 3 && (
            <>
              <div className="onb-label">
                <Briefcase /> Select your role
              </div>
              <div className="opt-grid">
                {ROLES.map((r) => (
                  <button key={r} className={cn("opt", data.role === r && "selected")} onClick={() => set("role", r)}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="onb-actions">
                <button className="btn btn-blue" disabled={!data.role} onClick={next}>
                  Continue
                </button>
                <button className="onb-back" onClick={back}>← Back</button>
              </div>
            </>
          )}

          {/* ---------- step 4: business ---------- */}
          {step === 4 && (
            <>
              <div className="onb-label">
                <Building2 /> Business model
              </div>
              <div className="opt-grid">
                {MODELS.map((m) => (
                  <button key={m} className={cn("opt", data.model === m && "selected")} onClick={() => set("model", m)}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="onb-label mt">
                <Tag /> Business category <span className="muted">(select all that apply)</span>
              </div>
              <div className="opt-grid c4">
                {CATEGORIES.map((c) => (
                  <button key={c} className={cn("opt", data.categories.includes(c) && "selected")} onClick={() => toggleCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="onb-actions">
                <button className="btn btn-blue" disabled={!data.model || data.categories.length === 0} onClick={next}>
                  Continue
                </button>
                <button className="onb-back" onClick={back}>← Back</button>
              </div>
            </>
          )}

          {/* ---------- step 5: connect tiktok ---------- */}
          {step === 5 && (
            <>
              <div className="onb-label">
                <Music2 /> Connect the account Blimely will post to
              </div>
              <div className="connect-card">
                <span className="cc-ico">
                  <Music2 />
                </span>
                <div className="cc-meta">
                  <b>Connect with TikTok</b>
                  <span>Secure OAuth, takes a few seconds</span>
                </div>
                <button className="btn btn-dark" style={{ padding: ".65rem 1.1rem" }} onClick={() => { set("tiktok", "@yourbrand"); next(); }}>
                  Connect
                </button>
              </div>
              <div className="onb-or">or</div>
              <button className="opt wide" onClick={() => { set("tiktok", ""); next(); }}>
                Let Blimely create a fresh account for the brand
              </button>

              <div className="onb-label mt">
                <Clock /> How often should Blimely post?
              </div>
              <div className="opt-grid">
                {CADENCE.map((c) => (
                  <button key={c} className={cn("opt", data.cadence === c && "selected")} onClick={() => set("cadence", c)}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="onb-actions">
                <button className="onb-back" onClick={back}>← Back</button>
              </div>
            </>
          )}

          {/* ---------- step 6: done ---------- */}
          {step === 6 && (
            <div className="onb-done">
              <div className="done-mark">
                <Check />
              </div>
              <h2>You're all set{data.name ? `, ${data.name.split(" ")[0]}` : ""}.</h2>
              <p>
                Blimely will build slideshows from{" "}
                <b>{data.mode === "website" && data.website !== "https://" ? data.website.replace(/^https?:\/\//, "") : data.company || "your business"}</b>{" "}
                and post to <b>{data.tiktok || "your new TikTok"}</b> on autopilot.
              </p>
              <div className="done-chips">
                <span className="chip"><Globe /> {data.mode === "website" ? "Website analyzed" : "Description added"}</span>
                <span className="chip"><Briefcase /> {data.role}</span>
                <span className="chip"><Clock /> {data.cadence}</span>
              </div>
              <button className="btn btn-blue btn-lg" onClick={finish}>
                Go to your dashboard <ChevronRight style={{ width: 18, height: 18 }} />
              </button>
            </div>
          )}
        </div>

        <div className="onb-dots">
          {STEPS.map((s, i) => (
            <i key={s.title} className={cn(i === step && "on", i < step && "done")} />
          ))}
        </div>
      </div>
    </div>
  );
}
