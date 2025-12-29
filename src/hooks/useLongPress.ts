import { useRef, useCallback } from 'react';

interface Options {
    delay?: number;
    moveThreshold?: number; // pixels of movement allowed before canceling
}

const useLongPress = (
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void,
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void,
    { delay = 500, moveThreshold = 10 }: Options = {}
) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>(null);
    const isLongPress = useRef(false);
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const hasMoved = useRef(false);

    const start = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            isLongPress.current = false;
            hasMoved.current = false;

            // Store start position for scroll detection
            if ('touches' in event && event.touches.length > 0) {
                startPos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            } else if ('clientX' in event) {
                startPos.current = { x: event.clientX, y: event.clientY };
            }

            timeout.current = setTimeout(() => {
                if (!hasMoved.current) {
                    isLongPress.current = true;
                    onLongPress(event);
                }
            }, delay);
        },
        [onLongPress, delay]
    );

    const clear = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            // If the press duration was shorter than 'delay', it's a click.
            // But if we already triggered long press or moved too much, we shouldn't trigger click.
            if (!isLongPress.current && !hasMoved.current && onClick) {
                onClick(event);
            }

            isLongPress.current = false;
            hasMoved.current = false;
            startPos.current = null;
        },
        [onClick]
    );

    const cancel = useCallback(() => {
        // Cancel everything if cursor moves out or scroll happens
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        isLongPress.current = false;
        hasMoved.current = true; // Mark as moved so click doesn't fire
    }, []);

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        // Check if user has moved beyond threshold (likely scrolling)
        if (startPos.current && event.touches.length > 0) {
            const dx = Math.abs(event.touches[0].clientX - startPos.current.x);
            const dy = Math.abs(event.touches[0].clientY - startPos.current.y);
            if (dx > moveThreshold || dy > moveThreshold) {
                hasMoved.current = true;
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }
            }
        }
    }, [moveThreshold]);

    return {
        onMouseDown: start,
        onTouchStart: start,
        onMouseUp: clear,
        onMouseLeave: cancel,
        onTouchEnd: clear,
        // Cancel if user scrolls beyond threshold
        onTouchMove: handleTouchMove
    };
};

export default useLongPress;

