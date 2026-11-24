"use client";

/**
 * Bring-your-own-key AI providers, called directly from the browser.
 *
 * There is no KissThePDF backend in this path: requests go from the user's
 * browser straight to the provider they chose, authenticated with their own
 * key. Claude uses the official Anthropic SDK; OpenAI and Gemini use their
 * public REST streaming endpoints.
 */

import Anthropic from "@anthropic-ai/sdk";

export type ProviderId = "anthropic" | "openai" | "gemini";

export const PROVIDERS: Record<
  ProviderId,
  { label: string; company: string; keyHint: string; keyUrl: string; defaultModel: string }
> = {
  anthropic: {
    label: "Claude",
    company: "Anthropic",
    keyHint: "sk-ant-…",
    keyUrl: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-opus-5-5",
  },
  openai: {
    label: "ChatGPT",
    company: "OpenAI",
    keyHint: "sk-…",
    keyUrl: "https://platform.openai.com/api-keys",
    // No safe hard-coded default: the model list is loaded from the user's account.
    defaultModel: "",
  },
  gemini: {
    label: "Gemini",
    company: "Google",
    keyHint: "AIza…",
    keyUrl: "https://aistudio.google.com/apikey",
    defaultModel: "",
  },
};

export interface ModelOption {
  id: string;
  label: string;
  /** Output-token cap, when the provider reports it. */
  maxOutput?: number;
}

/** A PDF prepared for the model: raw bytes for native PDF input, and page text as a fallback. */
export interface AiDocument {
  name: string;
  bytes: Uint8Array;
  pages: string[];
  /** Pages that yielded no text (likely scanned images). */
  emptyPages: number;
  /**
   * Original page numbers of `pages` when only some pages are in context.
   * `bytes` then holds just those pages, and citations use these numbers.
   */
  pageNumbers?: number[];
}

/** Original page number of the i-th page in a (possibly partial) document. */
const pageNo = (d: AiDocument, i: number) => d.pageNumbers?.[i] ?? i + 1;
const isSubset = (d: AiDocument) => Boolean(d.pageNumbers);
const subsetNote = (d: AiDocument) =>
  `"${d.name}" here contains only original pages ${d.pageNumbers!.join(", ")}, in that order. Cite those original page numbers.`;

export interface Turn {
  role: "user" | "assistant";
  text: string;
}

export interface StreamRequest {
  provider: ProviderId;
  apiKey: string;
  model: string;
  maxOutput?: number;
  system: string;
  documents: AiDocument[];
  /** Conversation so far; the documents are attached to the first user turn. */
  turns: Turn[];
  /** Text used to pick the most relevant pages when a document is too long to send whole. */
  focusQuery: string;
  /** Reasoning depth for models that support it (Claude effort). */
  effort?: "low" | "medium" | "high";
  signal: AbortSignal;
  onText: (delta: string) => void;
}

export interface StreamResult {
  /** Shown under the answer, e.g. that only part of a long PDF was sent. */
  notices: string[];
}

export class AiError extends Error {
  /** A replacement model the provider named in its error, e.g. when a model was retired. */
  suggestedModel?: string;
  constructor(message: string, suggestedModel?: string) {
    super(message);
    this.suggestedModel = suggestedModel;
  }
}

