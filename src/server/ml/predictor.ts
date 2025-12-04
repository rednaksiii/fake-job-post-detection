import { z } from "zod";   
import { jobPostFull, MLReturn } from "~/server/ml/job_post_schema";

const FASTAPI_URL = process.env.FASTAPI_URL!;

// Function to call FastAPI with timeout
async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  ms = 10_000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}


export async function predictFraudulentJob(
    job: z.infer<typeof jobPostFull>
): Promise<z.infer<typeof MLReturn>> {
  
    // Put it in a json for fastapi format
    const payload = job;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetchWithTimeout(
          `${FASTAPI_URL}/predict`, 
          {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
          },
          15_000
        );

        if (!res.ok) {
          throw new Error(`FastAPI responded with status ${res.status}`);
        }

        const json = await res.json();
        const parsed = MLReturn.safeParse(json);
        if (!parsed.success) {
          throw new Error("Invalid response format from FastAPI");
        }

        return parsed.data;

      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise((r) => setTimeout(r, attempt * 300));
    }
  }

  throw new Error("Unreachable");

}

export function predictFraudulentJobMock(
  job: z.infer<typeof jobPostFull>
): Promise<z.infer<typeof MLReturn>>  {
  const result: z.infer<typeof MLReturn> = {
    is_fake: false,
    probability: 0.99,
    confidence: "Low",
    explanation: "This is a mock prediction.",
  };

  return Promise.resolve(result);    
}