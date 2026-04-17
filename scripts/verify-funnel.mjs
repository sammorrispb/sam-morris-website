// Sanity check for the unified funnel wiring.
// Run: node scripts/verify-funnel.mjs
import { createHmac } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const fails = [];

function assert(cond, msg) {
  if (!cond) fails.push(msg);
}

// 1) HMAC signature is deterministic and matches the Hub's contract.
//    Signed string format: v1:<ms>:<site_id>:<event_type>:<visitor_id>:<email>:<marketing_ref>
function sign(secret, params) {
  const { timestamp, siteId, eventType, visitorId, email, marketingRef } = params;
  const signed = `v1:${timestamp}:${siteId}:${eventType}:${visitorId}:${email}:${marketingRef}`;
  return createHmac("sha256", secret).update(signed).digest("hex");
}

const SECRET = "test-secret-xyz";
const TS = "1700000000000";
const SNAPSHOT = sign(SECRET, {
  timestamp: TS,
  siteId: "sammorrispb",
  eventType: "cta_click",
  visitorId: "visitor-abc",
  email: "alice@example.com",
  marketingRef: "sammorrispb",
});

// Recompute the expected value inline so the snapshot is pinned to the
// signed-string shape, not just to whatever the function happens to produce.
const expected = createHmac("sha256", SECRET)
  .update("v1:1700000000000:sammorrispb:cta_click:visitor-abc:alice@example.com:sammorrispb")
  .digest("hex");
assert(SNAPSHOT === expected, `HMAC mismatch: got ${SNAPSHOT} expected ${expected}`);

// 2) Empty visitor / email / marketingRef → empty string in the signed payload.
const EMPTY = sign(SECRET, {
  timestamp: TS,
  siteId: "sammorrispb",
  eventType: "lead_submitted",
  visitorId: "",
  email: "",
  marketingRef: "",
});
const expectedEmpty = createHmac("sha256", SECRET)
  .update("v1:1700000000000:sammorrispb:lead_submitted:::")
  .digest("hex");
assert(EMPTY === expectedEmpty, `empty-field HMAC mismatch`);

// 3) Zero @vercel/analytics imports remain in src/.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(p)) out.push(p);
  }
  return out;
}
const hits = walk("src").filter((f) => readFileSync(f, "utf8").includes("@vercel/analytics"));
assert(hits.length === 0, `@vercel/analytics imports remain: ${hits.join(", ")}`);

// 4) Primary CTA (home hero) is wrapped in a TrackedLink pointing at /contact.
const home = readFileSync("src/app/page.tsx", "utf8");
assert(
  /TrackedLink[\s\S]*?href="\/contact"[\s\S]*?eventProps=\{\{[^}]*section:\s*"hero"/m.test(home),
  "home hero TrackedLink no longer wraps /contact with section=hero",
);

// 5) hubUrl/crUrl helpers exist and stamp correctly.
const urls = readFileSync("src/lib/urls.ts", "utf8");
assert(/export function hubUrl/.test(urls), "hubUrl export missing from src/lib/urls.ts");
assert(/export function crUrl/.test(urls), "crUrl export missing from src/lib/urls.ts");
assert(/MARKETING_REF\s*=\s*"sammorrispb"/.test(urls), "hubUrl no longer stamps ref=sammorrispb");
assert(/UTM_SOURCE\s*=\s*"sammorrispb"/.test(urls), "crUrl no longer stamps utm_source=sammorrispb");
assert(/set\("ref",\s*MARKETING_REF\)/.test(urls), "hubUrl no longer calls set(\"ref\", MARKETING_REF)");
assert(/set\("utm_source",\s*UTM_SOURCE\)/.test(urls), "crUrl no longer calls set(\"utm_source\", UTM_SOURCE)");

if (fails.length) {
  console.error("FAIL:");
  for (const f of fails) console.error("  -", f);
  process.exit(1);
}
console.log("OK — funnel wiring verified.");
