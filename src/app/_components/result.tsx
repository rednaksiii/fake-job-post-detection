export function Result() {
    return (
        // Result on the right side
        <div className="flex-3 h-[80vh] px-8 pt-8 bg-card rounded-[48px]">
            <h1 className ="text-4xl text-md font-medium mb-3">Result</h1>
            <div className = "text-muted-foreground text-sm leading-normal font-normal">
                <p> This is our prediction for the job post's legitness. </p>
            </div>
            <div className="flex flex-col gap-2 items-center py-24">
                <div className="w-60 h-60 rounded-full bg-gray-200 flex flex-col font-extralight items-center justify-center shadow-md">
                    <h1 className="text-6xl text-black">Fake</h1>
                    <p className="mt-1 text-gray-600">Confidence:</p>
                    <h1 className="text-4xl text-black">95%</h1>
                </div>
            </div>
        </div>
    );
}