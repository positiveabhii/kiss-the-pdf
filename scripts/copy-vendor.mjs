// Copies browser-side engines that must be served as static files (not
// bundled) into public/vendor. Runs before `dev` and `build`.
//
// qpdf-wasm is an Emscripten build: a UMD script that defines a global
// `Module` factory plus a .wasm binary it fetches at runtime. Bundling it
// through Turbopack would pull in its Node branches (fs/path), so it is
// loaded with a <script> tag on demand instead — only by the tools that
// need it (encrypt / decrypt / permissions).
import { cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const qpdfDist = dirname(require.resolve("@neslinesli93/qpdf-wasm/dist/qpdf.js"));
const out = join(root, "public", "vendor", "qpdf");
mkdirSync(out, { recursive: true });
for (const f of ["qpdf.js", "qpdf.wasm"]) cpSync(join(qpdfDist, f), join(out, f));
console.log("[copy-vendor] qpdf-wasm → public/vendor/qpdf");
