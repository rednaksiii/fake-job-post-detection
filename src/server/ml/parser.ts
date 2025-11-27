 import OpenAI from "openai";

// LLM model name you want to use
const OPENAI_MODEL = "gpt-4.1-mini";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (_client) return _client;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

// System / user prompts are identical to the CLI helper
const SYSTEM_PROMPT = `
You are an information extraction engine.

Your only job is to read a "About The Job" section from the given LinkedIn job post
and extract structured information from it

Rules:
- No explanations, no commentary.
- If you don't know something, return null.
- MUST return valid JSON only.
- NEVER predict the "fraudulent" field (set to null).
`.trim();

const USER_PROMPT_TEMPLATE = (jobDescription: string) => `
Extract structured information from the following job description.

Return EXACTLY this JSON structure:

{
  "company_profile": string or null,
  "description": string or null,
  "requirements": string or null,
}

IMPORTANT:
- If a field is missing in the text, set it to null.
- Output ONLY a JSON object. No markdown or extra text.

The given "About the Job" section:
---
${jobDescription}
---
`.trim();

export type KaggleRecord = {
  job_id: string | null;
  title: string | null;
  location: string | null;
  department: string | null;
  salary_range: string | null;
  company_profile: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  telecommuting: 0 | 1 | null;
  has_company_logo: 0 | 1 | null;
  has_questions: 0 | 1 | null;
  employment_type: string | null;
  required_experience: string | null;
  required_education: string | null;
  industry: string | null;
  function: string | null;
  fraudulent: null;
};

const KAGGLE_SCHEMA_DEFAULTS: KaggleRecord = {
  job_id: null,
  title: null,
  location: null,
  department: null,
  salary_range: null,
  company_profile: null,
  description: null,
  requirements: null,
  benefits: null,
  telecommuting: null,
  has_company_logo: null,
  has_questions: null,
  employment_type: null,
  required_experience: null,
  required_education: null,
  industry: null,
  function: null,
  fraudulent: null,
};

const INT_FLAG_FIELDS = new Set([
  "telecommuting",
  "has_company_logo",
  "has_questions",
]);

function tryParseJson(text: string): any | null {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function as01Null(value: any): 0 | 1 | null {
  if (value === 1 || value === "1" || value === true) return 1;
  if (value === 0 || value === "0" || value === false) return 0;
  return null;
}

function normalizeKaggleRecord(raw: Record<string, any>): KaggleRecord {
  const out: Record<string, any> = { ...KAGGLE_SCHEMA_DEFAULTS };

  for (const key of Object.keys(KAGGLE_SCHEMA_DEFAULTS)) {
    let v = raw[key];

    if (INT_FLAG_FIELDS.has(key)) {
      v = as01Null(v);
    } else if (v === undefined) {
      v = null;
    }

    out[key] = v;
  }

  return out as KaggleRecord;
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getClient();

  const resp = await client.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return resp.choices?.[0]?.message?.content ?? "";
}

export async function extractJobFieldsWithLLM(
  jobText: string,
  maxRetries = 3,
): Promise<KaggleRecord> {
  let userPrompt = USER_PROMPT_TEMPLATE(jobText);
  let lastRaw: string | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const raw = await callLLM(SYSTEM_PROMPT, userPrompt);
    lastRaw = raw;

    const parsed = tryParseJson(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return normalizeKaggleRecord(parsed);
    }

    userPrompt += "\n\nReminder: Return ONLY JSON.";
  }

  throw new Error(
    `Could not parse JSON after ${maxRetries} attempts. Last response:\n${lastRaw}`,
  );
}

// Simple CLI entrypoint that can be used by a separate script
export async function main(): Promise<number> {
  // read stdin
  const data = await (async () => {
    return new Promise<string>((resolve) => {
      let buf = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => (buf += chunk));
      process.stdin.on("end", () => resolve(buf));
    });
  })();

  const text = data.trim();
  if (!text) {
    console.error("No input provided on stdin.");
    return 2;
  }

  try {
    const record = await extractJobFieldsWithLLM(text);
    console.log(JSON.stringify(record, null, 2));
    return 0;
  } catch (err: any) {
    console.error("Extraction failed:", err.message ?? err);
    return 1;
  }
}

export default extractJobFieldsWithLLM;

// Post-process parsed output to better match Kaggle dataset expectations
export function formatForKaggle(record: KaggleRecord): KaggleRecord {
  const out = { ...record } as any;

  // Normalize employment_type
  if (typeof out.employment_type === "string") {
    const et = out.employment_type.toLowerCase();
    if (et.includes("full")) out.employment_type = "Full-time";
    else if (et.includes("part")) out.employment_type = "Part-time";
    else if (et.includes("contract")) out.employment_type = "Contract";
    else if (et.includes("temp")) out.employment_type = "Temporary";
    // otherwise leave as-is
  }

  // If location contains parenthetical like "United States (Remote)", prefer the country
  if (typeof out.location === "string" && out.location.includes("(")) {
    out.location = out.location.split("(")[0].trim();
  }

  // Ensure telecommuting/has_company_logo/has_questions are 0/1 (coerce if possible)
  const coerceFlag = (v: any) => {
    if (v === 1 || v === "1" || v === true) return 1;
    if (v === 0 || v === "0" || v === false) return 0;
    return null;
  };

  out.telecommuting = coerceFlag(out.telecommuting);
  out.has_company_logo = coerceFlag(out.has_company_logo);

  // For training data, prefer explicit 0 instead of null for has_questions
  const hq = coerceFlag(out.has_questions);
  out.has_questions = hq === null ? 0 : hq;

  // Keep salary as raw string but trim
  if (typeof out.salary_range === "string") out.salary_range = out.salary_range.trim();

  return out as KaggleRecord;
}