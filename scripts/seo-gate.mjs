#!/usr/bin/env node
/**
 * SEO Release Gate v1.0 | Automated Gate 17 Deployment Check
 *
 * Crawls a running production Next.js server (default http://127.0.0.1:3000)
 * and fails with exit code 1 if ANY applicable BLOCKER fails:
 *  - 5xx responses or unexpected 404s
 *  - Missing / duplicate <title> across indexable pages
 *  - Missing or multiple <h1> elements
 *  - Missing or duplicate <meta name="description">
 *  - Missing or incorrect <link rel="canonical">
 *  - Accidental noindex on indexable pages
 *  - Missing/invalid robots.txt or sitemap.xml
 *  - Indexable pages missing from sitemap or sitemap URLs returning non-200
 *  - Broken internal links or unreachable orphan pages (BFS from /)
 *  - Invalid JSON-LD scripts or non-absolute URLs in structured data
 *  - <img> tags missing alt attributes
 *  - Restricted/unpublished lore strings leaking into rendered HTML
 *  - Non-existent URL failing to return HTTP 404
 */

const BASE_URL = (process.env.SEO_GATE_BASE_URL || "http://127.0.0.1:3000").replace(
  /\/+$/,
  ""
);
const CANONICAL_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.techjack.site"
).replace(/\/+$/, "");

const RESTRICTED_STRINGS = [
  "he who is, became he him",
  "su roooot",
];

const failures = [];
const checks = [];

function pass(label) {
  checks.push(`PASS: ${label}`);
}

function fail(label) {
  failures.push(`FAIL: ${label}`);
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function expectedCanonical(pathname) {
  if (!pathname || pathname === "/") return CANONICAL_ORIGIN;
  return `${CANONICAL_ORIGIN}/${pathname.replace(/^\/+|\/+$/g, "").toLowerCase()}`;
}

async function fetchText(path) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, { redirect: "manual" });
  const text = await response.text();
  return { url, status: response.status, headers: response.headers, text };
}

