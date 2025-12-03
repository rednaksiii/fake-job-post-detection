import { z } from "zod";   
import { jobPostFull, MLReturn } from "~/server/ml/job_post_schema";

const FASTAPI_URL = process.env.FASTAPI_URL!;

export async function predictFraudulentJob(
    job: z.infer<typeof jobPostFull>
): Promise<z.infer<typeof MLReturn>> {
   
    // TODO: Call the FastAPI ML model for prediction, currently mocked
    const result: z.infer<typeof MLReturn> = {
        fraudulent: false,
        confidence: 0.99,
    }

    return result;  
}