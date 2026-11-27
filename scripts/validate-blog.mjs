// Checks every blog post for broken links, bad lengths, unknown tags and tools.
// Usage: node --experimental-strip-types scripts/validate-blog.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const load = async (dir, skip) => {
  const out = [];
  for (const f of readdirSync(join(root, dir))) {
    if (skip.includes(f) || !f.endsWith(".ts")) continue;
    const mod = await import(pathToFileURL(join(root, dir, f)).href);
    for (const list of Object.values(mod)) if (Array.isArray(list)) for (const x of list) out.push({ ...x, _file: f });
  }
  return out;
};

export const TAGS = [
  "open-source", "privacy", "pdf-editor", "alternatives", "comparison", "free-tools", "linux", "mac", "windows",
  "mobile", "chromebook", "forms", "e-signature", "compression", "conversion", "security", "metadata",
  "accessibility", "developers", "ai", "resume", "scanning", "pdf-basics", "self-hosting",
];

const toolIds = [...read("src/config/tools.ts").matchAll(/^    id: "([^"]+)"/gm)].map((m) => m[1]);
const toolHrefs = new Set([...read("src/config/tools.ts").matchAll(/^    href: "([^"]+)"/gm)].map((m) => m[1]));
const { toolVariants } = await import(pathToFileURL(join(root, "src/config/tool-variants.ts")).href);
const guideSlugs = new Set((await load("src/content/guides", ["types.ts", "index.ts"])).map((g) => g.slug));
const posts = await load("src/content/blog", ["types.ts", "index.ts"]);
const postSlugs = new Set(posts.map((p) => p.slug));

const staticRoutes = new Set([
  "/", "/tools", "/guides", "/blog", "/open-source", "/docs", "/docs/getting-started", "/docs/tools", "/docs/how-it-works",
  "/docs/privacy", "/docs/architecture", "/docs/development", "/docs/contributing", "/docs/security", "/docs/faq",
  "/docs/changelog", ...["ilovepdf", "smallpdf", "pdf24", "sejda", "adobe-acrobat", "stirling-pdf"].map((c) => `/${c}-alternative`),
  ...toolVariants.map((v) => `/${v.slug}`),
]);
const validHref = (h) =>
  /^https?:\/\//.test(h) || toolHrefs.has(h) || staticRoutes.has(h) ||
  (h.startsWith("/guides/") && guideSlugs.has(h.slice(8))) ||
  (h.startsWith("/blog/") && postSlugs.has(h.slice(6))) ||
  (h.startsWith("/blog/tag/") && TAGS.includes(h.slice(10))) ||
  (h.startsWith("/docs/tools/") && toolIds.includes(h.slice(12)));

const errors = [];
const warn = [];
const err = (p, m) => errors.push(`[${p._file}] ${p.slug}: ${m}`);
const words = (s) => s.trim().split(/\s+/).length;
const blockTexts = (b) => {
  switch (b.type) {
    case "steps": return b.items.flatMap((i) => [i.title, i.text]);
    case "list": return b.items;
    case "table": return [b.caption ?? "", ...b.headers, ...b.rows.flat()];
    case "proscons": return [b.title, ...b.pros, ...b.cons];
    default: return [b.text];
  }
};

const seen = new Set();
for (const p of posts) {
  if (seen.has(p.slug)) err(p, "duplicate slug");
  seen.add(p.slug);
  if (guideSlugs.has(p.slug)) err(p, "slug collides with a guide");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) err(p, "slug not kebab-case");
  // The layout appends " | KissThePDF" (13 chars); keep the full <title> within 70, where SEO tools flag it.
  if (p.seoTitle.length > 57) err(p, `seoTitle ${p.seoTitle.length} chars (>57; full title would exceed 70)`);
  if (/kissthepdf/i.test(p.seoTitle) && !/vs/i.test(p.seoTitle)) err(p, "seoTitle must not include the site name (template adds it)");
  if (p.description.length < 110 || p.description.length > 160) err(p, `description ${p.description.length} chars (want 110-160)`);
  const sw = words(p.summary);
  if (sw < 30 || sw > 80) err(p, `summary ${sw} words (want 40-70)`);
  if (p.coverLine.length > 70) err(p, `coverLine ${p.coverLine.length} chars (>70)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.published)) err(p, "bad published date");
  if (p.sections.length < 4) err(p, `only ${p.sections.length} sections`);
  if (p.faqs.length < 3) err(p, `only ${p.faqs.length} faqs`);
  if (p.tags.length < 2 || p.tags.length > 6) err(p, `${p.tags.length} tags (want 3-6)`);
  for (const t of p.tags) if (!TAGS.includes(t)) err(p, `unknown tag ${t}`);
  for (const t of p.relatedTools) if (!toolIds.includes(t)) err(p, `unknown relatedTool ${t}`);
  for (const r of p.relatedPosts) {
    if (r === p.slug) err(p, "relatedPosts includes itself");
    else if (!postSlugs.has(r)) warn.push(`${p.slug}: relatedPosts slug not written yet: ${r}`);
  }
  for (const s of p.sections) for (const b of s.blocks) {
    if (b.type === "table") for (const row of b.rows) if (row.length !== b.headers.length) err(p, `table row has ${row.length} cells, header has ${b.headers.length}`);
  }

  const texts = [p.title, p.summary, ...p.faqs.flatMap((f) => [f.question, f.answer])];
  let total = words(p.summary) + p.faqs.reduce((n, f) => n + words(f.question) + words(f.answer), 0);
  for (const s of p.sections) {
    texts.push(s.heading);
    for (const b of s.blocks) {
      const t = blockTexts(b);
      texts.push(...t);
      total += t.reduce((n, x) => n + (x ? words(x) : 0), 0);
    }
  }
  if (total < 900) warn.push(`${p.slug}: only ${total} words`);

  let internalLinks = 0;
  for (const t of texts) {
    for (const m of t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      if (m[2].startsWith("/blog/") && !m[2].startsWith("/blog/tag/") && !postSlugs.has(m[2].slice(6))) {
        warn.push(`${p.slug}: links to post not written yet ${m[2]}`);
        continue;
      }
      if (!validHref(m[2])) err(p, `broken link ${m[2]}`);
      if (m[2].startsWith("/")) internalLinks++;
    }
    const stripped = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "").replace(/\*\*[^*]+\*\*/g, "");
    if (/\]\(|\*\*/.test(stripped)) err(p, `malformed markup in: ${t.slice(0, 80)}`);
  }
  if (internalLinks < 4) warn.push(`${p.slug}: only ${internalLinks} internal links`);
}

console.log(`${posts.length} posts`);
for (const w of warn) console.log("warn:", w);
for (const e of errors) console.log("ERROR:", e);
process.exit(errors.length ? 1 : 0);
