/**
 * Export Service
 * 
 * 유저 데이터를 다양한 형식으로 내보내기
 * - CSV: 엑셀/구글 시트 호환
 * - Markdown: Obsidian/Notion 호환
 * - JSON: 백업/마이그레이션용
 */

export interface ExportableClip {
    id: string;
    title: string;
    url: string;
    category?: string;
    tags?: string[];
    savedAt: string;
    summary?: string;
    notes?: string;
    collectionIds?: string[];
}

export interface ExportableCollection {
    id: string;
    name: string;
    clipCount: number;
}

export interface ExportData {
    clips: ExportableClip[];
    collections?: ExportableCollection[];
    exportedAt: string;
    totalClips: number;
}

/**
 * 클립 데이터를 CSV 형식으로 변환
 */
export const exportToCSV = (clips: ExportableClip[]): string => {
    const headers = ['제목', 'URL', '카테고리', '태그', '저장일', '요약', '메모'];
    const headerRow = headers.join(',');

    const rows = clips.map(clip => {
        const escapeCsv = (str: string | undefined) => {
            if (!str) return '';
            // CSV에서 쌍따옴표와 콤마 처리
            const escaped = str.replace(/"/g, '""');
            return `"${escaped}"`;
        };

        return [
            escapeCsv(clip.title),
            escapeCsv(clip.url),
            escapeCsv(clip.category),
            escapeCsv(clip.tags?.join(', ')),
            escapeCsv(clip.savedAt),
            escapeCsv(clip.summary),
            escapeCsv(clip.notes),
        ].join(',');
    });

    return [headerRow, ...rows].join('\n');
};

/**
 * 클립 데이터를 Markdown 형식으로 변환
 */
export const exportToMarkdown = (clips: ExportableClip[], title: string = 'LinkBrain Export'): string => {
    const now = new Date().toLocaleDateString('ko-KR');
    let md = `# ${title}\n\n`;
    md += `> Exported on ${now}\n\n`;
    md += `---\n\n`;

    // 카테고리별로 그룹화
    const byCategory = clips.reduce((acc, clip) => {
        const cat = clip.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(clip);
        return acc;
    }, {} as Record<string, ExportableClip[]>);

    for (const [category, categoryClips] of Object.entries(byCategory)) {
        md += `## ${category}\n\n`;

        for (const clip of categoryClips) {
            md += `### [${clip.title}](${clip.url})\n\n`;
            md += `- **저장일**: ${clip.savedAt}\n`;

            if (clip.tags && clip.tags.length > 0) {
                md += `- **태그**: ${clip.tags.map(t => `#${t}`).join(' ')}\n`;
            }

            if (clip.summary) {
                md += `\n> ${clip.summary}\n`;
            }

            if (clip.notes) {
                md += `\n**메모**: ${clip.notes}\n`;
            }

            md += '\n---\n\n';
        }
    }

    return md;
};

/**
 * 클립 데이터를 JSON 형식으로 변환
 */
export const exportToJSON = (data: ExportData): string => {
    return JSON.stringify(data, null, 2);
};

/**
 * 파일 다운로드 트리거
 */
export const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * 전체 내보내기 실행
 */
export const performExport = (
    clips: ExportableClip[],
    format: 'csv' | 'markdown' | 'json',
    collections?: ExportableCollection[]
) => {
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
        case 'csv': {
            const content = exportToCSV(clips);
            downloadFile(content, `linkbrain-export-${timestamp}.csv`, 'text/csv;charset=utf-8;');
            break;
        }
        case 'markdown': {
            const content = exportToMarkdown(clips);
            downloadFile(content, `linkbrain-export-${timestamp}.md`, 'text/markdown;charset=utf-8;');
            break;
        }
        case 'json': {
            const data: ExportData = {
                clips,
                collections,
                exportedAt: new Date().toISOString(),
                totalClips: clips.length,
            };
            const content = exportToJSON(data);
            downloadFile(content, `linkbrain-export-${timestamp}.json`, 'application/json;charset=utf-8;');
            break;
        }
    }
};
