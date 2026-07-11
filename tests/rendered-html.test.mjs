import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("generates the theater page without removed hotel data", async () => {
  const pageUrl = new URL("../theaters/tennozu-galaxy-theatre/index.html", import.meta.url);
  const html = await readFile(pageUrl, "utf8");

  assert.match(html, /id="mobile-conclusion-title"/);
  assert.match(html, /class="container mobile-toc mobile-only"/);
  assert.match(html, /ホテル情報を準備中です/);
  assert.doesNotMatch(html, /ANAホリデイ・イン東京ベイ/);
  assert.doesNotMatch(html, /東横INN品川港南口天王洲アイル/);
  assert.doesNotMatch(html, /PETALS TOKYO/);
  assert.doesNotMatch(html, /スーパーホテル品川/);
  assert.doesNotMatch(html, /京急EXイン/);
  assert.doesNotMatch(html, /ハートンホテル東品川/);
});
