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
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function JobPostForm() {

  // Form states
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [industry, setIndustry] = useState("")
  const [department, setDepartment] = useState("")
  const [functionField, setFunctionField] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [benefits, setBenefits] = useState("")
  const [telecommuting, setTelecommuting] = useState(false)
  const [hasCompanyLogo, setHasCompanyLogo] = useState(false)
  const [hasQuestions, setHasQuestions] = useState(false)
  const [requiredEducation, setRequiredEducation] = useState(false)

  return (
    <div className="flex-7 px-8 py-8 bg-card rounded-[48px] shadow-medium">
      <form>
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
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Job Title
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. React Developer"
                    required
                  />
                </Field>

                {/* Location */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Location
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. New York, NY"
                    required
                  />
                </Field>

                {/* Job Type */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                    Employment Type
                  </FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="checkout-7j9-exp-year-f59">
                      <SelectValue placeholder="Not Specified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Specified">Not Specified</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

              </div>

              <div className="grid grid-cols-3 gap-4">

                {/* Industry */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Industry
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. Technology"
                    required
                  />
                </Field>

                {/* Department */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Department
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. Technology"
                    required
                  />
                </Field>

                {/* Function */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Function
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. Technology"
                    required
                  />
                </Field>

              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* Salary Range */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Min Salary
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. 50,000k"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Max Salary
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="e.g. 100,000k"
                    required
                  />
                </Field>

              </div>

              {/* About the Job */}
              <Field>
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Job Description
                </FieldLabel>
                <Textarea
                  id="checkout-7j9-optional-comments"
                  placeholder={"Copy the \"About the Job\" section from LinkedIn to here."}
                  className="resize-none"
                />
              </Field>

              {/* Benefits */}
              <Field>
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Benefits
                </FieldLabel>
                <Textarea
                  id="checkout-7j9-optional-comments"
                  placeholder={"Copy the \"Benefits\" section from LinkedIn to here."}
                  className="resize-none"
                />
              </Field>

              {/* Telecommuting / Has Company Logo / Has Questions */}
              <FieldGroup>
                <div className="flex items-center space-x-6">
                  <Field orientation="horizontal">
                    <Checkbox id="checkout-telecommuting" defaultChecked />
                    <FieldLabel htmlFor="checkout-telecommuting" className="font-normal">
                      Telecommuting
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal">
                    <Checkbox id="checkout-has-company-logo" />
                    <FieldLabel htmlFor="checkout-has-company-logo" className="font-normal">
                      Has Company Logo
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal">
                    <Checkbox id="checkout-has-questions" />
                    <FieldLabel htmlFor="checkout-has-questions" className="font-normal">
                      Has Questions
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal">
                    <Checkbox id="checkout-has-questions" />
                    <FieldLabel htmlFor="checkout-has-questions" className="font-normal">
                      Required Education
                    </FieldLabel>
                  </Field>
                </div>
              </FieldGroup>

              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
