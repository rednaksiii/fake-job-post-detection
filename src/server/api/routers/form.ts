import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jobPostFull, jobPostNoParse, jobPostParse, LLMReturn, MLReturn } from "~/server/ml/job_post_schema";
import { predictFraudulentJob, predictFraudulentJobMock } from "~/server/ml/predictor";

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
  // ...existing code...
  predict: publicProcedure
    .input(z.object({
      jobPostNoParse: jobPostNoParse,
      LLMReturn: LLMReturn,
    }))
    .output(MLReturn)
    .mutation(async ({ input }) => {
      
      // make the full job post object
      const coerceBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";
      const coerceString = (v: any) => (v === undefined || v === null) ? "" : String(v);

      const candidate: z.infer<typeof jobPostFull> = {
        title: coerceString(input.jobPostNoParse.title),
        location: coerceString(input.jobPostNoParse.location),
        employment_type: coerceString(
          (input.jobPostNoParse as any).employment_type ??
          (input.jobPostNoParse as any).employmentType ??
          ""
        ),
        industry: coerceString(input.jobPostNoParse.industry ?? ""),
        department: coerceString(input.jobPostNoParse.department ?? ""),
        function: coerceString(input.jobPostNoParse.function ?? ""),
        min_salary: Number(input.jobPostNoParse.min_salary || 0),
        max_salary: Number(input.jobPostNoParse.max_salary || 0),
        company_profile: coerceString(input.LLMReturn.company_profile),
        description: coerceString(input.LLMReturn.description),
        requirements: coerceString(input.LLMReturn.requirements),
        benefits: coerceString(input.jobPostNoParse.benefits ?? ""),
        telecommuting: input.jobPostNoParse.telecommuting ? 1 : 0,
        has_company_logo: input.jobPostNoParse.has_company_logo ? 1 : 0,
        has_questions: input.jobPostNoParse.has_questions ? 1 : 0,
        required_education: coerceString(input.jobPostNoParse.required_education ?? (input.jobPostNoParse as any).requiredEducation ?? ""),
        required_experience: coerceString(input.jobPostNoParse.required_experience ?? (input.jobPostNoParse as any).requiredExperience ?? ""),
      };

      console.log("What is passed into the FastAPI:", JSON.stringify(candidate, null, 2));

      const fullJobPost: z.infer<typeof jobPostFull> = jobPostFull.parse(candidate);

      // pass it to the fastAPI ML model for prediction
      const result: z.infer<typeof MLReturn> = await predictFraudulentJob(fullJobPost);

      const res = MLReturn.parse(result);
      // Mocked response for now
      return res;
    }),
});
