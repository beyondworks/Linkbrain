import React, { useRef, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableChipProps {
    id: string;
    isEditing: boolean;
    onLongPress: () => void;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function SortableChip({ id, isEditing, onLongPress, onClick, children, className, style }: SortableChipProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled: !isEditing });

    // Refs for touch handling
    const touchStartTime = useRef<number>(0);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchHandled = useRef(false);
    const touchMoved = useRef(false);
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const lastTouchTime = useRef<number>(0);

    // dnd-kit transform 스타일
    const dndStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        ...style,
    };

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        console.log('[SortableChip] touchStart, isEditing:', isEditing, 'id:', id);
        if (isEditing) return;

        touchStartTime.current = Date.now();
        touchHandled.current = false;
        touchMoved.current = false;

        if (e.touches.length > 0) {
            startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }

        // Long press detection
        longPressTimer.current = setTimeout(() => {
            if (!touchMoved.current) {
                touchHandled.current = true;
                if (navigator.vibrate) navigator.vibrate(50);
                onLongPress();
            }
        }, 800);
    }, [isEditing, onLongPress, id]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (startPos.current && e.touches.length > 0) {
            const dx = Math.abs(e.touches[0].clientX - startPos.current.x);
            const dy = Math.abs(e.touches[0].clientY - startPos.current.y);
            if (dx > 10 || dy > 10) {
                touchMoved.current = true;
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }
            }
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        console.log('[SortableChip] touchEnd, isEditing:', isEditing, 'touchHandled:', touchHandled.current, 'touchMoved:', touchMoved.current, 'id:', id);
        if (isEditing) return;

        // Record touch time to prevent ghost mouse events
        lastTouchTime.current = Date.now();

        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        // If touch was handled by long press or user moved, do nothing
        if (touchHandled.current || touchMoved.current) {
            touchHandled.current = false;
            return;
        }

        // Short tap - call onClick
        const duration = Date.now() - touchStartTime.current;
        console.log('[SortableChip] tap duration:', duration, 'calling onClick for id:', id);
        if (duration < 800) {
            touchHandled.current = true; // Prevent subsequent click event
            onClick();
        }
    }, [isEditing, onClick, id]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        // If editing, just stop propagation
        if (isEditing) {
            e.stopPropagation();
            return;
        }

        // If touch already handled onClick, prevent duplicate
        if (touchHandled.current) {
            e.stopPropagation();
            e.preventDefault();
            touchHandled.current = false;
            return;
        }

        // Mouse click is handled by mouseUp, so prevent duplicate here
        // This onClick fires after mouseUp, so we just prevent it
        e.stopPropagation();
    }, [isEditing]);

    // Mouse long-press handlers for desktop
    const mouseStartTime = useRef<number>(0);
    const mouseLongPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mouseHandled = useRef(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isEditing) return;

        // Ignore mouse events that follow touch events (mobile browsers fire both)
        if (Date.now() - lastTouchTime.current < 500) return;

        mouseStartTime.current = Date.now();
        mouseHandled.current = false;

        mouseLongPressTimer.current = setTimeout(() => {
            mouseHandled.current = true;
            onLongPress();
        }, 800);
    }, [isEditing, onLongPress]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (isEditing) return;

        // Ignore mouse events that follow touch events (mobile browsers fire both)
        if (Date.now() - lastTouchTime.current < 500) return;

        if (mouseLongPressTimer.current) {
            clearTimeout(mouseLongPressTimer.current);
            mouseLongPressTimer.current = null;
        }

        // If long press was handled, don't trigger click
        if (mouseHandled.current) {
            mouseHandled.current = false;
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        // Short click - call onClick
        const duration = Date.now() - mouseStartTime.current;
        if (duration < 800) {
            onClick();
        }
    }, [isEditing, onClick]);

    const handleMouseLeave = useCallback(() => {
        if (mouseLongPressTimer.current) {
            clearTimeout(mouseLongPressTimer.current);
            mouseLongPressTimer.current = null;
        }
    }, []);

    // Event handlers for non-editing mode
    const touchEvents = isEditing ? {} : {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    };

    const mouseEvents = isEditing ? {} : {
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseLeave,
    };

    return (
        <div
            ref={setNodeRef}
            style={dndStyle}
            {...(isEditing ? { ...attributes, ...listeners } : { ...touchEvents, ...mouseEvents })}
            onClick={handleClick}
            className={`${className} ${isEditing && !isDragging ? 'animate-shake cursor-move select-none' : 'cursor-pointer'} ${isEditing ? 'relative z-[60] touch-none' : ''}`}
        >
            {children}
        </div>
    );
}
