import { useState, useEffect } from "react";
import { FooterAnchors } from "@/constants/strings";

const validAnchorIds = Object.values(FooterAnchors);

/**
 * Hook that manages highlighting of footer anchor elements based on URL hash.
 * Automatically clears the highlight after 6 seconds and removes the hash from the URL.
 * 
 * @returns Object containing:
 *   - highlightedId: The currently highlighted anchor ID, or null if none.
 *   - isHighlighted: Function to check if a specific anchor ID is highlighted.
 */
export function useHashHighlight() {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    useEffect(() => {
        const getHashId = () => {
            const hash = window.location.hash.slice(1);
            if (validAnchorIds.includes(hash as any)) {
                return hash;
            }
            return null;
        };

        const initialHash = getHashId();
        if (initialHash) {
            setHighlightedId(initialHash);
        }

        const handleHashChange = () => {
            const hash = getHashId();
            if (hash) {
                setHighlightedId(hash);
            } else {
                setHighlightedId(null);
            }
        };

        window.addEventListener("hashchange", handleHashChange);

        let timeoutId: NodeJS.Timeout | null = null;
        const updateTimeout = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            const currentHash = getHashId();
            if (currentHash) {
                timeoutId = setTimeout(() => {
                    setHighlightedId(null);
                    if (window.location.hash) {
                        window.history.replaceState(
                            null,
                            "",
                            window.location.pathname + window.location.search
                        );
                    }
                }, 6000);
            }
        };

        if (initialHash) {
            updateTimeout();
        }

        const handleHashChangeWithTimeout = () => {
            handleHashChange();
            updateTimeout();
        };

        window.removeEventListener("hashchange", handleHashChange);
        window.addEventListener("hashchange", handleHashChangeWithTimeout);

        return () => {
            window.removeEventListener("hashchange", handleHashChangeWithTimeout);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const isHighlighted = (anchorId: string) => {
        return highlightedId === anchorId;
    };

    return { highlightedId, isHighlighted };
}

