import React from "react";

export default function useMeasure() {
    const ref = React.useRef(null);
    const [rect, setRect] = React.useState({
        width: null,
        height: null,
    });

    React.useLayoutEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            if (entry && entry.contentRect) {
                setRect({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, []);

    return [ref, rect];
}