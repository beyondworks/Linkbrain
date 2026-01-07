import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLongPress } from '../../hooks/useLongPress';

interface BaseChipProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    // Handlers
    onClick?: (e: React.MouseEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseMove?: (e: React.MouseEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchMove?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e: React.TouchEvent) => void;
    // Refs
    innerRef?: React.Ref<HTMLDivElement>;
    attributes?: any;
    listeners?: any;
}

// Visual Component
export const ChipVisual = ({
    children,
    className,
    style,
    innerRef,
    attributes,
    listeners,
    ...handlers
}: BaseChipProps) => {
    return (
        <div
            ref={innerRef}
            style={style}
            className={className}
            {...attributes}
            {...listeners}
            {...handlers}
        >
            {children}
        </div>
    );
};

interface SortableChipProps {
    id: string;
    onLongPress: () => void;
    onClick: () => void; // Not used in Sortable mode but kept for API compatibility if needed
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

// 1. Sortable Version (For Edit Mode)
export function SortableChip({ id, children, className, style }: SortableChipProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const dndStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        ...style,
    };

    return (
        <ChipVisual
            innerRef={setNodeRef}
            style={dndStyle}
            className={`${className} ${!isDragging ? 'animate-shake' : ''} cursor-move select-none relative z-[60] touch-none`}
            attributes={attributes}
            listeners={listeners}
        >
            {children}
        </ChipVisual>
    );
}

// 2. Static Version (For View Mode) - Native Touch/Click
export function StaticChip({ onLongPress, onClick, children, className, style }: SortableChipProps) {
    const longPressHandlers = useLongPress({
        onLongPress,
        onClick,
        delay: 500
    });

    return (
        <ChipVisual
            style={style}
            className={`${className} cursor-pointer`}
            {...longPressHandlers}
        >
            {children}
        </ChipVisual>
    );
}
