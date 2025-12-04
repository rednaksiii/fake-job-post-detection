import { z } from "zod";

// Everything that's going to be passed into the ML model for prediction
export const jobPostFull = z.object({
  title: z.string(),
  location: z.string(),
  employment_type: z.string(),
  industry: z.string(),
  department: z.string(),
  function: z.string(),
  min_salary: z.number(),
  max_salary: z.number(),
  company_profile: z.string(),
  description: z.string(),
  requirements: z.string(),
  benefits: z.string(),
  telecommuting: z.number(),
  has_company_logo: z.number(),
  has_questions: z.number(),
  required_education: z.string(),
  required_experience: z.string(),
});

// Everything that's not going to be passed to the LLM
export const jobPostNoParse = z.object({
  job_id: z.string(),
  title: z.string(),
  location: z.string(),
  employment_type: z.string(),
  industry: z.string(),
  department: z.string(),
  function: z.string(),
  min_salary: z.string(),
  max_salary: z.string(),
  benefits: z.string(),
  telecommuting: z.number(),
  has_company_logo: z.number(),
  has_questions: z.number(),
  required_education: z.string(),
  required_experience: z.string(),
});

// Everything that's not going to be passed to the LLM
export const jobPostParse = z.object({
  description: z.string(), 
});

// Everything that the OpenAI LLM will return
export const LLMReturn = z.object({
  company_profile: z.string(),
  description: z.string(),
  requirements: z.string(),
});

// Everything that the FastAPI ML Model return
export const MLReturn = z.object({
  is_fake: z.boolean(), // predicted fraudulent or not
  probability: z.number().min(0).max(1), // probability between 0 and 1
  confidence: z.string(),
  explanation: z.string().optional(),
});