/** "…use models/gemini-3.8-flash…" → "gemini-3.8-flash". */
function suggestedModelIn(detail: string): string | undefined {
  if (!/(no longer available|not found|deprecated|retired|discontinued|not supported)/i.test(detail)) return undefined;
  return /\buse\s+(?:the\s+)?(?:model\s+)?[`'"]?(?:models\/)?([a-z0-9][\w.-]*[a-z0-9])/i.exec(detail)?.[1];
}

/**
 * Newest first: `*-latest` aliases, then by version number (3.8 before 2.5),
 * stable before preview/experimental builds. Providers list retired models that
 * new accounts can no longer call, so the first entry is the safest default.
 */
function byNewest(a: string, b: string): number {
  const rank = (id: string) => {
    const v = /(\d+(?:\.\d+)?)/.exec(id.replace(/^(gpt|gemini|o)-?/, ""))?.[1];
    return {
      alias: /-latest$/.test(id) ? 0 : 1,
      version: v ? parseFloat(v) : 0,
      unstable: /(preview|exp|experimental|\d{4}-\d{2}-\d{2}|\d{2}-\d{2})/.test(id) ? 1 : 0,
    };
  };
  const ra = rank(a);
  const rb = rank(b);
  return ra.alias - rb.alias || rb.version - ra.version || ra.unstable - rb.unstable || a.localeCompare(b);
}

// ---------------------------------------------------------------------------
// Document payload helpers
// ---------------------------------------------------------------------------

/** Rough budget for document text sent as plain text (~150k tokens). */
const TEXT_BUDGET_CHARS = 600_000;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

const words = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];

/**
 * The document as "[Page N]"-tagged text. When it exceeds the budget, keep the
 * pages that best match `focusQuery` (plus the first pages for context) and
 * report it, rather than silently cutting the end off.
 */
function pagedText(doc: AiDocument, budget: number, focusQuery: string): { text: string; notice?: string } {
  const tagged = doc.pages.map((t, i) => `[Page ${pageNo(doc, i)}]\n${t.trim()}`);
  const total = tagged.reduce((n, p) => n + p.length, 0);
  if (total <= budget) return { text: tagged.join("\n\n") };

  const query = new Set(words(focusQuery));
  const scored = tagged.map((p, i) => {
    let score = i < 2 ? 1e6 - i : 0; // always keep the opening pages
    if (query.size) for (const w of words(p)) if (query.has(w)) score++;
    return { i, p, score };
  });
  const keep = new Set<number>();
  let used = 0;
  for (const s of [...scored].sort((a, b) => b.score - a.score || a.i - b.i)) {
    if (used + s.p.length > budget) continue;
    keep.add(s.i);
    used += s.p.length;
  }
  const text = tagged.filter((_, i) => keep.has(i)).join("\n\n");
  return {
    text,
    notice: `"${doc.name}" is too long to send whole, so ${keep.size} of ${doc.pages.length} pages in context were sent (the opening pages plus those most relevant to your request).`,
  };
}

// ---------------------------------------------------------------------------
// Model lists
// ---------------------------------------------------------------------------

export async function listModels(provider: ProviderId, apiKey: string): Promise<ModelOption[]> {
  if (provider === "anthropic") {
    const client = anthropicClient(apiKey);
    const out: ModelOption[] = [];
    try {
      for await (const m of client.models.list()) {
        out.push({ id: m.id, label: m.display_name || m.id, maxOutput: m.max_tokens ?? undefined });
      }
    } catch (e) {
      throw anthropicError(e);
    }
    return out;
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw await restError(res, "OpenAI");
    const data = (await res.json()) as { data: { id: string }[] };
    return data.data
      .map((m) => m.id)
      .filter((id) => /^(gpt|o\d|chatgpt)/.test(id) && !/(audio|realtime|tts|transcribe|image|search|embedding|instruct|moderation)/.test(id))
      .sort(byNewest)
      .map((id) => ({ id, label: id }));
  }

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
    headers: { "x-goog-api-key": apiKey },
  });
  if (!res.ok) throw await restError(res, "Gemini");
  const data = (await res.json()) as {
    models: { name: string; displayName?: string; outputTokenLimit?: number; supportedGenerationMethods?: string[] }[];
  };
  return data.models
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent") && /gemini/.test(m.name) && !/(embedding|image|tts|audio)/.test(m.name))
    .map((m) => ({ id: m.name.replace(/^models\//, ""), label: m.displayName || m.name, maxOutput: m.outputTokenLimit }))
    .sort((a, b) => byNewest(a.id, b.id));
}

// ---------------------------------------------------------------------------
// Streaming
// ---------------------------------------------------------------------------

export function streamAnswer(req: StreamRequest): Promise<StreamResult> {
  if (!req.apiKey.trim()) throw new AiError("Add your API key first.");
  if (!req.model.trim()) throw new AiError("Choose a model first.");
  if (req.provider === "anthropic") return streamAnthropic(req);
  if (req.provider === "openai") return streamOpenAi(req);
  return streamGemini(req);
}

// --- Claude -----------------------------------------------------------------

function anthropicClient(apiKey: string) {
  // Bring-your-own-key in the browser: the key belongs to the user and is only
  // ever sent to api.anthropic.com, so client-side use is intended here.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
}

/** Models that accept server-side refusal fallbacks (`fallbacks: "default"`). */
const FALLBACK_MODELS = /^claude-(fable-5-[12]|opus-5-5|opus-5|sonnet-5-5)$/;
/** Models that accept `output_config.effort`. */
const EFFORT_MODELS = /^claude-((fable|mythos|opus|sonnet|haiku)-5|opus-4-[5-8]|sonnet-4-6)/;
/** Native PDF input is billed per page as text + image; above this, plain text is cheaper and safer. */
const CLAUDE_NATIVE_PDF_MAX_PAGES = 100;
const CLAUDE_NATIVE_PDF_MAX_BYTES = 30 * 1024 * 1024;

function anthropicError(e: unknown): AiError {
  if (e instanceof Anthropic.AuthenticationError) return new AiError("Anthropic rejected the API key. Check it and try again.");
  if (e instanceof Anthropic.PermissionDeniedError) return new AiError("This API key doesn't have access to that model.");
  if (e instanceof Anthropic.NotFoundError) return new AiError(`That model isn't available: ${e.message}`, suggestedModelIn(e.message));
  if (e instanceof Anthropic.RateLimitError) return new AiError("Rate limit reached on your Anthropic account. Wait a moment and retry.");
  if (e instanceof Anthropic.BadRequestError) return new AiError(`Anthropic couldn't process the request: ${e.message}`);
  if (e instanceof Anthropic.APIError) return new AiError(`Anthropic error${e.status ? ` ${e.status}` : ""}: ${e.message}`);
  return new AiError(e instanceof Error ? e.message : "Couldn't reach Anthropic.");
}

async function streamAnthropic(req: StreamRequest): Promise<StreamResult> {
  const notices: string[] = [];
  const docBlocks: Anthropic.Beta.BetaContentBlockParam[] = req.documents.map((d) => {
    const scanned = d.emptyPages === d.pages.length;
    // A page subset goes as tagged text (exact original page numbers) unless it has no text at all.
    const native =
      d.bytes.length <= CLAUDE_NATIVE_PDF_MAX_BYTES &&
      (isSubset(d) ? scanned : d.pages.length <= CLAUDE_NATIVE_PDF_MAX_PAGES || scanned);
    if (native) {
      return {
        type: "document",
        title: d.name,
        ...(isSubset(d) ? { context: subsetNote(d) } : {}),
        source: { type: "base64", media_type: "application/pdf", data: toBase64(d.bytes) },
      };
    }
    const { text, notice } = pagedText(d, TEXT_BUDGET_CHARS, req.focusQuery);
    if (notice) notices.push(notice);
    return { type: "document", title: d.name, source: { type: "text", media_type: "text/plain", data: text } };
  });

  const messages: Anthropic.Beta.BetaMessageParam[] = req.turns.map((t, i) =>
    i === 0 && t.role === "user"
      ? { role: "user", content: [...docBlocks, { type: "text", text: t.text }] }
      : { role: t.role, content: t.text }
  );

  const useFallbacks = FALLBACK_MODELS.test(req.model);
  const client = anthropicClient(req.apiKey);
  try {
    const stream = client.beta.messages.stream(
      {
        model: req.model,
        max_tokens: Math.min(64000, req.maxOutput ?? 64000),
        system: req.system,
        // Cache the document prefix so follow-up questions don't pay for it again.
        cache_control: { type: "ephemeral" },
        messages,
        ...(req.effort && EFFORT_MODELS.test(req.model) ? { output_config: { effort: req.effort } } : {}),
        ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      },
      { signal: req.signal }
    );
    stream.on("text", (delta) => req.onText(delta));
    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      notices.push("Claude declined to answer this request.");
    } else if (final.stop_reason === "max_tokens") {
      notices.push("The answer hit the model's length limit and was cut off.");
    }
    return { notices };
  } catch (e) {
    if (req.signal.aborted) return { notices };
    throw anthropicError(e);
  }
}

