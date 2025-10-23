import * as React from "react";
import { cn } from "@/lib/utils";

// Lightweight shadcn-style Card primitives for layout consistency
export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-lg border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800",
                className
            )}
            {...props}
        />
    );
}
export function CardHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-4 border-b", className)} {...props} />;
}
export function CardTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}
export function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-4", className)} {...props} />;
}

