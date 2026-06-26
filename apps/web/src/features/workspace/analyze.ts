import { supabase } from "@/integrations/supabase/client";

import type { BrandAnalysis } from "./store";

export interface AnalyzeInput {
  mode: "website" | "description";
  website: string;
  description: string;
  company: string;
  model: string;
  categories: string[];
  role: string;
}

/**
 * Analyze a business into a brand understanding.
 *
 * Tries the `analyze-website` edge function (a real Claude read of the site).
 * If it isn't deployed yet — or the call fails — falls back to an analysis
 * derived from the onboarding answers so the brand surfaces are still
 * specific to the user's business rather than a hardcoded placeholder.
 */
export async function analyzeBrand(input: AnalyzeInput): Promise<BrandAnalysis> {
  try {
    const { data, error } = await supabase.functions.invoke<Omit<BrandAnalysis, "source">>(
      "analyze-website",
      {
        body: {
          url: input.mode === "website" ? input.website : undefined,
          description: input.mode === "description" ? input.description : undefined,
          company: input.company,
        },
      },
    );
    if (!error && data?.summary && Array.isArray(data.painPoints)) {
      return { ...data, source: "site" };
    }
  } catch {
    // Function not deployed / network error — fall through to local analysis.
  }
  return analysisFromInputs(input);
}

/** Best-effort analysis built from what the user told us during onboarding. */
export function analysisFromInputs(input: AnalyzeInput): BrandAnalysis {
  const name = input.company.trim() || "This business";
  const category = input.categories[0] ?? "business";
  const others = input.categories.slice(1).map((c) => c.toLowerCase());
  const isB2B = input.model === "B2B";

  const summary =
    `${name} is a ${input.model || ""} ${category} ` +
    `that helps its customers get results without the usual friction.`.replace(/\s+/g, " ");

  const audience = isB2B
    ? `Teams and operators evaluating ${category} tools who want something that just works.`
    : `People looking for a ${category} they can actually trust and stick with.`;

  const painPoints = [
    `Too many ${category} options that look the same, and none that fit`,
    "Wasting time on tools that overpromise and underdeliver",
    others.length
      ? `Juggling ${others.join(" and ")} separately instead of one thing that handles it`
      : "Hard to tell what is actually worth paying for",
  ];

  const voice =
    input.role === "Founder"
      ? "Direct, founder to founder, confident without the corporate filler."
      : "Clear, helpful, and human. Speaks like a person, not a brochure.";

  return { summary: summary.trim(), audience, painPoints, voice, source: "inputs" };
}
