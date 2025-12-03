"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { api } from "~/trpc/react";

import { jobPostNoParse, jobPostParse, LLMReturn, MLReturn } from "~/server/ml/job_post_schema";
import type z from "zod";
import { Result } from "./result";

export function JobPostForm() {

  // Form states
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [industry, setIndustry] = useState("")
  const [department, setDepartment] = useState("")
  const [jobFunction, setJobFunction] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [benefits, setBenefits] = useState("")
  const [telecommuting, setTelecommuting] = useState(false)
  const [hasCompanyLogo, setHasCompanyLogo] = useState(false)
  const [hasQuestions, setHasQuestions] = useState(false)
  const [requiredExperience, setRequiredExperience] = useState("")
  const [requiredEducation, setRequiredEducation] = useState("")
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reformatMutation = api.form.reformat.useMutation();
  const predictMutation = api.form.predict.useMutation();
  const isSubmitting = reformatMutation.isPending || predictMutation.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event?.preventDefault();
    setError(null);
    setResult(null);

    // hold all fields that's not going to be parse
    const jobPostNoParseObj: z.infer<typeof jobPostNoParse> = {
      job_id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      title: title,
      location: location,
      employmentType: employmentType,
      industry: industry,
      department: department,
      function: jobFunction,
      min_salary: minSalary,
      max_salary: maxSalary,
      benefits: benefits,
      telecommuting: telecommuting,
      has_company_logo: hasCompanyLogo,
      has_questions: hasQuestions,
      required_education: requiredEducation,
      required_experience: requiredExperience,
    };

    // hold field that needs to be parse
    const jobPostParseObj: z.infer<typeof jobPostParse> = {
      description: jobDescription,
    };

    // parse the aboutTheJob section with LLM to get company_profile, description, requirements
    let LLMResponse: z.infer<typeof LLMReturn>;
    let predictionResult: z.infer<typeof MLReturn>;
    try {
      LLMResponse = await reformatMutation.mutateAsync({ aboutTheJob: jobPostParseObj });
      setResult(LLMResponse);

      // when done parsing, pass to FastAPI for prediction
      try {
        predictionResult = await predictMutation.mutateAsync({ jobPostNoParse: jobPostNoParseObj, LLMReturn: LLMResponse });
        setResult(predictionResult);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }

  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-32 py-16 sm:px-8">
      <div className="flex-7 px-8 py-8 bg-card rounded-[48px] shadow-medium">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Job Post</FieldLegend>
              <FieldDescription>
                Below are some questions about the job posts you saw.
              </FieldDescription>
              <FieldGroup>

                <div className="grid grid-cols-3 gap-4">

                  {/* Job Title */}
                  <Field>
                    <FieldLabel htmlFor="job-title-input-field">
                      Job Title
                    </FieldLabel>
                    <Input
                      id="job-title-input-field"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. React Developer"
                    />
                  </Field>

                  {/* Location */}
                  <Field>
                    <FieldLabel htmlFor="location-input-field">
                      Location
                    </FieldLabel>
                    <Input
                      id="location-input-field"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New York, NY"
                    />
                  </Field>

                  {/* Job Type */}
                  <Field>
                    <FieldLabel htmlFor="employment-type-select">
                      Employment Type
                    </FieldLabel>
                    <Select value={employmentType} onValueChange={setEmploymentType} defaultValue="Missing">
                      <SelectTrigger id="employment-type-select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-Time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Contract">Contractor</SelectItem>
                        <SelectItem value="Missing">Not Specified</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                </div>

                <div className="grid grid-cols-3 gap-4">

                  {/* Industry */}
                  <Field>
                    <FieldLabel htmlFor="industry-input-field">
                      Industry
                    </FieldLabel>
                    <Input
                      id="industry-input-field"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Technology"
                    />
                  </Field>

                  {/* Department */}
                  <Field>
                    <FieldLabel htmlFor="department-input-field">
                      Department
                    </FieldLabel>
                    <Input
                      id="department-input-field"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Technology"
                    />
                  </Field>

                  {/* Function */}
                  <Field>
                    <FieldLabel htmlFor="function-select">
                      Function
                    </FieldLabel>
                    <Select value={jobFunction} onValueChange={setJobFunction} defaultValue="Missing">
                      <SelectTrigger id="function-select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Technology">IT</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* Salary Range */}
                  <Field>
                    <FieldLabel htmlFor="min-salary-input-field">
                      Min Salary
                    </FieldLabel>
                    <Input
                      id="min-salary-input-field"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="e.g. 50,000k"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="max-salary-input-field">
                      Max Salary
                    </FieldLabel>
                    <Input
                      id="max-salary-input-field"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="e.g. 100,000k"
                    />
                  </Field>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* Required Experience */}
                  <Field>
                    <FieldLabel htmlFor="required-experience-select">
                      Required Experience
                    </FieldLabel>
                    <Select value={requiredExperience} onValueChange={setRequiredExperience} defaultValue="Missing">
                      <SelectTrigger id="required-experience-select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mid-Senior level">Mid-Senior Level</SelectItem>
                        <SelectItem value="Entry level">Entry Level</SelectItem>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="No Applicable">Not Application</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="Missing">Not Specified</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Required Education */}
                  <Field>
                    <FieldLabel htmlFor="required-education-select">
                      Required Education
                    </FieldLabel>
                    <Select value={requiredEducation} onValueChange={setRequiredEducation} defaultValue="Missing">
                      <SelectTrigger id="required-education-select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unspecified">Unspecified</SelectItem>
                        <SelectItem value="Missing">Missing</SelectItem>
                        <SelectItem value="High School or equivalent">High School or Equivalent</SelectItem>
                        <SelectItem value="Some College Coursework Completed">Some College Coursework Completed</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor Degree">Bachelor Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Required Education */}
                </div>

                {/* About the Job */}
                <Field>
                  <FieldLabel htmlFor="job-description-input-field">
                    Job Description
                  </FieldLabel>
                  <Textarea
                    id="job-description-input-field"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={"Copy the \"About the Job\" section from LinkedIn to here."}
                    className="resize-none"
                  />
                </Field>

                {/* Benefits */}
                <Field>
                  <FieldLabel htmlFor="benefits-input-field">
                    Benefits
                  </FieldLabel>
                  <Textarea
                    id="benefits-input-field"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder={"Copy the \"Benefits\" section from LinkedIn to here."}
                    className="resize-none"
                  />
                </Field>

                {/* Telecommuting / Has Company Logo / Has Questions */}
                <FieldGroup>
                  <div className="flex items-center space-x-6">
                    <Field orientation="horizontal">
                      <Checkbox id="checkout-telecommuting" checked={telecommuting} onCheckedChange={(v) => setTelecommuting(!!v)} />
                      <FieldLabel htmlFor="checkout-telecommuting" className="font-normal">
                        Telecommuting
                      </FieldLabel>
                    </Field>

                    <Field orientation="horizontal">
                      <Checkbox id="checkout-has-company-logo" checked={hasCompanyLogo} onCheckedChange={(v) => setHasCompanyLogo(!!v)} />
                      <FieldLabel htmlFor="checkout-has-company-logo" className="font-normal">
                        Has Company Logo
                      </FieldLabel>
                    </Field>

                    <Field orientation="horizontal">
                      <Checkbox id="checkout-has-questions" checked={hasQuestions} onCheckedChange={(v) => setHasQuestions(!!v)} />
                      <FieldLabel htmlFor="checkout-has-questions" className="font-normal">
                        Has Questions
                      </FieldLabel>
                    </Field>
                  </div>
                </FieldGroup>

                {/* TODO: Start the parser and pass to FastAPI */}
                <Field orientation="horizontal">
                  <Button type="submit" disabled = {isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </div>
      
      <Result result={result} />
    </div>

  );
}
