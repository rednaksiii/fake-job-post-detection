import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"

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

import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox"

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

const contributors: { title: string; href: string; description: string }[] = [
  {
    title: "Ben Morin",
    href: "#",
    description:
      "I handled building the preprocessing pipeline and training the model.",
  },
  {
    title: "Khang Nguyen",
    href: "https://www.ndtkhang.dev",
    description:
      "I handled the full stack web app and integrating all services and POCs",
  },
  {
    title: "John Yoshida",
    href: "#",
    description:
      "I handled fetching, analyzing, and cleaning the dataset.",
  },
  {
    title: "Ishkandar",
    href: "#",
    description: "I handled deploying the ML with FastAPI.",
  },
  {
    title: "David Harrison",
    href: "#",
    description:
      "I researched evaluation metrics for our models and wrote the report.",
  },
  {
    title: "Jin Park",
    href: "#",
    description:
      "I made the POC for the LLM call to parse the the Job Description for our ML Model.",
  },
]

export default async function Home() {

  return (
    <HydrateClient>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>

          {/* Home Page */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/">Detector</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Contributors */}
          <NavigationMenuItem>
          <NavigationMenuTrigger>Contributors</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {contributors.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

          {/* Github Link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="https://github.com/ndtkhang/fake_job_post_detective">Github</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <main className="flex bg-background">
        
        <div className="flex-col py-16 min-w-screen min-h-screen gap-9">
          
          {/* Title  */}
          <div className = "flex flex-col items-center px-16">
            <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Fake <span className="text-[hsl(236,100%,70%)]">Job Post</span> Detector
            </h1>

            <p className="mt-6 text-lg max-w-2xl text-center text-muted-foreground">
              Answer a few questions about a job post you saw on LinkedIn, etc. and let us tell you if it's likely to be fake or real.
              Recommended to copy and paste things from the job posts instead of manually fill it out for best results.
            </p>
          </div>

          <div className ="flex flex-col lg:flex-row min-h-screen gap-6 px-4 md:px-32 py-16 sm:px-8">

            {/* Form on the left side */}
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

                          <div className = "grid grid-cols-3 gap-4">
                
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

            {/* Result on the right side */}
            <div className="flex-3 h-[80vh] px-4 py-16 bg-card rounded-[48px]">

            </div>

          </div>
        </div>

      </main>
    </HydrateClient>
  );
}