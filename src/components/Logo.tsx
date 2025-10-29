import React from "react";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    loading?: "eager" | "lazy";
}

/**
 * Circular logo component for Mercedes G-Wagen
 * Supports different sizes with consistent styling
 */
export const Logo: React.FC<LogoProps> = ({
    size = "md",
    loading = "lazy",
}) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
    };

    return (
        <div
            className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-white border-2 border-mb-night`}
        >
            <img
                src="/img/gwagonlogo.png"
                alt="Logo"
                className="absolute inset-0 size-full object-cover object-center"
                style={{ transform: "scale(1.35)" }}
                loading={loading}
            />
        </div>
    );
};
