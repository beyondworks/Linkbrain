import { useRef, useCallback } from 'react';

interface LongPressOptions {
    onLongPress: () => void;
    onClick: () => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 500 }: LongPressOptions) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);
    const startPos = useRef<{ x: number; y: number } | null>(null);

    const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        // Only left click or single touch
        if (e.type === 'mousedown' && (e as React.MouseEvent).button !== 0) return;
        if (e.type === 'touchstart' && (e as React.TouchEvent).touches.length > 1) return;

        const clientX = e.type.startsWith('touch')
            ? (e as React.TouchEvent).touches[0].clientX
            : (e as React.MouseEvent).clientX;
        const clientY = e.type.startsWith('touch')
            ? (e as React.TouchEvent).touches[0].clientY
            : (e as React.MouseEvent).clientY;

        startPos.current = { x: clientX, y: clientY };
        isLongPress.current = false;

        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            if (navigator.vibrate) navigator.vibrate(50);
            onLongPress();
        }, delay);
    }, [onLongPress, delay]);

    const move = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (!startPos.current || !timerRef.current) return;

        const clientX = e.type.startsWith('touch')
            ? (e as React.TouchEvent).touches[0].clientX
            : (e as React.MouseEvent).clientX;
        const clientY = e.type.startsWith('touch')
            ? (e as React.TouchEvent).touches[0].clientY
            : (e as React.MouseEvent).clientY;

        const dx = Math.abs(clientX - startPos.current.x);
        const dy = Math.abs(clientY - startPos.current.y);

        if (dx > 10 || dy > 10) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const end = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!isLongPress.current && e.cancelable) {
            // It was a click
            // We rely on native onClick for actual action to ensure best a11y/compatibility
            // unless we want to force it.
            // But triggering onClick programmatically is tricky.
            // Let's just create a props object that we spread.
        }

        // Cleanup
        startPos.current = null;
        isLongPress.current = false;
    }, []);

    // For hybrid approach where we want to let native onClick fire if not long press
    // But we want to prevent onClick if it WAS a long press.

    const onClickHandler = useCallback((e: React.MouseEvent) => {
        if (isLongPress.current) {
            // It was a long press, so consume the click
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // Otherwise let it pass through to the element's onClick
        onClick();
    }, [onClick]);

    return {
        onMouseDown: start,
        onMouseMove: move,
        onMouseUp: end,
        onMouseLeave: end,
        onTouchStart: start,
        onTouchMove: move,
        onTouchEnd: end,
        onClick: onClickHandler
    };
};
