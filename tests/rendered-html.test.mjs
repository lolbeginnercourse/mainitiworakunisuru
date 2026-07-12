import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("serves the preparation page on production HTML routes", async () => {
  const pageUrl = new URL("../theaters/tennozu-galaxy-theatre/index.html", import.meta.url);
  const html = await readFile(pageUrl, "utf8");

  assert.match(html, /ただいま準備中です/);
  assert.match(html, /noindex,nofollow/);
  assert.doesNotMatch(html, /ANAホリデイ・イン東京ベイ/);
  assert.doesNotMatch(html, /東横INN品川港南口天王洲アイル/);
  assert.doesNotMatch(html, /PETALS TOKYO/);
  assert.doesNotMatch(html, /スーパーホテル品川/);
  assert.doesNotMatch(html, /京急EXイン/);
  assert.doesNotMatch(html, /ハートンホテル東品川/);
});
