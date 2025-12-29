import * as React from 'react';
import { cn } from '../ui/utils';

export interface Column<T> {
    /** 컬럼 키 */
    key: keyof T | string;
    /** 컬럼 헤더 */
    header: string;
    /** 셀 렌더러 (optional) */
    render?: (value: any, row: T) => React.ReactNode;
    /** 정렬 가능 여부 */
    sortable?: boolean;
}

interface DataTableProps<T> {
    /** 테이블 데이터 */
    data: T[];
    /** 컬럼 정의 */
    columns: Column<T>[];
    /** 다크 모드 여부 */
    isDark?: boolean;
    /** 추가 클래스명 */
    className?: string;
    /** 빈 상태 메시지 */
    emptyMessage?: string;
}

/**
 * DataTable 컴포넌트
 * 
 * 스토리북 테이블 패턴 100% 반영:
 * - rounded-3xl overflow-hidden
 * - thead: bg-slate-50 text-xs font-bold
 * - tbody: border-b hover:bg-slate-50/50
 * 
 * @example
 * <DataTable
 *   data={users}
 *   columns={[
 *     { key: 'email', header: '이메일' },
 *     { key: 'plan', header: '플랜', render: (v) => <Badge>{v}</Badge> },
 *   ]}
 * />
 */
export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isDark = false,
    className,
    emptyMessage = 'No data',
}: DataTableProps<T>) {
    return (
        <div className={cn(
            "rounded-3xl overflow-hidden border",
            isDark ? "bg-[#161B22] border-gray-800" : "bg-white border-slate-100",
            className
        )}>
            <table className="w-full text-left">
                <thead>
                    <tr className={isDark ? "bg-gray-800" : "bg-slate-100"}>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={cn(
                                    "py-3 px-4 text-xs font-bold uppercase tracking-wider",
                                    isDark ? "text-gray-500" : "text-slate-500"
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={cn(
                                    "py-12 text-center",
                                    isDark ? "text-gray-500" : "text-slate-400"
                                )}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={cn(
                                    "border-b transition-colors",
                                    isDark
                                        ? "border-gray-800 hover:bg-gray-800/50"
                                        : "border-slate-100 hover:bg-slate-50/50"
                                )}
                            >
                                {columns.map((col) => {
                                    const value = row[col.key as keyof T];
                                    return (
                                        <td
                                            key={String(col.key)}
                                            className={cn(
                                                "py-3 px-4 text-sm",
                                                isDark ? "text-white" : "text-slate-800"
                                            )}
                                        >
                                            {col.render ? col.render(value, row) : value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
