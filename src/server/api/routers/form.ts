import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jobPostFull, jobPostNoParse, jobPostParse, LLMReturn, MLReturn } from "~/server/ml/job_post_schema";
import { predictFraudulentJob } from "~/server/ml/predictor";

export const formRouter = createTRPCRouter({
  reformat: publicProcedure
    .input(z.object({ aboutTheJob: jobPostParse }))
    .output(LLMReturn)
    .mutation(async ({ input }) => {
      
      const mod = await import("~/server/ml/parser");
      const result = await mod.extractJobFieldsWithLLM(input.aboutTheJob);
      const res = LLMReturn.parse(result);
      return res;
    }),
  predict: publicProcedure
    .input(z.object({
      jobPostNoParse: jobPostNoParse,
      LLMReturn: LLMReturn,
    }))
    .output(MLReturn)
    .mutation(async ({ input }) => {
      
      // make the full job post object
      const fullJobPost: z.infer<typeof jobPostFull> = jobPostFull.parse({
        ...input.jobPostNoParse,
        ...input.LLMReturn,
      });
      // pass it to the fastAPI ML model for prediction
      const result: z.infer<typeof MLReturn> = await predictFraudulentJob(fullJobPost);

      const res = MLReturn.parse(result);
      // Mocked response for now
      return res;
    }),
});
