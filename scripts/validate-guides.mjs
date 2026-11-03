// Checks every guide for broken links, bad lengths and missing tools.
// Usage: node --experimental-strip-types scripts/validate-guides.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const toolIds = [...read("src/config/tools.ts").matchAll(/^    id: "([^"]+)"/gm)].map((m) => m[1]);
const toolHrefs = new Set([...read("src/config/tools.ts").matchAll(/^    href: "([^"]+)"/gm)].map((m) => m[1]));
const variantFile = "src/config/tool-variants.ts";
const variantSlugs = existsSync(join(root, variantFile))
  ? [...read(variantFile).matchAll(/^    slug: "([^"]+)"/gm)].map((m) => m[1])
  : [];

const guideDir = join(root, "src/content/guides");
const guides = [];
for (const f of readdirSync(guideDir)) {
  if (["types.ts", "index.ts"].includes(f) || !f.endsWith(".ts")) continue;
  const mod = await import(pathToFileURL(join(guideDir, f)).href);
  for (const list of Object.values(mod)) for (const g of list) guides.push({ ...g, _file: f });
}

const slugs = new Set(guides.map((g) => g.slug));
const staticRoutes = new Set([
  "/", "/tools", "/guides", "/open-source", "/docs", "/docs/getting-started", "/docs/tools", "/docs/how-it-works",
  "/docs/privacy", "/docs/architecture", "/docs/development", "/docs/contributing", "/docs/security", "/docs/faq",
  "/docs/changelog", ...["ilovepdf", "smallpdf", "pdf24", "sejda", "adobe-acrobat", "stirling-pdf"].map((c) => `/${c}-alternative`),
  ...variantSlugs.map((s) => `/${s}`),
]);
const validHref = (h) =>
  /^https?:\/\//.test(h) || toolHrefs.has(h) || staticRoutes.has(h) ||
  (h.startsWith("/guides/") && slugs.has(h.slice(8))) ||
  (h.startsWith("/docs/tools/") && toolIds.includes(h.slice(12)));

const errors = [];
const warn = [];
const err = (g, m) => errors.push(`[${g._file}] ${g.slug}: ${m}`);
const words = (s) => s.trim().split(/\s+/).length;

const seen = new Set();
const toolsCovered = new Map();
for (const g of guides) {
  if (seen.has(g.slug)) err(g, "duplicate slug");
  seen.add(g.slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug)) err(g, "slug not kebab-case");
  if (!toolIds.includes(g.toolId)) err(g, `unknown toolId ${g.toolId}`);
  if (toolsCovered.has(g.toolId)) err(g, `toolId ${g.toolId} already covered by ${toolsCovered.get(g.toolId)}`);
  toolsCovered.set(g.toolId, g.slug);
  if (g.seoTitle.length > 60) err(g, `seoTitle ${g.seoTitle.length} chars (>60)`);
  if (/kissthepdf/i.test(g.seoTitle)) err(g, "seoTitle must not include the site name (template adds it)");
  if (g.description.length < 110 || g.description.length > 160) err(g, `description ${g.description.length} chars (want 110-160)`);
  const sw = words(g.summary);
  if (sw < 30 || sw > 75) err(g, `summary ${sw} words (want 30-75)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.published)) err(g, "bad published date");
  if (g.sections.length < 4) err(g, `only ${g.sections.length} sections`);
  if (g.faqs.length < 3) err(g, `only ${g.faqs.length} faqs`);
  for (const r of g.relatedGuides) {
    if (r === g.slug) err(g, "relatedGuides includes itself");
    else if (!slugs.has(r)) err(g, `relatedGuides: unknown slug ${r}`);
  }

  const texts = [g.title, g.summary, ...g.faqs.flatMap((f) => [f.question, f.answer])];
  let total = words(g.summary);
  for (const s of g.sections) {
    texts.push(s.heading);
    for (const b of s.blocks) {
      const t = b.type === "steps" ? b.items.flatMap((i) => [i.title, i.text]) : b.type === "list" ? b.items : [b.text];
      texts.push(...t);
      total += t.reduce((n, x) => n + words(x), 0);
    }
  }
  total += g.faqs.reduce((n, f) => n + words(f.question) + words(f.answer), 0);
  if (total < 450) warn.push(`${g.slug}: only ${total} words`);

  let internalLinks = 0;
  for (const t of texts) {
    for (const m of t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      if (!validHref(m[2])) err(g, `broken link ${m[2]}`);
      if (m[2].startsWith("/")) internalLinks++;
    }
    const stripped = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "").replace(/\*\*[^*]+\*\*/g, "");
    if (/\[|\]\(|\*\*/.test(stripped)) err(g, `malformed markup in: ${t.slice(0, 80)}`);
  }
  const toolHref = [...read("src/config/tools.ts").matchAll(new RegExp(`id: "${g.toolId}",[\\s\\S]*?href: "([^"]+)"`, "g"))][0]?.[1];
  if (toolHref && !texts.some((t) => t.includes(`](${toolHref})`))) err(g, `never links to its own tool ${toolHref}`);
  if (internalLinks < 4) warn.push(`${g.slug}: only ${internalLinks} internal links`);
}

const NO_GUIDE = new Set(["bookmarks"]); // tool not implemented
const missing = toolIds.filter((id) => !toolsCovered.has(id) && !NO_GUIDE.has(id));
console.log(`${guides.length} guides, ${toolIds.length} tools, ${missing.length} tools without a guide`);
if (missing.length) console.log("  missing:", missing.join(", "));
for (const w of warn) console.log("warn:", w);
for (const e of errors) console.log("ERROR:", e);
process.exit(errors.length ? 1 : 0);
