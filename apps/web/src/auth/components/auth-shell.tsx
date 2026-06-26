import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import "@/features/landing/landing.css";

/**
 * Themed wrapper for the auth pages: cloud-sky background + a brand link home,
 * with the auth card centered on top. Shares the landing page's visual language.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-body">
      <div className="auth-sky" aria-hidden="true">
        <svg viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="authsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a8c2e6" />
              <stop offset="34%" stopColor="#c6d8ef" />
              <stop offset="68%" stopColor="#e6eef7" />
              <stop offset="100%" stopColor="#f6f1e9" />
            </linearGradient>
            <radialGradient id="authhaze" cx="50%" cy="20%" r="75%">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <filter id="authclouds" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.0032 0.0062"
                numOctaves="4"
                seed="22"
                stitchTiles="stitch"
                result="t"
              />
              <feColorMatrix
                in="t"
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.55 1.3"
              />
            </filter>
          </defs>
          <rect width="1440" height="860" fill="url(#authsky)" />
          <rect width="1440" height="860" filter="url(#authclouds)" />
          <rect width="1440" height="860" fill="url(#authhaze)" />
        </svg>
      </div>

      <Link to="/" className="auth-home brand" aria-label="Blimely home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="28" height="28">
            <rect width="100" height="100" rx="28" fill="url(#authmark)" />
            <path
              d="M34 32h34M34 50h27M34 68h18"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="authmark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5aa6ff" />
                <stop offset="1" stopColor="#1566e6" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="brand-name">blimely</span>
      </Link>

      {children}
    </div>
  );
}

/** The blue rounded-square Blimely mark, used at the top of each auth card. */
export function AuthMark() {
  return (
    <div className="auth-mark">
      <svg viewBox="0 0 100 100" width="44" height="44">
        <rect width="100" height="100" rx="28" fill="url(#authcardmark)" />
        <path
          d="M34 32h34M34 50h27M34 68h18"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="authcardmark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5aa6ff" />
            <stop offset="1" stopColor="#1566e6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
