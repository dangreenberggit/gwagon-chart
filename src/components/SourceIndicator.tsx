import { cn } from "@/lib/utils";

interface SourceIndicatorProps {
    color: string;
    isHighlighted?: boolean;
    className?: string;
}

export function SourceIndicator({
    color,
    isHighlighted = false,
    className,
}: SourceIndicatorProps) {
    return (
        <span className={cn("relative flex h-3 w-3 mt-1 flex-shrink-0", className)}>
            {isHighlighted && (
                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: color }}
                />
            )}
            <span
                className="relative inline-flex h-full w-full rounded-full shadow-sm"
                style={{ backgroundColor: color }}
            />
        </span>
    );
}

