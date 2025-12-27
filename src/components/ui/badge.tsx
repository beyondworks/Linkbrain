import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';

/**
 * Badge 컴포넌트
 *
 * 상태나 카테고리를 표시하는 배지 컴포넌트입니다.
 *
 * Props:
 * @param {'default' | 'secondary' | 'destructive' | 'outline' | 'brand'} variant - 배지 스타일 [Optional, 기본값: 'default']
 *
 * Example usage:
 * <Badge variant="brand">NEW</Badge>
 */

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground',
                outline: 'text-foreground',
                brand:
                    'border-transparent bg-[rgba(33,219,164,0.1)] text-[#21DBA4]',
                success:
                    'border-transparent bg-[rgba(34,197,94,0.1)] text-[#22C55E]',
                warning:
                    'border-transparent bg-[rgba(245,158,11,0.1)] text-[#F59E0B]',
                error:
                    'border-transparent bg-[rgba(239,68,68,0.1)] text-[#EF4444]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
export type { BadgeProps };
