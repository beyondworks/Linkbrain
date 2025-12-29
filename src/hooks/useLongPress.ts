import { useRef, useCallback } from 'react';

interface Options {
    delay?: number;
}

const useLongPress = (
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void,
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void,
    { delay = 500 }: Options = {}
) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>(null);
    const isLongPress = useRef(false);

    const start = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            isLongPress.current = false;
            timeout.current = setTimeout(() => {
                isLongPress.current = true;
                onLongPress(event);
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
            // But if we already triggered long press, we shouldn't trigger click.
            if (!isLongPress.current && onClick) {
                onClick(event);
            }

            isLongPress.current = false;
        },
        [onClick]
    );

    const cancel = useCallback(() => {
        // Cancel everything if cursor moves out or scroll happens
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        isLongPress.current = false;
    }, []);

    return {
        onMouseDown: start,
        onTouchStart: start,
        onMouseUp: clear,
        onMouseLeave: cancel,
        onTouchEnd: clear,
        // Add touch move to cancel if user scrolls
        onTouchMove: cancel
    };
};

export default useLongPress;