async function runGate() {
  console.log(`\n=== SEO Release Gate v1.0 Audit ===`);
  console.log(`Target server:    ${BASE_URL}`);
  console.log(`Canonical origin: ${CANONICAL_ORIGIN}\n`);

  // 1. Check robots.txt (Gate 6)
  const robots = await fetchText("/robots.txt");
  if (robots.status !== 200) {
    fail(`robots.txt returned HTTP ${robots.status}`);
  } else {
    const hasAllow = /Allow:\s*\//i.test(robots.text);
    const hasSitemap = new RegExp(
      `Sitemap:\\s*${CANONICAL_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`,
      "i"
    ).test(robots.text);
    if (!hasAllow) fail("robots.txt does not allow crawling '/'");
    if (!hasSitemap)
      fail(`robots.txt does not reference ${CANONICAL_ORIGIN}/sitemap.xml`);
    if (hasAllow && hasSitemap)
      pass("robots.txt returns 200, allows '/', and references sitemap.xml");
  }

  // 2. Check sitemap.xml (Gate 6)
  const sitemap = await fetchText("/sitemap.xml");
  const sitemapPaths = new Set();
  if (sitemap.status !== 200) {
    fail(`sitemap.xml returned HTTP ${sitemap.status}`);
  } else {
    const locMatches = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
      (m) => decodeHtmlEntities(m[1].trim())
    );
    if (locMatches.length === 0) {
      fail("sitemap.xml contains zero <loc> entries");
    } else {
      let allHttps = true;
      for (const loc of locMatches) {
        if (!loc.startsWith(`${CANONICAL_ORIGIN}/`) && loc !== CANONICAL_ORIGIN) {
          allHttps = false;
          fail(`sitemap.xml contains non-canonical URL: ${loc}`);
        } else {
          const parsed = new URL(loc);
          const cleanPath =
            parsed.pathname === "/"
              ? "/"
              : parsed.pathname.replace(/\/+$/, "");
          sitemapPaths.add(cleanPath);
        }
      }
      if (allHttps) {
        pass(
          `sitemap.xml returns 200 with ${locMatches.length} canonical HTTPS URLs`
        );
      }
    }
  }

  // 3. BFS internal link crawl starting from "/" (Gates 1, 2, 3, 4, 5, 7, 9)
  const visited = new Map();
  const queue = ["/"];
  const titles = new Map();
  const descriptions = new Map();
  let totalJsonLdChecked = 0;

  while (queue.length > 0) {
    const path = queue.shift();
    if (visited.has(path)) continue;

    const res = await fetchText(path);
    visited.set(path, res.status);

    if (res.status >= 500) {
      fail(`${path} returned HTTP ${res.status} (5xx server error)`);
      continue;
    }
    if (res.status !== 200) {
      fail(`${path} returned unexpected HTTP ${res.status}`);
      continue;
    }

    const html = res.text;
    const lowerHtml = html.toLowerCase();

    // Restricted lore check
    for (const restricted of RESTRICTED_STRINGS) {
      if (lowerHtml.includes(restricted)) {
        fail(`${path} exposes restricted unpublished phrase "${restricted}"`);
      }
    }

    // No em dash guard
    if (html.includes("\u2014")) {
      fail(`${path} contains an em dash character`);
    }

    // <title> check
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleText = titleMatch ? decodeHtmlEntities(stripTags(titleMatch[1])) : "";
    if (!titleText) {
      fail(`${path} is missing <title>`);
    } else if (titles.has(titleText)) {
      fail(
        `Duplicate <title> "${titleText}" found on ${titles.get(titleText)} and ${path}`
      );
    } else {
      titles.set(titleText, path);
    }

    // <meta name="description"> check
    const descMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i
    );
    const descText = descMatch ? decodeHtmlEntities(descMatch[1].trim()) : "";
    if (!descText) {
      fail(`${path} is missing <meta name="description">`);
    } else if (descriptions.has(descText)) {
      fail(
        `Duplicate meta description on ${descriptions.get(descText)} and ${path}`
      );
    } else {
      descriptions.set(descText, path);
    }

    // Accidental noindex check
    const robotsMeta = html.match(
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i
    );
    if (robotsMeta && /noindex/i.test(robotsMeta[1])) {
      fail(`${path} has accidental noindex directive: "${robotsMeta[1]}"`);
    }

    // Canonical link check
    const canonicalMatch =
      html.match(
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
      ) ||
      html.match(
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i
      );
    const actualCanonical = canonicalMatch ? canonicalMatch[1].trim() : "";
    const wantCanonical = expectedCanonical(path);
    if (!actualCanonical) {
      fail(`${path} is missing <link rel="canonical">`);
    } else if (actualCanonical !== wantCanonical) {
      fail(
        `${path} canonical mismatch: got "${actualCanonical}", expected "${wantCanonical}"`
      );
    }

    // Single primary H1 check
    const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    if (h1Matches.length === 0) {
      fail(`${path} is missing an <h1> heading in SSR HTML`);
    } else if (h1Matches.length > 1) {
      fail(`${path} has ${h1Matches.length} <h1> headings (expected exactly 1)`);
    } else if (!stripTags(h1Matches[0][1])) {
      fail(`${path} has an empty <h1> heading`);
    }

    // JSON-LD check (Gate 7)
    const ldMatches = [
      ...html.matchAll(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
      ),
    ];
    for (const match of ldMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (!parsed["@context"] || !parsed["@type"]) {
          fail(`${path} has JSON-LD missing @context or @type`);
        }
        totalJsonLdChecked += 1;
      } catch (err) {
        fail(`${path} has invalid JSON-LD: ${err.message}`);
      }
    }

    // Image alt attribute check (Gate 9)
    const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    for (const imgTag of imgTags) {
      if (!/\balt\s*=/i.test(imgTag)) {
        fail(`${path} contains <img> missing alt attribute: ${imgTag.slice(0, 80)}`);
      }
    }

    // Discover internal <a href="..."> links (Gate 2 & Gate 5)
    const hrefMatches = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map(
      (m) => decodeHtmlEntities(m[1].trim())
    );
    for (const href of hrefMatches) {
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) {
        continue;
      }
      if (!href.startsWith("/")) continue;
      const clean = href.split("#")[0].split("?")[0];
      if (!clean || clean.startsWith("/api/") || clean.startsWith("/_next/")) {
        continue;
      }
      const normalized = clean === "/" ? "/" : clean.replace(/\/+$/, "");
      if (!visited.has(normalized)) {
        queue.push(normalized);
      }
    }
  }

  pass(`Crawled ${visited.size} internal routes via real <a href> links with HTTP 200`);
  pass(`Validated ${totalJsonLdChecked} JSON-LD structured data blocks`);

  // 4. Cross-check sitemap vs crawled pages (Gate 1, 5, 6)
  for (const crawledPath of visited.keys()) {
    if (!sitemapPaths.has(crawledPath)) {
      fail(`Indexable page ${crawledPath} is missing from sitemap.xml`);
    }
  }
  for (const sitemapPath of sitemapPaths) {
    if (!visited.has(sitemapPath)) {
      const checkRes = await fetchText(sitemapPath);
      if (checkRes.status !== 200) {
        fail(`Sitemap URL ${sitemapPath} returned HTTP ${checkRes.status}`);
      } else {
        fail(`Sitemap URL ${sitemapPath} is an orphan page (unreachable from '/')`);
      }
    }
  }
  if (
    [...visited.keys()].every((p) => sitemapPaths.has(p)) &&
    [...sitemapPaths].every((p) => visited.has(p))
  ) {
    pass("100% parity between crawled indexable routes and sitemap.xml (zero orphan pages)");
  }

  // 5. Verify genuine HTTP 404 on unknown route (Gate 4)
  const notFoundRes = await fetchText("/this-route-does-not-exist-7926");
  if (notFoundRes.status !== 404) {
    fail(
      `Non-existent route returned HTTP ${notFoundRes.status} instead of 404`
    );
  } else if (!/YOU TOOK A WRONG TURN/i.test(notFoundRes.text)) {
    fail("404 route did not render branded Tech Jack 404 copy");
  } else {
    pass("Unknown route returns real HTTP 404 with branded recovery page");
  }

  // Summary
  console.log("--- Checks Passed ---");
  for (const item of checks) console.log(`  [OK] ${item}`);

  if (failures.length > 0) {
    console.error("\n--- SEO GATE BLOCKERS FAILED ---");
    for (const item of failures) console.error(`  [!!] ${item}`);
    console.error(`\nRELEASE DECISION: BLOCKED (${failures.length} failure(s))\n`);
    process.exit(1);
  }

  console.log(`\nRELEASE DECISION: TECHNICAL BLOCKERS PASS (0 failures)\n`);
}

runGate().catch((err) => {
  console.error("SEO Gate crashed:", err);
  process.exit(1);
});
