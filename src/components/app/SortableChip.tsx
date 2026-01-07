import React, { useRef, useCallback, useState } from 'react';
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

    // Simple flag to prevent double-firing
    const isProcessing = useRef(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);
    const didMove = useRef(false);

    // dnd-kit transform style
    const dndStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        ...style,
    };

    // Clean up timer
    const clearLongPressTimer = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, []);

    // Unified handler for both touch and mouse
    const handleInteractionStart = useCallback((clientX: number, clientY: number) => {
        if (isEditing || isProcessing.current) return;

        touchStartPos.current = { x: clientX, y: clientY };
        didMove.current = false;

        // Long press: 500ms (reduced from 800ms for faster response)
        longPressTimer.current = setTimeout(() => {
            if (!didMove.current && !isProcessing.current) {
                isProcessing.current = true;
                if (navigator.vibrate) navigator.vibrate(30);
                onLongPress();
                // Reset after a short delay
                setTimeout(() => { isProcessing.current = false; }, 300);
            }
        }, 500);
    }, [isEditing, onLongPress]);

    const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
        if (!touchStartPos.current) return;

        const dx = Math.abs(clientX - touchStartPos.current.x);
        const dy = Math.abs(clientY - touchStartPos.current.y);

        // If moved more than 8px, cancel long press
        if (dx > 8 || dy > 8) {
            didMove.current = true;
            clearLongPressTimer();
        }
    }, [clearLongPressTimer]);

    const handleInteractionEnd = useCallback(() => {
        clearLongPressTimer();

        // If editing mode, moved, or already processing, skip
        if (isEditing || didMove.current || isProcessing.current) {
            touchStartPos.current = null;
            return;
        }

        // Trigger click
        isProcessing.current = true;
        onClick();

        // Reset processing flag after debounce period
        setTimeout(() => {
            isProcessing.current = false;
        }, 200);

        touchStartPos.current = null;
    }, [isEditing, onClick, clearLongPressTimer]);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleInteractionStart]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleInteractionMove]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault(); // Prevent ghost click
        e.stopPropagation();
        handleInteractionEnd();
    }, [handleInteractionEnd]);

    // Mouse handlers (for desktop)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        handleInteractionStart(e.clientX, e.clientY);
    }, [handleInteractionStart]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        handleInteractionMove(e.clientX, e.clientY);
    }, [handleInteractionMove]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        handleInteractionEnd();
    }, [handleInteractionEnd]);

    const handleMouseLeave = useCallback(() => {
        clearLongPressTimer();
        touchStartPos.current = null;
    }, [clearLongPressTimer]);

    // Prevent default click to avoid double-firing
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);

    // Choose event handlers based on mode
    const interactionHandlers = isEditing
        ? { ...attributes, ...listeners }
        : {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseLeave,
            onClick: handleClick,
        };

    return (
        <div
            ref={setNodeRef}
            style={dndStyle}
            {...interactionHandlers}
            className={`${className} ${isEditing && !isDragging ? 'animate-shake cursor-move select-none' : 'cursor-pointer'} ${isEditing ? 'relative z-[60] touch-none' : ''}`}
        >
            {children}
        </div>
    );
}
