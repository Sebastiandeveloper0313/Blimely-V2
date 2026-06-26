// Supabase Edge Function: analyze-website
//
// Reads a company's website (or a description) and extracts the brand
// understanding Blimely builds slideshows from. Calls the Anthropic API with
// structured outputs so the result is always valid JSON.
//
// Deploy:   supabase functions deploy analyze-website
// Secret:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// The web app calls this via supabase.functions.invoke("analyze-website").
// If it isn't deployed yet, the client falls back to an input-derived analysis.

import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface AnalyzeBody {
  url?: string;
  description?: string;
  company?: string;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "audience", "painPoints", "voice"],
  properties: {
    summary: { type: "string", description: "One sentence on what the business does." },
    audience: { type: "string", description: "One sentence on who the customer is." },
    painPoints: {
      type: "array",
      description: "Three short customer pain points this business solves.",
      items: { type: "string" },
    },
    voice: { type: "string", description: "One sentence describing the brand voice." },
  },
} as const;

/** Strip a fetched HTML page down to readable text. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { url, description, company }: AnalyzeBody = await req.json();

    let source = description?.trim() ?? "";
    if (url) {
      try {
        const page = await fetch(url, { headers: { "User-Agent": "BlimelyBot/1.0" } });
        if (page.ok) source = htmlToText(await page.text());
      } catch {
        // Unreachable site — fall back to whatever description we have.
      }
    }

    if (!source) {
      return new Response(JSON.stringify({ error: "No website text or description to analyze" }), {
        status: 422,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content:
            `You are analyzing a business so an AI tool can write short-form TikTok ` +
            `slideshows for it. Read the material below${company ? ` for "${company}"` : ""} ` +
            `and extract: a one-sentence summary of what they do, a one-sentence description ` +
            `of who it's for, three short and specific customer pain points they solve, and a ` +
            `one-sentence description of the brand voice. Be specific to THIS business. No ` +
            `generic filler.\n\n---\n${source}`,
        },
      ],
    });

    const text = message.content.find((b) => b.type === "text");
    const json = text && "text" in text ? JSON.parse(text.text) : null;

    return new Response(JSON.stringify(json), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
