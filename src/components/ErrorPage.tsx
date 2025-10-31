import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ErrorPageProps {
    error: string;
}

export function ErrorPage({ error }: ErrorPageProps) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Error Loading Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{error}</p>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}

