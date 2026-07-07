const vercelConfig = {
  api: {
    bodyParser: false
  }
};

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const ANALYSIS_PAUSED = false;

async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (ANALYSIS_PAUSED) {
    return res.status(503).json({
      error: "Menu scanning is temporarily paused before launch.",
      launchPaused: true
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Analysis API is not configured." });
  }

  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart form data." });
    }

    const body = await readRequestBody(req, MAX_IMAGE_BYTES + 1024 * 1024);
    const form = parseMultipart(body, contentType);
    const image = form.files.image;
    if (!image) {
      return res.status(400).json({ error: "Image file is required." });
    }
    if (!ALLOWED_MIME.has(image.contentType)) {
      return res.status(400).json({ error: "Use a JPEG, PNG, or WebP image." });
    }
    if (image.data.length > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: "Image is too large. Use a clearer cropped photo under 6MB." });
    }

    const profile = safeJson(form.fields.profile, {});
    const imageMeta = safeJson(form.fields.imageMeta, {});
    const result = await analyzeWithGemini({ image, profile, imageMeta, apiKey });
    return res.status(200).json(normalizeForClient(result));
  } catch (error) {
    const message = error?.clientMessage || "Menu analysis failed. Try a clearer photo.";
    return res.status(error?.statusCode || 500).json({ error: message });
  }
}

async function analyzeWithGemini({ image, profile, imageMeta, apiKey }) {
  const prompt = buildPrompt(profile, imageMeta);
  const payload = {
    model: GEMINI_MODEL,
    input: [
      { type: "text", text: prompt },
      {
        type: "image",
        data: image.data.toString("base64"),
        mime_type: image.contentType
      }
    ],
    response_format: {
      type: "text",
      mime_type: "application/json"
    },
    generation_config: {
      temperature: 0.2,
      max_output_tokens: 8192
    }
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await readGeminiError(response);
    console.error("Gemini request failed", {
      status: response.status,
      model: GEMINI_MODEL,
      message: details
    });
    throw Object.assign(new Error("Gemini request failed"), {
      statusCode: response.status === 429 ? 429 : 502,
      clientMessage: geminiClientMessage(response.status, details)
    });
  }

  const json = await response.json();
  const text = extractInteractionText(json);
  if (!text) {
    throw Object.assign(new Error("Gemini returned no text"), {
      statusCode: 502,
      clientMessage: "No readable result came back. Try a clearer photo."
    });
  }

  try {
    return parseModelJson(text);
  } catch {
    throw Object.assign(new Error("Gemini returned invalid JSON"), {
      statusCode: 502,
      clientMessage: `Analysis result was malformed. ${safeErrorDetail(text)}`
    });
  }
}

function parseModelJson(text) {
  const cleaned = String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstObject = cleaned.indexOf("{");
    const lastObject = cleaned.lastIndexOf("}");
    if (firstObject !== -1 && lastObject > firstObject) {
      return JSON.parse(cleaned.slice(firstObject, lastObject + 1));
    }

    const firstArray = cleaned.indexOf("[");
    const lastArray = cleaned.lastIndexOf("]");
    if (firstArray !== -1 && lastArray > firstArray) {
      return { items: JSON.parse(cleaned.slice(firstArray, lastArray + 1)) };
    }

    throw new Error("No JSON object or array found");
  }
}

function extractInteractionText(json) {
  if (typeof json?.output_text === "string") return json.output_text.trim();
  if (typeof json?.outputText === "string") return json.outputText.trim();
  if (typeof json?.text === "string") return json.text.trim();
  const candidateText = json?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").trim();
  if (candidateText) return candidateText;
  const output = Array.isArray(json?.output) ? json.output : [];
  const parts = output.flatMap(item => {
    if (typeof item?.text === "string") return [item.text];
    if (Array.isArray(item?.content)) return item.content.map(part => part?.text || "").filter(Boolean);
    if (Array.isArray(item?.parts)) return item.parts.map(part => part?.text || "").filter(Boolean);
    return [];
  });
  const joined = parts.join("").trim();
  if (joined) return joined;
  return findFirstTextValue(json);
}

function findFirstTextValue(value) {
  if (!value || typeof value !== "object") return "";
  if (typeof value.text === "string" && value.text.trim()) return value.text.trim();
  if (typeof value.output_text === "string" && value.output_text.trim()) return value.output_text.trim();
  if (typeof value.outputText === "string" && value.outputText.trim()) return value.outputText.trim();
  const nextValues = Array.isArray(value) ? value : Object.values(value);
  for (const next of nextValues) {
    const found = findFirstTextValue(next);
    if (found) return found;
  }
  return "";
}

async function readGeminiError(response) {
  try {
    const json = await response.json();
    return json?.error?.message || JSON.stringify(json).slice(0, 500);
  } catch {
    try {
      return (await response.text()).slice(0, 500);
    } catch {
      return "No error body";
    }
  }
}

function geminiClientMessage(status, details) {
  const text = String(details || "").toLowerCase();
  if (status === 400 && (text.includes("model") || text.includes("not found"))) {
    return `Analysis model is not available for this API key. ${safeErrorDetail(details)}`;
  }
  if (status === 400) {
    return `Analysis request was rejected by Gemini. ${safeErrorDetail(details)}`;
  }
  if (status === 401 || status === 403) {
    return "Gemini API key is not authorized. Check the API key and Gemini API access.";
  }
  if (status === 429) {
    return "Gemini API limit was reached. Try again later or check quota/billing.";
  }
  return "Analysis service is temporarily unavailable.";
}

function safeErrorDetail(details) {
  return String(details || "Check Gemini API settings.")
    .replace(/AIza[0-9A-Za-z\-_]{20,}/g, "[redacted-api-key]")
    .slice(0, 220);
}

