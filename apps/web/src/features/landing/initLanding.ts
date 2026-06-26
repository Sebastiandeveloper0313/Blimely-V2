/**
 * Wires up the landing page interactions (hero phone slideshow, comparison
 * tabs, scroll reveals, cursor spotlight, magnetic buttons, number tickers).
 * Returns a cleanup function that detaches global listeners/observers.
 */
export function initLanding(root: HTMLElement): () => void {
  const observers: IntersectionObserver[] = [];
  const cleanups: Array<() => void> = [];

  /* ---- hero phone: auto-advancing slideshow ---- */
  const phoneText = root.querySelector<HTMLElement>(".ph-text");
  const phoneBars = Array.from(root.querySelectorAll<HTMLElement>(".ph-progress i"));
  if (phoneText && phoneBars.length) {
    const slides = [
      "3 reasons nobody<br><b>sees your product</b>",
      "You post<br><b>once a month</b>",
      "You're invisible<br><b>on TikTok</b>",
      "You quit before<br><b>it compounded</b>",
      "Fix all three.<br><b>On autopilot.</b>",
      "@yourbrand<br><b>posts daily now</b> →",
    ];
    let i = 0;
    const render = () => {
      phoneBars.forEach((b, idx) => b.classList.toggle("on", idx <= i));
      phoneText.style.opacity = "0";
      phoneText.style.transform = "translateY(8px)";
      setTimeout(() => {
        phoneText.innerHTML = slides[i] ?? "";
        phoneText.style.opacity = "1";
        phoneText.style.transform = "none";
      }, 220);
    };
    render();
    const timer = setInterval(() => {
      i = (i + 1) % slides.length;
      render();
    }, 2600);
    cleanups.push(() => clearInterval(timer));
  }

  /* ---- comparison tabs ---- */
  const tabs = Array.from(root.querySelectorAll<HTMLElement>(".cmp-tab"));
  if (tabs.length) {
    const copy: Record<string, { gpt: string; blimely: string; tag: string; file: string }> = {
      understand: {
        gpt: "You write the brief and guess your own angles and hooks.",
        blimely: "Reads your site and nails your audience and their pain points.",
        tag: "Knows your business",
        file: "Audience locked in",
      },
      generate: {
        gpt: "Hands you a pile of clips to caption and sort through yourself.",
        blimely: "Writes and designs swipeable slideshows in your brand voice.",
        tag: "Builds the slideshow",
        file: "On-brand, ready",
      },
      schedule: {
        gpt: "You drag each post into a calendar and pick every time slot.",
        blimely: "Fills your week and queues posts at the times that land best.",
        tag: "Fills your calendar",
        file: "Week queued",
      },
      post: {
        gpt: "Reminds you to post, then waits for you to actually do it.",
        blimely: "Publishes straight to your TikTok, on schedule, on its own.",
        tag: "Posts it for you",
        file: "Posted to TikTok",
      },
    };
    const gptLine = root.querySelector<HTMLElement>(".cmp-card.chatgpt .cmp-line");
    const blimelyLine = root.querySelector<HTMLElement>(".cmp-card.blimely .cmp-line");
    const crTag = root.querySelector<HTMLElement>(".cr-tag");
    const crFile = root.querySelector<HTMLElement>(".cr-file");
    const fade = [gptLine, blimelyLine, crTag, crFile];
    fade.forEach((el) => el && (el.style.transition = "opacity .18s ease"));
    tabs.forEach((tab) =>
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const d = copy[tab.dataset.cmp ?? ""];
        if (!d) return;
        fade.forEach((el) => el && (el.style.opacity = "0"));
        setTimeout(() => {
          if (gptLine) gptLine.textContent = d.gpt;
          if (blimelyLine) blimelyLine.textContent = d.blimely;
          if (crTag) crTag.textContent = d.tag;
          if (crFile) crFile.textContent = d.file;
          fade.forEach((el) => el && (el.style.opacity = "1"));
        }, 160);
      }),
    );
  }

  /* ---- scroll reveal ---- */
  const revealTargets = root.querySelectorAll<HTMLElement>(
    ".statement, .feat-card, .compare-title, .compare-sub, .cmp-tabs, .cmp-panels, .pro-copy, .pro-card, .how-card, .how-title, .trust-inner, .cta-card, .logos",
  );
  revealTargets.forEach((t) => t.classList.add("reveal"));
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.transitionDelay =
            el.classList.contains("feat-card") || el.classList.contains("how-card")
              ? `${(i % 3) * 80}ms`
              : "0ms";
          el.classList.add("in");
          revealIO.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  revealTargets.forEach((t) => revealIO.observe(t));
  observers.push(revealIO);

  /* ---- nav shadow on scroll ---- */
  const nav = root.querySelector<HTMLElement>(".nav");
  if (nav) {
    const onScroll = () => {
      const y = window.scrollY;
      nav.style.boxShadow =
        y > 20 ? "0 20px 50px -22px rgba(16,48,120,.5)" : "0 16px 40px -20px rgba(16,48,120,.35)";
      nav.style.background = y > 20 ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.72)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
  }

  /* ---- card spotlight ---- */
  root.querySelectorAll<HTMLElement>(".feat-card, .how-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  /* ---- magnetic buttons ---- */
  if (window.matchMedia("(hover: hover)").matches) {
    root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      const s = 0.22;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * s}px, ${y * s * 1.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---- number ticker ---- */
  const countEls = root.querySelectorAll<HTMLElement>(".count");
  if (countEls.length) {
    const run = (el: HTMLElement) => {
      const to = Number.parseFloat(el.dataset.to ?? "0");
      const dec = el.dataset.dec ? Number(el.dataset.dec) : 0;
      const pre = el.dataset.pre ?? "";
      const suf = el.dataset.suf ?? "";
      const dur = 1300;
      const start = performance.now();
      const tick = (now: number) => {
        let p = Math.min((now - start) / dur, 1);
        p = 1 - (1 - p) ** 3;
        const v = to * p;
        el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target as HTMLElement);
            countIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    countEls.forEach((el) => countIO.observe(el));
    observers.push(countIO);
  }

  return () => {
    observers.forEach((o) => o.disconnect());
    cleanups.forEach((fn) => fn());
  };
}
