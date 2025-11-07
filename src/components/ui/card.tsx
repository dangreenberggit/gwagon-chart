import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Mercedes G-Class styled card component primitives.
 */
export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded border bg-card border-border shadow-sm",
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
    return (
        <div
            className={cn("p-4 border-b border-border", className)}
            {...props}
        />
    );
}
export function CardTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "text-lg font-semibold text-card-foreground tracking-tight",
                className
            )}
            {...props}
        />
    );
}
export function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-4", className)} {...props} />;
}