// --- OpenAI -----------------------------------------------------------------

async function restError(res: Response, name: string): Promise<AiError> {
  let detail = "";
  try {
    const body = await res.json();
    detail = body?.error?.message ?? "";
  } catch {
    /* not JSON */
  }
  if (res.status === 401 || res.status === 403) return new AiError(`${name} rejected the API key${detail ? `: ${detail}` : "."}`);
  if (res.status === 429) return new AiError(`${name} rate limit or quota reached${detail ? `: ${detail}` : "."}`);
  const suggestion = suggestedModelIn(detail);
  if (res.status === 404 || suggestion) {
    return new AiError(`${name} can't use this model${detail ? `: ${detail}` : "."}`, suggestion);
  }
  return new AiError(`${name} error ${res.status}${detail ? `: ${detail}` : ""}`);
}

/** Read a `text/event-stream` body and hand each `data:` payload to `onData`. */
async function readSse(res: Response, onData: (data: string) => void) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trimEnd();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) onData(line.slice(5).trim());
    }
  }
}

async function streamOpenAi(req: StreamRequest): Promise<StreamResult> {
  const notices: string[] = [];
  const parts = req.documents.map((d) => {
    const { text, notice } = pagedText(d, TEXT_BUDGET_CHARS, req.focusQuery);
    if (notice) notices.push(notice);
    if (d.emptyPages === d.pages.length) {
      notices.push(`"${d.name}" has no extractable text (it may be scanned), so ChatGPT could only see an empty document. Claude or Gemini can read scanned PDFs directly.`);
    }
    return `<document name="${d.name}">\n${text}\n</document>`;
  });

  const messages = [
    { role: "system", content: req.system },
    ...req.turns.map((t, i) => ({
      role: t.role,
      content: i === 0 && t.role === "user" ? `${parts.join("\n\n")}\n\n${t.text}` : t.text,
    })),
  ];

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${req.apiKey}` },
      body: JSON.stringify({ model: req.model, stream: true, messages }),
      signal: req.signal,
    });
  } catch (e) {
    if (req.signal.aborted) return { notices };
    throw new AiError(e instanceof Error ? e.message : "Couldn't reach OpenAI.");
  }
  if (!res.ok) throw await restError(res, "OpenAI");

  let finish: string | null = null;
  try {
    await readSse(res, (data) => {
      if (data === "[DONE]") return;
      const json = JSON.parse(data) as { choices?: { delta?: { content?: string }; finish_reason?: string | null }[] };
      const choice = json.choices?.[0];
      if (choice?.delta?.content) req.onText(choice.delta.content);
      if (choice?.finish_reason) finish = choice.finish_reason;
    });
  } catch (e) {
    if (req.signal.aborted) return { notices };
    throw new AiError(e instanceof Error ? e.message : "The OpenAI stream was interrupted.");
  }
  if (finish === "length") notices.push("The answer hit the model's length limit and was cut off.");
  if (finish === "content_filter") notices.push("OpenAI's content filter stopped this answer.");
  return { notices };
}

// --- Gemini -----------------------------------------------------------------

/** Gemini inline data is limited by total request size (~20 MB). */
const GEMINI_INLINE_MAX_BYTES = 14 * 1024 * 1024;

async function streamGemini(req: StreamRequest): Promise<StreamResult> {
  const notices: string[] = [];
  const docParts = req.documents.map((d) => {
    const scanned = d.emptyPages === d.pages.length;
    if (d.bytes.length <= GEMINI_INLINE_MAX_BYTES && (!isSubset(d) || scanned)) {
      return { inlineData: { mimeType: "application/pdf", data: toBase64(d.bytes) } };
    }
    const { text, notice } = pagedText(d, TEXT_BUDGET_CHARS, req.focusQuery);
    if (notice) notices.push(notice);
    return { text: `<document name="${d.name}">\n${text}\n</document>` };
  });

  const contents = req.turns.map((t, i) => ({
    role: t.role === "assistant" ? "model" : "user",
    parts:
      i === 0 && t.role === "user"
        ? [
            ...req.documents.map((d) => ({ text: isSubset(d) ? subsetNote(d) : `Document: ${d.name}` })),
            ...docParts,
            { text: t.text },
          ]
        : [{ text: t.text }],
  }));

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(req.model)}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": req.apiKey },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: req.system }] }, contents }),
        signal: req.signal,
      }
    );
  } catch (e) {
    if (req.signal.aborted) return { notices };
    throw new AiError(e instanceof Error ? e.message : "Couldn't reach Gemini.");
  }
  if (!res.ok) throw await restError(res, "Gemini");

  let finish: string | undefined;
  try {
    await readSse(res, (data) => {
      const json = JSON.parse(data) as {
        candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
        promptFeedback?: { blockReason?: string };
      };
      if (json.promptFeedback?.blockReason) notices.push(`Gemini blocked this request (${json.promptFeedback.blockReason}).`);
      const cand = json.candidates?.[0];
      for (const p of cand?.content?.parts ?? []) if (p.text && !p.thought) req.onText(p.text);
      if (cand?.finishReason) finish = cand.finishReason;
    });
  } catch (e) {
    if (req.signal.aborted) return { notices };
    throw new AiError(e instanceof Error ? e.message : "The Gemini stream was interrupted.");
  }
  if (finish === "MAX_TOKENS") notices.push("The answer hit the model's length limit and was cut off.");
  if (finish === "SAFETY") notices.push("Gemini's safety filter stopped this answer.");
  return { notices };
}
