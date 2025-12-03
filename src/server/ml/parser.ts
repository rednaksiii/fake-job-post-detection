import OpenAI from "openai";
import type z from "zod";

import { jobPostParse } from "~/server/ml/job_post_schema";

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
  "company_profile": string or "",
  "description": string or "",
  "requirements": string or "",
}

IMPORTANT:
- If a field is missing in the text, set it to "".
- Output ONLY a JSON object. No markdown or extra text.

The given "About the Job" section:
---
${jobDescription}
---
`.trim();

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
  aboutTheJob: z.infer<typeof jobPostParse>,
  maxRetries = 3,
) : Promise<z.infer<typeof jobPostParse>> {
  let userPrompt = USER_PROMPT_TEMPLATE(aboutTheJob.description);
  let lastRaw: string | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const raw = await callLLM(SYSTEM_PROMPT, userPrompt);
    lastRaw = raw;

    const parsed = tryParseJson(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }

    userPrompt += "\n\nReminder: Return ONLY JSON.";
  }

  throw new Error(
    `Could not parse JSON after ${maxRetries} attempts. Last response:\n${lastRaw}`,
  );
}

export default extractJobFieldsWithLLM;