function buildPrompt(profile, imageMeta) {
  return [
    "You are Menu Safe Lens, a cautious Japanese menu risk checker for travelers.",
    "Analyze the menu photo. Extract visible menu items, Japanese names, English translations, prices in JPY when visible, visible allergen labels, and likely hidden ingredient risks.",
    "Keep the response concise. Return at most 12 menu items, prioritizing clearly readable food items.",
    "Return JSON only. Do not include markdown. Use this exact shape:",
    JSON.stringify({
      menuType: "restaurant menu",
      summary: "short English summary",
      analysisStatus: "readable | partial | retake",
      analysisNote: "short note",
      items: [
        {
          id: 1,
          status: "ok | ask | avoid",
          section: "menu section if visible",
          nameJa: "visible Japanese item name",
          nameEn: "English translation",
          price: 430,
          tags: ["visible labels or likely risk terms"],
          found: "exact visible text that supports this item",
          reason: "why it has this status",
          action: "what the traveler should do",
          askJa: "staff question in Japanese",
          askEn: "staff question in English",
          orderJa: "order phrase in Japanese",
          orderEn: "order phrase in English"
        }
      ]
    }),
    "Never claim food is guaranteed safe. Use status 'ok' only for 'no obvious issue' based on the user's selected profile; use 'ask' when sauces, dashi, broth, shared fryers, unclear kanji, cross-contact, or hidden ingredients may matter; use 'avoid' for clear conflicts.",
    "If the photo is unreadable, return analysisStatus 'retake' and an empty items array.",
    "Profile:",
    JSON.stringify({
      allergies: Array.isArray(profile?.allergies) ? profile.allergies : [],
      rules: Array.isArray(profile?.rules) ? profile.rules : [],
      strictness: profile?.strictness || "careful",
      severe: Boolean(profile?.severe),
      currency: profile?.currency || "USD"
    }),
    "Image metadata:",
    JSON.stringify(imageMeta || {})
  ].join("\n");
}

function normalizeForClient(result) {
  const items = Array.isArray(result?.items) ? result.items : [];
  return {
    menuType: String(result?.menuType || "Menu"),
    summary: String(result?.summary || "Menu items were extracted from the photo."),
    analysisStatus: ["readable", "partial", "retake"].includes(result?.analysisStatus) ? result.analysisStatus : (items.length ? "partial" : "retake"),
    analysisNote: String(result?.analysisNote || "Ask staff for severe allergies or unclear ingredients."),
    items: items.slice(0, 30).map((item, index) => ({
      id: Number(item.id || index + 1),
      status: ["ok", "ask", "avoid"].includes(item.status) ? item.status : "ask",
      section: String(item.section || item.category || item.menuSection || ""),
      nameJa: String(item.nameJa || item.name_ja || item.japaneseName || item.japanese_name || item.name || item.item || "読み取り不明"),
      nameEn: String(item.nameEn || item.name_en || item.englishName || item.english_name || item.translation || item.name || "Unknown item"),
      price: Number(item.price || item.priceJpy || item.price_jpy || item.jpy || 0),
      tags: Array.isArray(item.tags) ? item.tags.map(String).slice(0, 8) : [],
      found: String(item.found || item.foundOnMenu || item.found_on_menu || item.visibleText || item.visible_text || "Detected menu text"),
      reason: String(item.reason || item.why || item.riskReason || item.risk_reason || "This item needs review based on visible text or hidden-risk rules."),
      action: String(item.action || item.whatToDo || item.what_to_do || "Ask staff before ordering if this matters to your profile."),
      askJa: String(item.askJa || item.ask_ja || item.staffQuestionJa || item.staff_question_ja || "この料理の材料と調理方法を確認してもらえますか？"),
      askEn: String(item.askEn || item.ask_en || item.staffQuestionEn || item.staff_question_en || "Could you please check the ingredients and preparation method?"),
      orderJa: String(item.orderJa || item.order_ja || item.orderPhraseJa || item.order_phrase_ja || "これを1つください。"),
      orderEn: String(item.orderEn || item.order_en || item.orderPhraseEn || item.order_phrase_en || "I'll have one of this, please.")
    }))
  };
}

function setSecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function readRequestBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", chunk => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error("Request too large"), { statusCode: 413, clientMessage: "Image upload is too large." }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(body, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    throw Object.assign(new Error("Missing boundary"), { statusCode: 400, clientMessage: "Invalid upload format." });
  }

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const fields = {};
  const files = {};
  let start = body.indexOf(boundary);

  while (start !== -1) {
    start += boundary.length;
    if (body[start] === 45 && body[start + 1] === 45) break;
    if (body[start] === 13 && body[start + 1] === 10) start += 2;

    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), start);
    if (headerEnd === -1) break;
    const headerText = body.slice(start, headerEnd).toString("utf8");
    const dataStart = headerEnd + 4;
    let next = body.indexOf(boundary, dataStart);
    if (next === -1) break;
    let dataEnd = next;
    if (body[dataEnd - 2] === 13 && body[dataEnd - 1] === 10) dataEnd -= 2;
    const data = body.slice(dataStart, dataEnd);

    const name = /name="([^"]+)"/i.exec(headerText)?.[1];
    if (name) {
      const filename = /filename="([^"]*)"/i.exec(headerText)?.[1];
      const contentTypePart = /content-type:\s*([^\r\n]+)/i.exec(headerText)?.[1]?.trim() || "application/octet-stream";
      if (filename) {
        files[name] = { filename, contentType: contentTypePart, data };
      } else {
        fields[name] = data.toString("utf8");
      }
    }
    start = next;
  }

  return { fields, files };
}

function safeJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

module.exports = handler;
module.exports.config = vercelConfig;
