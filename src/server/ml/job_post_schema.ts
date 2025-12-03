import { z } from "zod";

// Everything that's going to be passed into the ML model for prediction
export const jobPostFull = z.object({
  job_id: z.string(),
  title: z.string(),
  location: z.string(),
  employmentType: z.string(),
  industry: z.string(),
  department: z.string(),
  function: z.string(),
  min_salary: z.string(),
  max_salary: z.string(),
  company_profile: z.string(),
  description: z.string(),
  requirements: z.string(),
  benefits: z.string(),
  telecommuting: z.boolean(),
  has_company_logo: z.boolean(),
  has_questions: z.boolean(),
  required_education: z.string(),
});

// Everything that's not going to be passed to the LLM
export const jobPostNoParse = z.object({
  job_id: z.string(),
  title: z.string(),
  location: z.string(),
  employmentType: z.string(),
  industry: z.string(),
  department: z.string(),
  function: z.string(),
  min_salary: z.string(),
  max_salary: z.string(),
  benefits: z.string(),
  telecommuting: z.boolean(),
  has_company_logo: z.boolean(),
  has_questions: z.boolean(),
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
  fraudulent: z.boolean(), // predicted fraudulent or not
  confidence: z.number().min(0).max(1), // confidence percentage between 0 and 1
});