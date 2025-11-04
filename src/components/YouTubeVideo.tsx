import React from "react";

interface YouTubeVideoProps {
    videoId: string;
    title?: string;
    className?: string;
}

/**
 * YouTubeVideo - Responsive YouTube video embed component
 * Uses lazy loading and privacy-enhanced mode for optimal performance
 */
export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
    videoId,
    title,
    className = "",
}) => {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;

    return (
        <div className={`w-full ${className}`}>
            <div className="relative w-full aspect-video overflow-hidden rounded border border-border bg-muted">
                <iframe
                    src={embedUrl}
                    title={title || "YouTube video player"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );
};
