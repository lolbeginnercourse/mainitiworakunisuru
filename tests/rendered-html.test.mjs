import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("generates the mobile theater hotel guide structure", async () => {
  const pageUrl = new URL("../theaters/tennozu-galaxy-theatre/index.html", import.meta.url);
  const html = await readFile(pageUrl, "utf8");

  assert.match(html, /id="mobile-conclusion-title"/);
  assert.match(html, /class="container mobile-toc mobile-only"/);
  assert.match(html, /class="mobile-pick-list"/);
  assert.match(html, /class="comparison-mobile"/);
  assert.match(html, /終演後の戻りやすさ：戻りやすい/);
  assert.match(html, /ana-holiday-inn-tokyo-bay\.webp/);
  assert.doesNotMatch(html, /ana-holiday-inn-tokyo-bay\.jpg/);
});
