import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useLongPress from '../../hooks/useLongPress';

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

    // dnd-kit transform 스타일
    const dndStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        // 드래그 중일 때 원본을 완전히 숨김 (잔상 방지)
        opacity: isDragging ? 0 : 1,
        ...style,
    };

    // 롱프레스 이벤트 (일반 모드에서만 사용)
    const longPressEvents = useLongPress(
        () => {
            if (navigator.vibrate) navigator.vibrate(50);
            onLongPress();
        },
        onClick,
        { delay: 800 }
    );

    // 칩 클릭 시 이벤트 버블링 중단 (오버레이까지 전파 방지)
    const handleClick = (e: React.MouseEvent) => {
        if (isEditing) {
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={dndStyle}
            {...(isEditing ? { ...attributes, ...listeners } : longPressEvents)}
            onClick={handleClick}
            className={`${className} ${isEditing && !isDragging ? 'animate-shake cursor-move select-none' : 'cursor-pointer'} ${isEditing ? 'relative z-[60] touch-none' : ''}`}
        >
            {children}
        </div>
    );
}
