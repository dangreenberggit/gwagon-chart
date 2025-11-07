import { Logo } from "./Logo";
import { useState, useEffect } from "react";
import { ModeToggle } from "./mode-toggle";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
            {/* Subtle grille motif */}
            <div className="grille-pattern absolute inset-0 pointer-events-none" />

            {/* Motif band */}
            <div className="relative">
                <div className="mx-auto max-w-7xl px-3 sm:px-4">
                    <div className="relative h-12 flex items-center justify-between">
                        <div className="flex items-center flex-1">
                            {/* circular logo mask — no rim */}
                            <div className="relative z-20">
                                <Logo size="lg" loading="eager" />
                            </div>

                            {/* black bar with custom SVG shape */}
                            <div className="absolute z-10 left-5 top-1/2 -translate-y-1/2 h-10 w-[65%] sm:w-[60%] md:w-[28%]">
                                <svg
                                    viewBox="0 0 1000 80"
                                    preserveAspectRatio="none"
                                    className="absolute inset-0 w-full h-full header-bar"
                                >
                                    <path
                                        d="
                                            M 0 0
                                            L 960 0
                                            Q 985 0 995 12
                                            Q 1000 26 1000 40
                                            Q 1000 54 995 68
                                            Q 985 80 960 80
                                            L 0 80
                                            Z
                                        "
                                        className="header-bar-fill"
                                    />
                                </svg>

                                <h1 className="relative z-10 ml-8 text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tighter header-title flex items-center h-full">
                                    The G‑Class Economy
                                </h1>
                            </div>
                        </div>
                        <div className="relative z-30">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Word block */}
            <div
                className={`relative mx-auto max-w-7xl px-3 sm:px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    isScrolled
                        ? "max-h-0 py-0 opacity-0"
                        : "max-h-24 py-3 opacity-100"
                }`}
            >
                <div className="flex items-start gap-3">
                    <div className="w-px bg-mb-silver/60 self-stretch" />
                    <div className="leading-tight">
                        <p className="text-xs text-muted-foreground">
                            Markets, wealth, and G‑Class sales
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                            <span>Range: 2012–2024 • Annual</span>
                            <span className="hidden sm:inline h-3 w-px bg-border" />
                            <span>
                                Independent analysis; not affiliated with
                                Mercedes‑Benz
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
