import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ErrorPageProps {
    error: string;
}

/**
 * Extracts a user-friendly error message from technical error strings.
 */
function getUserFriendlyMessage(error: string): string {
    if (error.includes("Invalid data")) {
        return "The data file contains invalid or corrupted information. Please check the data source and try again.";
    }
    if (error.includes("Missing")) {
        return "Some required data is missing. Please verify the data file is complete.";
    }
    if (error.includes("HTTP")) {
        return "Unable to load data from the server. Please check your connection and try again.";
    }
    return "An error occurred while loading the data. Please try again.";
}

export function ErrorPage({ error }: ErrorPageProps) {
    const userMessage = getUserFriendlyMessage(error);
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="max-w-lg w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Unable to Load Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-foreground">
                        {userMessage}
                    </p>
                    <button
                        className="btn btn-primary mt-4 w-full"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}

