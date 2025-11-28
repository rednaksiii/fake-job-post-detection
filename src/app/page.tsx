import { HydrateClient } from "~/trpc/server";

import { JobPostForm } from "./_components/form";
import { Result } from "./_components/result";
import { NavBar } from "./_components/navbar";

export default async function Home() {

  return (
    <HydrateClient>
      <NavBar />

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

          <div className ="flex flex-col lg:flex-row gap-6 px-4 md:px-32 py-16 sm:px-8">

            <JobPostForm />
            <Result />

          </div>
        </div>

      </main>
    </HydrateClient>
  );
}