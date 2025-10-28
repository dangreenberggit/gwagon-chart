import React from "react";

interface GrillSeparatorProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * GrillSeparator - A Mercedes G-Wagen inspired grill separator
 * Uses SVG for precise chrome bar rendering with proper gradients and shadows
 */
export const GrillSeparator: React.FC<GrillSeparatorProps> = ({
    children,
    className = "",
}) => {
    return (
        <div className={`flex items-center w-full pt-6 pb-2 ${className}`}>
            <svg
                className="flex-1 h-12"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Chrome bars with gradient */}
                <defs>
                    <linearGradient
                        id="chrome-shine-left"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop
                            offset="50%"
                            stopColor="#E0E5EA"
                            stopOpacity="0.95"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffffff"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="chrome-shadow-left"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#000000"
                            stopOpacity="0.1"
                        />
                        <stop
                            offset="100%"
                            stopColor="#000000"
                            stopOpacity="0.3"
                        />
                    </linearGradient>
                </defs>

                {/* Top bar */}
                <rect
                    x="0"
                    y="20"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-left)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="22"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-left)"
                />

                {/* Middle bar */}
                <rect
                    x="0"
                    y="48"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-left)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="50"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-left)"
                />

                {/* Bottom bar */}
                <rect
                    x="0"
                    y="76"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-left)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="78"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-left)"
                />
            </svg>

            {/* Center text section with background */}
            <div className="relative px-8">
                {/* Text - appears in front */}
                <div className="relative z-10 px-6 py-3 bg-background/80 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground whitespace-nowrap">
                        {children}
                    </h2>
                </div>

                {/* SVG bars passing behind text - mirrored for symmetry */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        <linearGradient
                            id="chrome-shine-center"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#ffffff"
                                stopOpacity="0"
                            />
                            <stop
                                offset="50%"
                                stopColor="#E0E5EA"
                                stopOpacity="1"
                            />
                            <stop
                                offset="100%"
                                stopColor="#ffffff"
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>

                    {/* Top bar */}
                    <rect
                        x="0"
                        y="20"
                        width="100"
                        height="4"
                        fill="url(#chrome-shine-center)"
                        opacity="0.95"
                    />

                    {/* Middle bar */}
                    <rect
                        x="0"
                        y="48"
                        width="100"
                        height="4"
                        fill="url(#chrome-shine-center)"
                        opacity="0.95"
                    />

                    {/* Bottom bar */}
                    <rect
                        x="0"
                        y="76"
                        width="100"
                        height="4"
                        fill="url(#chrome-shine-center)"
                        opacity="0.95"
                    />
                </svg>
            </div>

            <svg
                className="flex-1 h-12"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Chrome bars with gradient */}
                <defs>
                    <linearGradient
                        id="chrome-shine-right"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop
                            offset="50%"
                            stopColor="#E0E5EA"
                            stopOpacity="0.95"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffffff"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="chrome-shadow-right"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#000000"
                            stopOpacity="0.1"
                        />
                        <stop
                            offset="100%"
                            stopColor="#000000"
                            stopOpacity="0.3"
                        />
                    </linearGradient>
                </defs>

                {/* Top bar */}
                <rect
                    x="0"
                    y="20"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-right)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="22"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-right)"
                />

                {/* Middle bar */}
                <rect
                    x="0"
                    y="48"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-right)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="50"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-right)"
                />

                {/* Bottom bar */}
                <rect
                    x="0"
                    y="76"
                    width="100"
                    height="4"
                    fill="url(#chrome-shine-right)"
                    opacity="0.9"
                />
                <rect
                    x="0"
                    y="78"
                    width="100"
                    height="2"
                    fill="url(#chrome-shadow-right)"
                />
            </svg>
        </div>
    );
};
