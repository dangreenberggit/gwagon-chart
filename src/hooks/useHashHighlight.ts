import { useState, useEffect } from "react";
import { FooterAnchors } from "@/constants/strings";

// All valid footer anchor IDs
const validAnchorIds = Object.values(FooterAnchors);

export function useHashHighlight() {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    useEffect(() => {
        // Function to get the current hash without #
        const getHashId = () => {
            const hash = window.location.hash.slice(1); // Remove #
            // Check if this hash matches any of our footer anchor IDs
            if (validAnchorIds.includes(hash as any)) {
                return hash;
            }
            return null;
        };

        // Set initial hash if present
        const initialHash = getHashId();
        if (initialHash) {
            setHighlightedId(initialHash);
        }

        // Handler for hash changes
        const handleHashChange = () => {
            const hash = getHashId();
            if (hash) {
                setHighlightedId(hash);
            } else {
                setHighlightedId(null);
            }
        };

        // Listen for hash changes
        window.addEventListener("hashchange", handleHashChange);

        // Auto-clear highlight after 6 seconds if hash is set
        let timeoutId: NodeJS.Timeout | null = null;
        const updateTimeout = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            const currentHash = getHashId();
            if (currentHash) {
                timeoutId = setTimeout(() => {
                    setHighlightedId(null);
                    // Optionally clear the hash from URL
                    if (window.location.hash) {
                        window.history.replaceState(
                            null,
                            "",
                            window.location.pathname + window.location.search
                        );
                    }
                }, 6000); // 6 seconds
            }
        };

        if (initialHash) {
            updateTimeout();
        }

        // Update timeout whenever hash changes
        const handleHashChangeWithTimeout = () => {
            handleHashChange();
            updateTimeout();
        };

        // Replace the handler with one that also manages timeout
        window.removeEventListener("hashchange", handleHashChange);
        window.addEventListener("hashchange", handleHashChangeWithTimeout);

        // Cleanup
        return () => {
            window.removeEventListener("hashchange", handleHashChangeWithTimeout);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    // Helper to check if a specific anchor ID is highlighted
    const isHighlighted = (anchorId: string) => {
        return highlightedId === anchorId;
    };

    return { highlightedId, isHighlighted };
}

