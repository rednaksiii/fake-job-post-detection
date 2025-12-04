import type z from "zod";
import type { MLReturn } from "~/server/ml/job_post_schema";

export function Result({
    result,
}: {
    result: z.infer<typeof MLReturn> | null;
}) {
    const prediction: string = result
      ? String(result.is_fake ? "Fake" : "Legit")
      : "N/A";
    const probability: number = result
      ? Math.round((result.probability ?? 0) * 100)
      : 0;
    const confidence: string = result
      ? String(result.confidence ?? "N/A")
      : "N/A";

    return (
        // Result on the right side
        <div className="flex-3 h-[80vh] px-8 pt-8 bg-card rounded-[48px]">
            <h1 className ="text-4xl text-md font-medium mb-3">Result</h1>
            <div className = "text-muted-foreground text-sm leading-normal font-normal">
                <p> This is our prediction for the job post's legitness. </p>
            </div>
            <div className="flex flex-col gap-2 items-center py-24">
                <div className="w-70 h-70 rounded-full bg-gray-200 flex flex-col font-extralight items-center justify-center shadow-md">
                    <h1 className="text-6xl text-black">{result ? prediction : "N/A"}</h1>
                    <p className="mt-1 text-gray-600">Probability:</p>
                    <h1 className="text-4xl text-black">{result ? probability : 0}%</h1>
                    <p className="mt-1 text-gray-600">Confidence:</p>
                    <h1 className="text-4xl text-black">{result ? confidence : "N/A"}</h1>
                </div>
            </div>
            <h1 className ="text-4xl text-md font-medium mb-3">Explanation</h1>
            <div className="text-muted-foreground text-sm leading-normal font-normal">
                <p>{result ? result.explanation : "N/A"}</p>
            </div>
        </div>
    );
}